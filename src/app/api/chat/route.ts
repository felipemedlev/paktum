import { OpenAIStream, StreamingTextResponse } from 'ai';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { systemPrompt } from '@/lib/prompt';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, contractId } = await req.json();

    if (!contractId || !messages) {
      return new Response('Missing contractId or messages', { status: 400 });
    }

    // Initialize Supabase admin client to bypass RLS since this might run on the edge
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch contract and analysis context
    const { data: contract } = await supabaseAdmin
      .from('contracts')
      .select('*, analyses(summary, flagged_clauses, overall_score)')
      .eq('id', contractId)
      .single();

    if (!contract) {
      return new Response('Contract not found', { status: 404 });
    }

    // Build context
    const analysis = contract.analyses?.[0];
    const contractContext = `
      Job Title: ${contract.job_title}
      Years of Experience: ${contract.years_of_experience}
      Analysis Score: ${analysis?.overall_score}/100
      Analysis Summary: ${analysis?.summary}
      Flagged Clauses: ${JSON.stringify(analysis?.flagged_clauses)}
    `;

    // Construct the full prompt
    const chatMessages = [
      {
        role: 'system',
        content: `${systemPrompt}\n\nHere is the context of the user's contract analysis:\n${contractContext}`
      },
      ...messages
    ];

    // Request OpenAI streaming completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: chatMessages,
    });

    // Stream the response out to the client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = OpenAIStream(response as any, {
      onCompletion: async (completion: string) => {
        // Save the conversation history in the background after the stream completes
        const userMessage = messages[messages.length - 1];
        await supabaseAdmin.from('messages').insert([
          { contract_id: contractId, role: 'user', content: userMessage.content },
          { contract_id: contractId, role: 'assistant', content: completion }
        ]);
      }
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
