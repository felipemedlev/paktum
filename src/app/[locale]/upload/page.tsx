'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUploader } from '@/components/FileUploader';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, FileText } from 'lucide-react';
import { uploadContractAction } from './actions';

export default function UploadPage() {
  const t = useTranslations('Upload');
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('file', file);

      // Call Server Action
      const result = await uploadContractAction(formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result.contractId) {
        // Trigger background analysis asynchronously (fire-and-forget)
        fetch('/api/contracts/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contractId: result.contractId })
        }).catch(console.error);

        // Redirect to analysis page
        router.push(`/contracts/${result.contractId}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during upload.');
      } else {
        setError('An unexpected error occurred.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-16 bg-[#f5f5f7] min-h-screen">
      <div className="animate-scale-in">
        <Card className="shadow-apple-lg border-border bg-white/90 backdrop-blur-xl p-2 sm:p-4">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-[15px] text-muted mt-2">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-danger-light text-danger text-sm font-medium rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium text-foreground">
                    {t('jobTitleLabel')}
                  </label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    required
                    placeholder={t('jobTitlePlaceholder')}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium text-foreground">
                    {t('experienceLabel')}
                  </label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    required
                    placeholder={t('experiencePlaceholder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground">
                  {t('fileUploadLabel')}
                </label>
                <FileUploader selectedFile={file} onFileSelect={setFile} />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-[15px] rounded-xl font-semibold"
                  disabled={isLoading || !file}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('uploadingText')}
                    </>
                  ) : (
                    t('submitButton')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
