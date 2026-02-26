import { createClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { ChatPanel } from '@/components/ChatPanel';
import { Card, CardContent } from '@/components/ui/Card';
import { FileText, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function ContractAnalysisPage({ params }: { params: { id: string, locale: string } }) {
  const t = await getTranslations('Analysis');
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: contract, error } = await supabase
    .from('contracts')
    .select('*, analyses(*)')
    .eq('id', params.id)
    .single();

  if (error || !contract || contract.user_id !== user?.id) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 py-16 flex flex-col items-center justify-center min-h-[50vh] animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-danger-light flex items-center justify-center mb-6">
          <AlertCircle className="h-7 w-7 text-danger" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">{t('errorMessage')}</h1>
        <Button asChild variant="outline" className="mt-6 rounded-xl">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const isPending = contract.status === 'pending' || contract.status === 'analyzing';

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Breadcrumb + Header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-1.5 text-sm text-muted mb-4">
          <Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{contract.job_title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {contract.job_title}
            </h1>
            <p className="text-muted text-sm mt-0.5">
              {contract.years_of_experience} Years Experience • Uploaded on {new Date(contract.created_at).toLocaleDateString(params.locale)}
            </p>
          </div>
        </div>
      </div>

      {isPending ? (
        <Card className="border-border text-center py-24 px-6 animate-scale-in">
          <CardContent className="flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl bg-accent/15 animate-pulse-glow" />
              <div className="relative w-20 h-20 rounded-full bg-white border border-border shadow-apple-md flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-accent animate-spin" />
              </div>
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {contract.status === 'analyzing' ? 'Analyzing Contract...' : 'Preparing Analysis...'}
              </h3>
              <p className="text-muted text-sm">
                {t('pendingMessage')}
              </p>
            </div>

            {/* Auto-refresh meta tag to check status */}
            <meta httpEquiv="refresh" content="5" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Left Column: Analysis Results */}
          <div className="w-full animate-fade-in-up">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              {t('analysisTab')}
            </h2>
            <AnalysisPanel analysis={contract.analyses?.[0] || null} />
          </div>

          {/* Right Column: AI Chat */}
          <div className="w-full lg:sticky lg:top-24 animate-fade-in-up delay-200">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              {t('chatTab')}
            </h2>
            <ChatPanel contractId={contract.id} />
          </div>
        </div>
      )}
    </div>
  );
}
