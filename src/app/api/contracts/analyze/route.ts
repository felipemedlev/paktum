import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseDocument } from '@/lib/parsers';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import OpenAI from 'openai';
import { systemPrompt } from '@/lib/prompt';

// We use the service role key to bypass RLS for fetching the file from storage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { contractId } = await req.json();

    if (!contractId) {
      return NextResponse.json({ error: 'Missing contractId' }, { status: 400 });
    }

    // 1. Fetch contract record
    const { data: contract, error: contractError } = await supabaseAdmin
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      console.error(contractError);
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Update status to analyzing
    await supabaseAdmin
      .from('contracts')
      .update({ status: 'analyzing' })
      .eq('id', contractId);

    // 2. Download file from Storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('contracts')
      .download(contract.file_path);

    if (downloadError || !fileData) {
      console.error(downloadError);
      await updateStatus(contractId, 'error');
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());

    // 3. Parse Document
    const textContent = await parseDocument(buffer, contract.file_type);

    if (!textContent || textContent.trim() === '') {
      await updateStatus(contractId, 'error');
      return NextResponse.json({ error: 'Blank or unreadable document' }, { status: 400 });
    }

    // 4. Chunking (RAG preparation)
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([textContent]);

    // Embed content sequentially
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small"
    });

    const embeddingsArr = await embeddings.embedDocuments(chunks.map(c => c.pageContent));
    const queryEmbedding = await embeddings.embedQuery("Israeli employment law clauses deviation fairness standards");

    const similarities = embeddingsArr.map((emb, idx) => {
      let dot = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < emb.length; i++) {
        dot += emb[i] * queryEmbedding[i];
        normA += emb[i] * emb[i];
        normB += queryEmbedding[i] * queryEmbedding[i];
      }
      return { chunk: chunks[idx], score: dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1) };
    });

    similarities.sort((a, b) => b.score - a.score);
    const relevantDocs = similarities.slice(0, 5).map(s => s.chunk);
    const contextText = relevantDocs.map(d => d.pageContent).join('\n\n');

    // 5. Query OpenAI GPT-4o for Structural JSON Analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `You need to analyze the following contract excerpts.
          Return ONLY a JSON object with this exact structure:
          {
            "summary": "A brief overall summary of the contract.",
            "overall_score": 85,
            "flagged_clauses": [
              { "clause": "Clause text", "issue": "Why it's an issue", "severity": "low/medium/high" }
            ],
            "negotiation_messages": [
              { "clause": "Clause text", "message": "The message I should send" }
            ]
          }

          Job Title: ${contract.job_title}
          Years of Experience: ${contract.years_of_experience}

          Contract Context:
          ${contextText}`
        }
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    const parsedData = JSON.parse(aiResponse!);

    // 6. Save results to analyses table
    const { error: analysisError } = await supabaseAdmin
      .from('analyses')
      .insert({
        contract_id: contractId,
        summary: parsedData.summary,
        flagged_clauses: parsedData.flagged_clauses,
        negotiation_messages: parsedData.negotiation_messages,
        overall_score: parsedData.overall_score
      });

    if (analysisError) {
      console.error(analysisError);
      await updateStatus(contractId, 'error');
      return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
    }

    // 7. Update status to done
    await updateStatus(contractId, 'done');

    return NextResponse.json({ success: true, contractId });
  } catch (error) {
    console.error('Analysis Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateStatus(contractId: string, status: string) {
  await supabaseAdmin
    .from('contracts')
    .update({ status })
    .eq('id', contractId);
}
