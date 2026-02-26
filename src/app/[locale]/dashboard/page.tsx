import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { ContractCard } from '@/components/ContractCard';
import { Button } from '@/components/ui/Button';
import { PlusCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const t = await getTranslations('Dashboard');
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch contracts
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, analyses(overall_score)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  // Map to include score if available
  const formattedContracts = contracts?.map(c => ({
    id: c.id,
    job_title: c.job_title,
    status: c.status,
    created_at: c.created_at,
    score: c.analyses && c.analyses.length > 0 ? c.analyses[0].overall_score : undefined
  })) || [];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {t('title')}
          </h1>
        </div>
        <Button asChild className="rounded-xl font-semibold shadow-apple-sm">
          <Link href="/upload">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('uploadNew')}
          </Link>
        </Button>
      </div>

      {formattedContracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white/80 backdrop-blur-xl rounded-2xl border border-border text-center min-h-[400px] animate-scale-in">
          <div className="mb-6 w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center">
            <FileText className="h-9 w-9 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t('noContracts')}
          </h3>
          <p className="text-muted mb-8 max-w-sm text-[15px] leading-relaxed">
            {t('noContractsDesc')}
          </p>
          <Button asChild className="rounded-xl font-semibold">
            <Link href="/upload">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('uploadNew')}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {formattedContracts.map((contract, idx) => (
            <div key={contract.id} className={`animate-fade-in-up delay-${(idx % 4 + 1) * 100}`}>
              <ContractCard contract={contract} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
