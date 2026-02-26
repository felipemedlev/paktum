import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

interface ContractCardProps {
  contract: {
    id: string;
    job_title: string;
    status: string;
    created_at: string;
    score?: number;
  };
}

export function ContractCard({ contract }: ContractCardProps) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <Badge variant="success">{t('statusDone')}</Badge>;
      case 'analyzing':
        return <Badge variant="warning">{t('statusAnalyzing')}</Badge>;
      case 'error':
        return <Badge variant="destructive">{t('statusError')}</Badge>;
      default:
        return <Badge variant="secondary">{t('statusPending')}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const formattedDate = new Date(contract.created_at).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="hover:shadow-apple-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer">
      <Link href={`/contracts/${contract.id}`} className="block">
        <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-accent" />
            </div>
            <CardTitle className="text-base font-semibold truncate max-w-[180px]">
              {contract.job_title}
            </CardTitle>
          </div>
          {getStatusBadge(contract.status)}
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm text-muted">
            <span>{t('uploadedLabel')}</span>
            <time dateTime={contract.created_at}>{formattedDate}</time>
          </div>

          {contract.status === 'done' && contract.score !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">{t('scoreLabel')}</span>
              <span className={`text-lg font-bold ${getScoreColor(contract.score)}`}>
                {contract.score}<span className="text-sm font-normal text-muted">/100</span>
              </span>
            </div>
          )}

          <div className="mt-1 flex items-center justify-end text-sm font-medium text-accent group-hover:gap-2 transition-all">
            {t('viewAnalysis')}
            <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
