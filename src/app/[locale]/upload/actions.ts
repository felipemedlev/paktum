'use server';

import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function uploadContractAction(formData: FormData) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to upload a contract.' };
    }

    const file = formData.get('file') as File;
    const jobTitle = formData.get('jobTitle') as string;
    const experience = parseInt(formData.get('experience') as string, 10);

    if (!file || !jobTitle || isNaN(experience)) {
      return { error: 'Please provide all required fields.' };
    }

    // 1. Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('contracts')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return { error: 'Failed to upload file to storage.' };
    }

    // 2. Insert into contracts table
    let fileType = 'txt';
    if (file.type === 'application/pdf') fileType = 'pdf';
    else if (file.type.includes('wordprocessingml')) fileType = 'docx';
    else if (file.type.startsWith('image/')) fileType = 'image';

    const { data: contract, error: dbError } = await supabase
      .from('contracts')
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        years_of_experience: experience,
        file_name: file.name,
        file_path: filePath,
        file_type: fileType,
        status: 'pending' // analyze API will set to analyzing/done
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('DB Insert Error:', dbError);
      return { error: 'Failed to save contract details.' };
    }

    return { contractId: contract.id };
  } catch (err: unknown) {
    console.error('Server Action Error:', err);
    return { error: err instanceof Error ? err.message : 'An unexpected error occurred.' };
  }
}
