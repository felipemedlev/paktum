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

    // Check for duplicates
    const { data: existingContract, error: existingError } = await supabase
      .from('contracts')
      .select('id')
      .eq('user_id', user.id)
      .eq('file_name', file.name)
      .maybeSingle();

    if (existingError) {
      console.error('Duplicate Check Error:', existingError);
      return { error: 'Failed to verify file uniqueness.' };
    }

    if (existingContract) {
      return { error: 'You have already uploaded a contract with this file name.' };
    }

    // Set up file extension and path
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${uuidv4()}.${fileExt}`;

    // Set up file type for the database
    let fileType = 'txt';
    if (file.type === 'application/pdf') fileType = 'pdf';
    else if (file.type.includes('wordprocessingml')) fileType = 'docx';
    else if (file.type.startsWith('image/')) fileType = 'image';

    // 1 & 2. Execute Upload and DB Insert Concurrently
    const uploadPromise = supabase.storage
      .from('contracts')
      .upload(filePath, file);

    const dbInsertPromise = supabase
      .from('contracts')
      .insert({
        user_id: user.id,
        user_email: user.email,
        job_title: jobTitle,
        years_of_experience: experience,
        file_name: file.name,
        file_path: filePath,
        file_type: fileType,
        status: 'pending' // analyze API will set to analyzing/done
      })
      .select('id')
      .single();

    const [uploadResult, dbResult] = await Promise.all([uploadPromise, dbInsertPromise]);

    if (uploadResult.error) {
      console.error('Upload Error:', uploadResult.error);
      return { error: 'Failed to upload file to storage.' };
    }

    if (dbResult.error) {
      console.error('DB Insert Error:', dbResult.error);
      return { error: 'Failed to save contract details.' };
    }

    return { contractId: dbResult.data.id };
  } catch (err: unknown) {
    console.error('Server Action Error:', err);
    return { error: err instanceof Error ? err.message : 'An unexpected error occurred.' };
  }
}
