
import { useState } from 'react'
import {
  Database,
  FileSpreadsheet,
  Languages,
  Tags,
  ShieldCheck,
  GitBranch,
  ExternalLink,
  Search,
  Heart,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Download,
} from 'lucide-react'

const datasets = [
  {
    id: 'sentiment',
    title: 'Marathi Sentiment Dataset',
    subtitle: 'Sentiment Module.csv',
    description:
      'Our self-created dataset for Marathi sentiment analysis. It supports classifying text into sentiment categories and evaluating our trained NLP models.',
    task: 'Sentiment Analysis',
    labels: ['Positive', 'Negative', 'Neutral'],
    icon: Heart,
    color: '#6d4aff',
    fileUrl:
      'https://github.com/Riya-Kharade/ToneMatrix-AI/blob/main/dataset/Sentiment%20Module.csv',
    fileName: 'Sentiment Module.csv',
  },
  {
    id: 'sarcasm',
    title: 'Marathi Sarcasm Dataset',
    subtitle: 'Sarcasm Model.csv',
    description:
      'Our self-created dataset for Marathi sarcasm detection. It supports identifying sarcastic and non-sarcastic expressions for model training and evaluation.',
    task: 'Sarcasm Detection',
    labels: ['Sarcastic', 'Non-Sarcastic'],
    icon: MessageCircle,
    color: '#0891b2',
    fileUrl:
      'https://github.com/Riya-Kharade/ToneMatrix-AI/blob/main/dataset/Sarcasm%20Model.csv',
    fileName: 'Sarcasm Model.csv',
  },
]

