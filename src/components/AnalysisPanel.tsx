'use client';

import { useTranslations } from 'next-intl';
import { ScoreRing } from './ScoreRing';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Copy, AlertTriangle, ShieldAlert, AlertCircle, MessageSquareQuote, Check } from 'lucide-react';
import { useState } from 'react';

interface AnalysisPanelProps {
  analysis: {
    overall_score: number;
    summary: string;
    flagged_clauses: { clause: string; issue: string; severity: 'low' | 'medium' | 'high' }[];
    negotiation_messages: { clause: string; message: string }[];
  } | null;
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const t = useTranslations('Analysis');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!analysis) return null;

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive" className="flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> {t('severityHigh')}</Badge>;
      case 'medium':
        return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {t('severityMedium')}</Badge>;
      case 'low':
      default:
        return <Badge variant="secondary" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {t('severityLow')}</Badge>;
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'border-l-danger';
      case 'medium': return 'border-l-warning';
      default: return 'border-l-muted';
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Score & Summary Banner */}
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-border shadow-apple-sm">
        <div className="flex flex-col items-center justify-center shrink-0">
          <ScoreRing score={analysis.overall_score} />
          <h2 className="text-sm font-semibold text-muted mt-4">{t('overallScore')}</h2>
        </div>
        <div className="flex-1 flex flex-col border-l-0 md:border-l border-border md:pl-6 pt-4 md:pt-0 rtl:md:border-l-0 rtl:md:border-r rtl:md:pl-0 rtl:md:pr-6">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 text-accent" />
            {t('summary')}
          </h3>
          <p className="text-muted leading-relaxed text-[15px]">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Flagged Clauses */}
      {analysis.flagged_clauses?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{t('flaggedClauses')}</h3>
          <div className="grid gap-4">
            {analysis.flagged_clauses.map((flag, idx) => {
              const negMsg = analysis.negotiation_messages?.find(n => n.clause === flag.clause);

              return (
                <Card key={idx} className={`border-l-4 ${getSeverityBorderColor(flag.severity)} overflow-hidden`}>
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div className="bg-[#f5f5f7] p-3 rounded-xl text-sm font-mono text-foreground/80 flex-1 leading-relaxed">
                        &quot;{flag.clause}&quot;
                      </div>
                      <div className="shrink-0">
                        {getSeverityBadge(flag.severity)}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mb-4">
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <p className="text-foreground text-sm">
                        <span className="font-semibold mr-1">{t('issue')}</span>
                        {flag.issue}
                      </p>
                    </div>

                    {/* Negotiation Template */}
                    {negMsg && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="bg-accent/5 p-4 rounded-xl flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                          <p className="text-sm text-accent/90 italic font-medium leading-relaxed">
                            &quot;{negMsg.message}&quot;
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 rounded-lg border-accent/20 text-accent hover:bg-accent/10"
                            onClick={() => copyToClipboard(negMsg.message, idx)}
                          >
                            {copiedIndex === idx ? (
                              <span className="flex items-center gap-1 text-success"><Check className="h-3 w-3" /> {t('copiedMessage')}</span>
                            ) : (
                              <span className="flex items-center gap-1"><Copy className="h-3 w-3" /> {t('copyMessage')}</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
