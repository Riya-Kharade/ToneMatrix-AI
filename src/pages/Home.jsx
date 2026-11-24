import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BrainCircuit,
  BookOpen,
  ChartColumn,
  CheckCircle2,
  Database,
  GitCompare,
  Info,
  Layers3,
  MessageCircleHeart,
  Network,
  ScanText,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function Home() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const analysisCards = [
    { titleKey: 'cardSentimentTitle', descKey: 'cardSentimentDesc', actionKey: 'cardSentimentAction', path: '/sentiment', tone: 'mint', icon: MessageCircleHeart },
    { titleKey: 'cardSarcasmTitle', descKey: 'cardSarcasmDesc', actionKey: 'cardSarcasmAction', path: '/sarcasm', tone: 'rose', icon: BrainCircuit },
    { titleKey: 'cardBothTitle', descKey: 'cardBothDesc', actionKey: 'cardBothAction', path: '/analyze', tone: 'violet', icon: Workflow },
  ]

  const metricCards = [
    { labelKey: 'sentimentDataset', value: '5,000', detailKey: 'samples', icon: Database, tone: 'blue' },
    { labelKey: 'sarcasmDataset', value: '5,665', detailKey: 'samples', icon: ScanText, tone: 'mint' },
    { labelKey: 'bestSentimentModel', value: '99.50%', detailKey: 'reportedAccuracy', icon: ChartColumn, tone: 'violet', sub: 'MuRIL' },
    { labelKey: 'bestSarcasmModel', value: '90.83%', detailKey: 'reportedAccuracy', icon: BrainCircuit, tone: 'rose', sub: 'mBERT' },
  ]

  const workflowSteps = [
    { titleKey: 'stepTextInput', descKey: 'stepTextInputDesc', icon: ScanText },
    { titleKey: 'stepPreprocessing', descKey: 'stepPreprocessingDesc', icon: Layers3 },
    { titleKey: 'stepModelInference', descKey: 'stepModelInferenceDesc', icon: Network },
    { titleKey: 'stepResults', descKey: 'stepResultsDesc', icon: CheckCircle2 },
  ]

  return (
    <div className="dashboard-home">
      <section className="hero-banner" aria-labelledby="dashboard-hero-title">
        <div className="hero-copy">
          <h2 id="dashboard-hero-title">{t('heroTitle')}</h2>
          <h3>{t('heroSubtitle')}</h3>
          <p className="hero-description">{t('heroDesc')}</p>
          <div className="hero-actions">
            <button className="cta-button" type="button" onClick={() => navigate('/analyze')}>
              <Sparkles size={17} />
              {t('startAnalyzing')}
              <ArrowRight size={16} />
            </button>
            <button className="ghost-button" type="button" onClick={() => navigate('/research')}>
              {t('exploreResearch')}
            </button>
          </div>
        </div>

        <div className="hero-art" aria-label="Abstract language analysis network">
          <div className="network-orbit orbit-one" />
          <div className="network-orbit orbit-two" />
          <div className="network-core">
            <Network size={44} strokeWidth={1.4} />
            <span>AI</span>
          </div>
          <span className="network-label label-one">SENTIMENT</span>
          <span className="network-label label-two">CONTEXT</span>
          <span className="network-label label-three">TONE</span>
          <span className="network-label label-marathi">मराठी</span>
          <span className="network-node node-one" />
          <span className="network-node node-two" />
          <span className="network-node node-three" />
          <span className="network-node node-four" />
        </div>
      </section>

      <section className="dashboard-section analysis-section" aria-labelledby="analysis-tools-title">
        <div className="dashboard-section-heading">
          <div>
            <h2 id="analysis-tools-title">{t('analyzeText')}</h2>
            <p>{t('analyzeTextDesc')}</p>
          </div>
        </div>
        <div className="analysis-grid">
          {analysisCards.map((card) => {
            const Icon = card.icon
            return (
              <button className={`analysis-card ${card.tone}`} key={card.titleKey} type="button" onClick={() => navigate(card.path)}>
                <span className="analysis-icon"><Icon size={21} /></span>
                <span className="analysis-content">
                  <strong>{t(card.titleKey)}</strong>
                  <span>{t(card.descKey)}</span>
                </span>
                <span className="analysis-action">{t(card.actionKey)}<ArrowRight size={15} /></span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="dashboard-section research-glance-section" aria-labelledby="research-glance-title">
        <div className="dashboard-section-heading">
          <div>
            <h2 id="research-glance-title">{t('researchGlance')}</h2>
            <p>{t('researchGlanceDesc')}</p>
          </div>
        </div>
        <div className="metrics-grid">
          {metricCards.map((card) => {
            const Icon = card.icon
            return (
              <article className="metric-card" key={card.labelKey}>
                <span className={`metric-icon ${card.tone}`}><Icon size={21} /></span>
                <div>
                  <p>{t(card.labelKey)}</p>
                  <strong>{card.value}</strong>
                  <span>{card.sub ? `${card.sub} · ` : ''}{t(card.detailKey)}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="dashboard-info-row">
        <article className="about-dashboard-card dashboard-card" aria-labelledby="about-dashboard-title">
          <div className="dashboard-card-icon"><Info size={20} /></div>
          <h2 id="about-dashboard-title">{t('aboutToneMatrix')}</h2>
          <p>{t('aboutToneMatrixDesc')}</p>
        </article>
        <article className="research-overview dashboard-card">
          <div className="dashboard-card-icon"><BookOpen size={20} /></div>
          <h2>{t('researchOverview')}</h2>
          <p>{t('researchOverviewDesc')}</p>
          <button className="secondary-btn" type="button" onClick={() => navigate('/research')}>{t('viewResearch')} <ArrowRight size={16} /></button>
        </article>
      </section>

      <section className="dashboard-lower-grid">
        <article className="workflow-card dashboard-card">
          <div className="workflow-heading">
            <div className="dashboard-card-icon"><Workflow size={20} /></div>
            <h2>{t('howItWorks')}</h2>
            <p>{t('howItWorksDesc')}</p>
          </div>
          <div className="workflow-steps">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div className="workflow-step" key={step.titleKey}>
                  <span className="workflow-step-icon"><Icon size={17} /></span>
                  <strong>{t(step.titleKey)}</strong>
                  <small>{t(step.descKey)}</small>
                  {index < workflowSteps.length - 1 && <ArrowRight className="workflow-arrow" size={16} />}
                </div>
              )
            })}
          </div>
        </article>
      </section>

    </div>
  )
}

export default Home