function Dataset() {
  const [search, setSearch] = useState('')
  const [activeDataset, setActiveDataset] = useState(null)

  const filteredDatasets = datasets.filter((dataset) => {
    const query = search.trim().toLowerCase()
    return (
      dataset.title.toLowerCase().includes(query) ||
      dataset.task.toLowerCase().includes(query) ||
      dataset.fileName.toLowerCase().includes(query)
    )
  })

  return (
    <div className="dataset-dashboard">
      <style>{`
        .dataset-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
          color: #172554;
          min-width: 0;
        }

        .ds-hero {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border-radius: 20px;
          border: 1px solid #e0d7ff;
          background: linear-gradient(120deg, #ffffff 0%, #f4f0ff 65%, #edf7ff 100%);
        }

        .ds-hero::after {
          content: "";
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: rgba(109, 71, 235, 0.08);
          right: -55px;
          top: -70px;
          pointer-events: none;
        }

        .ds-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7047eb;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.8px;
          margin: 0 0 12px;
        }

        .ds-hero h2 {
          font-size: clamp(25px, 3vw, 34px);
          line-height: 1.2;
          margin: 0 0 12px;
        }

        .ds-hero p {
          color: #64748b;
          max-width: 760px;
          font-size: 14px;
          line-height: 1.85;
          margin: 0;
        }

        .ds-self-made {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          padding: 9px 12px;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          background: #f0fdf4;
          color: #166534;
          font-size: 12px;
          font-weight: 750;
        }

        .ds-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
        }

        .ds-stat {
          padding: 20px;
          min-width: 0;
          border: 1px solid #e0e7f5;
          border-radius: 16px;
          background: white;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .ds-stat:hover {
          transform: translateY(-5px);
          border-color: #b8a5ff;
          box-shadow: 0 12px 26px rgba(109, 71, 235, .12);
        }

        .ds-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: #64748b;
          font-size: 12px;
          margin-bottom: 17px;
        }

        .ds-stat-icon {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          border-radius: 12px;
          background: #f0ebff;
          color: #7047eb;
          flex-shrink: 0;
          transition: transform .25s ease;
        }

        .ds-stat:hover .ds-stat-icon {
          transform: scale(1.1);
        }

        .ds-stat strong {
          display: block;
          font-size: 27px;
          margin-bottom: 6px;
          overflow-wrap: anywhere;
        }

        .ds-stat small {
          display: block;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .ds-section {
          padding: 23px;
          border: 1px solid #e0e7f5;
          border-radius: 18px;
          background: #fff;
          min-width: 0;
        }

        .ds-section-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 20px;
        }

        .ds-section-head h3 {
          margin: 0 0 7px;
          font-size: 20px;
        }

        .ds-section-head p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .ds-search {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 13px;
          max-width: 320px;
          min-width: 220px;
          border: 1px solid #dbe3f0;
          border-radius: 11px;
          color: #64748b;
        }

        .ds-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          color: #172554;
          background: transparent;
          font: inherit;
        }

        .ds-card-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .ds-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding: 22px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: white;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .ds-card:hover {
          transform: translateY(-5px);
          border-color: #a78bfa;
          box-shadow: 0 13px 28px rgba(109, 71, 235, .12);
        }

        .ds-card-top {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-bottom: 17px;
        }

        .ds-card-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 14px;
        }

        .ds-card h4 {
          font-size: 17px;
          margin: 1px 0 6px;
          overflow-wrap: anywhere;
        }

        .ds-file-name {
          color: #64748b;
          font-size: 12px;
          overflow-wrap: anywhere;
        }

        .ds-card-description {
          color: #64748b;
          font-size: 13px;
          line-height: 1.85;
          margin: 0 0 18px;
        }

        .ds-task-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          align-self: flex-start;
          padding: 7px 10px;
          border-radius: 9px;
          background: #f5f3ff;
          color: #6d28d9;
          font-size: 11px;
          font-weight: 750;
          margin-bottom: 17px;
        }

        .ds-label-title {
          margin: 0 0 10px;
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
        }

        .ds-labels {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 20px;
        }

        .ds-label {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 7px 9px;
          color: #475569;
          font-size: 11px;
          background: #f8fafc;
        }

        .ds-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: auto;
          padding-top: 17px;
          border-top: 1px solid #edf0f7;
        }

        .ds-link {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border: 1px solid #7047eb;
          border-radius: 10px;
          background: #7047eb;
          color: white;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          transition: background .2s ease, transform .2s ease;
        }

        .ds-link:hover {
          background: #5b35d5;
          transform: translateY(-1px);
        }

        .ds-link.secondary {
          background: white;
          color: #5b21b6;
          border-color: #ddd6fe;
        }

        .ds-link.secondary:hover {
          background: #f5f3ff;
        }

        .ds-process-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .ds-process {
          padding: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #fbfaff;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .ds-process:hover {
          transform: translateY(-4px);
          border-color: #c4b5fd;
          box-shadow: 0 9px 20px rgba(109, 71, 235, .08);
        }

        .ds-process-number {
          display: grid;
          place-items: center;
          width: 31px;
          height: 31px;
          border-radius: 10px;
          background: #ede9fe;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 13px;
        }

        .ds-process h4 {
          margin: 0 0 8px;
          font-size: 14px;
        }

        .ds-process p {
          color: #64748b;
          font-size: 12px;
          line-height: 1.8;
          margin: 0;
        }

        .ds-note {
          padding: 16px 18px;
          border: 1px solid #ddd6fe;
          border-radius: 13px;
          background: #f5f3ff;
          color: #5b21b6;
          font-size: 12px;
          line-height: 1.8;
        }

        .ds-empty {
          padding: 28px;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          text-align: center;
          color: #64748b;
        }

        @media(max-width: 1050px) {
          .ds-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media(max-width: 700px) {
          .ds-card-grid,
          .ds-process-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .ds-hero,
          .ds-section {
            padding: 17px;
          }

          .ds-search {
            max-width: none;
            min-width: 0;
            width: 100%;
            box-sizing: border-box;
          }
        }

        @media(max-width: 420px) {
          .ds-stats {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media(prefers-reduced-motion: reduce) {
          .ds-stat,
          .ds-card,
          .ds-process,
          .ds-stat-icon,
          .ds-link {
            transition: none;
          }

          .ds-stat:hover,
          .ds-card:hover,
          .ds-process:hover,
          .ds-link:hover {
            transform: none;
          }
        }
      `}</style>

      <header className="ds-hero">
        <p className="ds-eyebrow">
          <Database size={15} />
          OUR DATA · MARATHI NLP RESEARCH
        </p>

        <h2>Our Self-Created Marathi Datasets</h2>

        <p>
          ToneMatrix AI uses project-specific datasets developed by our team
          for Marathi sentiment analysis and sarcasm detection. We did not
          simply take a ready-made dataset and present it as our own. Our
          datasets are maintained in our project repository and are used for
          our model experiments and evaluation.
        </p>

        <div className="ds-self-made">
          <ShieldCheck size={16} />
          Team-created research datasets
        </div>
      </header>

      <section className="ds-stats">
        <div className="ds-stat">
          <div className="ds-stat-top">
            <span>Dataset Files</span>
            <span className="ds-stat-icon"><Database size={19} /></span>
          </div>
          <strong>2</strong>
          <small>Sentiment and sarcasm datasets</small>
        </div>

        <div className="ds-stat">
          <div className="ds-stat-top">
            <span>Sentiment Categories</span>
            <span className="ds-stat-icon"><Tags size={19} /></span>
          </div>
          <strong>3</strong>
          <small>Positive, Negative, and Neutral</small>
        </div>

        <div className="ds-stat">
          <div className="ds-stat-top">
            <span>Sarcasm Categories</span>
            <span className="ds-stat-icon"><MessageCircle size={19} /></span>
          </div>
          <strong>2</strong>
          <small>Sarcastic and Non-Sarcastic</small>
        </div>

        <div className="ds-stat">
          <div className="ds-stat-top">
            <span>Language</span>
            <span className="ds-stat-icon"><Languages size={19} /></span>
          </div>
          <strong>Marathi</strong>
          <small>Developed for Marathi NLP research</small>
        </div>
      </section>

      <section className="ds-section">
        <div className="ds-section-head">
          <div>
            <h3>Dataset Repository</h3>
            <p>
              Explore the dataset files stored in the ToneMatrix AI GitHub
              repository.
            </p>
          </div>

          <label className="ds-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search datasets..."
              aria-label="Search datasets"
            />
          </label>
        </div>

        <div className="ds-card-grid">
          {filteredDatasets.map((dataset) => {
            const Icon = dataset.icon

            return (
              <article className="ds-card" key={dataset.id}>
                <div className="ds-card-top">
                  <div
                    className="ds-card-icon"
                    style={{
                      color: dataset.color,
                      background: `${dataset.color}15`,
                    }}
                  >
                    <FileSpreadsheet size={25} />
                  </div>

                  <div>
                    <h4>{dataset.title}</h4>
                    <span className="ds-file-name">
                      {dataset.fileName}
                    </span>
                  </div>
                </div>

                <p className="ds-card-description">
                  {dataset.description}
                </p>

                <span className="ds-task-label">
                  <Icon size={14} />
                  {dataset.task}
                </span>

                <p className="ds-label-title">Supported labels</p>

                <div className="ds-labels">
                  {dataset.labels.map((label) => (
                    <span className="ds-label" key={label}>
                      {label}
                    </span>
                  ))}
                </div>

                <div className="ds-card-actions">
                  <a
                    className="ds-link"
                    href={dataset.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitBranch size={16} />
                    View CSV on GitHub
                    <ExternalLink size={13} />
                  </a>

                  <button
                    className="ds-link secondary"
                    type="button"
                    onClick={() =>
                      setActiveDataset(
                        activeDataset === dataset.id ? null : dataset.id
                      )
                    }
                  >
                    {activeDataset === dataset.id
                      ? 'Hide details'
                      : 'Dataset details'}
                  </button>
                </div>

                {activeDataset === dataset.id && (
                  <div style={{ marginTop: 16 }}>
                    <p className="ds-card-description">
                      <strong>Purpose:</strong> {dataset.task}. This file is
                      maintained in the project's dataset directory. Open the
                      GitHub CSV to inspect its actual rows and columns.
                    </p>
                    <a
                      className="ds-link secondary"
                      href={dataset.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download size={15} />
                      Open dataset file
                    </a>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="ds-empty">
            No datasets match your search.
          </div>
        )}
      </section>

      <section className="ds-section">
        <div className="ds-section-head">
          <div>
            <h3>Our Dataset Development Approach</h3>
            <p>
              How the datasets support our own research and model experiments.
            </p>
          </div>
          <Sparkles size={22} color="#7047eb" />
        </div>

        <div className="ds-process-grid">
          <article className="ds-process">
            <span className="ds-process-number">01</span>
            <h4>Dataset Creation</h4>
            <p>
              We created project-specific Marathi text data for our sentiment
              and sarcasm detection tasks rather than simply reusing a
              ready-made dataset as our own work.
            </p>
          </article>

          <article className="ds-process">
            <span className="ds-process-number">02</span>
            <h4>Label Organization</h4>
            <p>
              The sentiment dataset uses three categories, while the sarcasm
              dataset uses two categories to support their respective
              classification tasks.
            </p>
          </article>

          <article className="ds-process">
            <span className="ds-process-number">03</span>
            <h4>Model Training & Evaluation</h4>
            <p>
              The datasets provide the basis for experiments with traditional
              Machine Learning, Deep Learning, and Transformer-based models.
            </p>
          </article>
        </div>
      </section>

     
    </div>
  )
}

export default Dataset
