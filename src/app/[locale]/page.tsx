import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, FileSearch, MessageSquareQuote, Bot, Upload, Cpu, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('Landing');

  const features = [
    {
      title: t('featureUpload'),
      description: t('featureUploadDesc'),
      icon: <ShieldCheck className="h-6 w-6" />,
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      title: t('featureAnalyze'),
      description: t('featureAnalyzeDesc'),
      icon: <FileSearch className="h-6 w-6" />,
      gradient: 'from-violet-500 to-purple-400',
    },
    {
      title: t('featureNegotiate'),
      description: t('featureNegotiateDesc'),
      icon: <MessageSquareQuote className="h-6 w-6" />,
      gradient: 'from-orange-500 to-amber-400',
    },
    {
      title: t('featureChat'),
      description: t('featureChatDesc'),
      icon: <Bot className="h-6 w-6" />,
      gradient: 'from-emerald-500 to-teal-400',
    },
  ];

  const steps = [
    {
      number: '01',
      title: t('step1Title'),
      description: t('step1Desc'),
      icon: <Upload className="h-6 w-6" />,
    },
    {
      number: '02',
      title: t('step2Title'),
      description: t('step2Desc'),
      icon: <Cpu className="h-6 w-6" />,
    },
    {
      number: '03',
      title: t('step3Title'),
      description: t('step3Desc'),
      icon: <CheckCircle2 className="h-6 w-6" />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ═══════════════ Hero Section ═══════════════ */}
      <section className="hero-gradient relative text-white py-12 sm:py-16 px-6 sm:px-12 flex flex-col items-center justify-center text-center">
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>AI-Powered Legal Analysis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.08] gradient-text">
            {t('heroTitle')}
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="glow" className="rounded-2xl px-10 text-base font-semibold">
              <Link href="/register">
                {t('signUp')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-2xl px-10 text-base font-semibold border-white/20 text-white hover:bg-white/10 hover:text-white">
              <Link href="/login">{t('getStarted')}</Link>
            </Button>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/15 rounded-full blur-[80px] animate-pulse-glow delay-300" />
      </section>

      {/* ═══════════════ Trust Bar ═══════════════ */}
      <section className="py-4 px-6 sm:px-12 bg-white border-b border-border">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted text-sm font-medium uppercase tracking-widest">
            {t('trustLine')}
          </p>
        </div>
      </section>

      {/* ═══════════════ Features Section ═══════════════ */}
      <section className="py-24 sm:py-10 px-6 sm:px-12 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-foreground tracking-tight">
            {t('featuresTitle')}
          </h2>
          <p className="text-muted text-center max-w-xl mx-auto mb-16 text-lg">
            Powerful tools designed with simplicity in mind.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group relative flex flex-col items-center text-center rounded-2xl bg-white/80 backdrop-blur-xl border border-border p-6 hover:shadow-apple-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up delay-${(idx + 1) * 100}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-apple-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ How It Works ═══════════════ */}
      <section className="py-24 sm:py-16 px-6 sm:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-foreground tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className={`text-center animate-fade-in-up delay-${(idx + 1) * 100}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Final CTA ═══════════════ */}
      <section className="hero-gradient relative py-12 sm:py-16 px-6 sm:px-12 text-center text-white overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6 gradient-text">
            {t('ctaTitle')}
          </h2>
          <p className="text-white/60 text-lg mb-10 font-light">
            {t('ctaSubtitle')}
          </p>
          <Button asChild size="lg" variant="glow" className="rounded-2xl px-10 text-base font-semibold">
            <Link href="/register">
              {t('ctaButton')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-500/15 rounded-full blur-[120px] animate-pulse-glow" />
      </section>
    </div>
  );
}
