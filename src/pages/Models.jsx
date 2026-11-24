
import { useMemo, useState } from 'react'
import {
  Brain,
  ChartColumnIncreasing,
  CheckCircle2,
  Cpu,
  Search,
  Trophy,
} from 'lucide-react'

const evaluationData = [
  // SENTIMENT — traditional ML values transcribed from the supplied chart
  { task: 'Sentiment', family: 'Machine Learning', model: 'Multinomial Naive Bayes', accuracy: 97.6, precision: 97.6, recall: 97.6, f1: 97.6 },
  { task: 'Sentiment', family: 'Machine Learning', model: 'SVM', accuracy: 97.4, precision: 97.4, recall: 97.4, f1: 97.4 },
  { task: 'Sentiment', family: 'Machine Learning', model: 'Logistic Regression', accuracy: 97.2, precision: 97.2, recall: 97.2, f1: 97.2 },
  { task: 'Sentiment', family: 'Machine Learning', model: 'Random Forest', accuracy: 96.0, precision: 96.0, recall: 96.0, f1: 96.0 },
  { task: 'Sentiment', family: 'Machine Learning', model: 'Decision Tree', accuracy: 94.7, precision: 94.8, recall: 94.7, f1: 94.7 },

  // SENTIMENT — deep learning CSV
  { task: 'Sentiment', family: 'Deep Learning', model: 'CNN', accuracy: 97.8, precision: 97.8034, recall: 97.8, f1: 97.7994 },
  { task: 'Sentiment', family: 'Deep Learning', model: 'BiLSTM', accuracy: 97.3, precision: 97.3230, recall: 97.3, f1: 97.2984 },
  { task: 'Sentiment', family: 'Deep Learning', model: 'Parallel CNN-BiLSTM', accuracy: 97.1, precision: 97.1195, recall: 97.1, f1: 97.0992 },
  { task: 'Sentiment', family: 'Deep Learning', model: 'CNN-BiLSTM', accuracy: 96.9, precision: 96.9069, recall: 96.9, f1: 96.9016 },
  { task: 'Sentiment', family: 'Deep Learning', model: 'GRU', accuracy: 96.9, precision: 96.9311, recall: 96.9, f1: 96.9004 },
  { task: 'Sentiment', family: 'Deep Learning', model: 'LSTM', accuracy: 96.9, precision: 96.9206, recall: 96.9, f1: 96.8969 },
  { task: 'Sentiment', family: 'Deep Learning', model: 'Attention-BiLSTM', accuracy: 96.1, precision: 96.1277, recall: 96.1, f1: 96.1049 },
  { task: 'Sentiment', family: 'Deep Learning', model: 'RNN', accuracy: 94.3, precision: 94.2851, recall: 94.3, f1: 94.2896 },

  // SENTIMENT — transformer CSV
  { task: 'Sentiment', family: 'Transformer', model: 'MuRIL', accuracy: 99.5, precision: 99.5012, recall: 99.5, f1: 99.4995 },
  { task: 'Sentiment', family: 'Transformer', model: 'XLM-RoBERTa', accuracy: 98.8, precision: 98.8107, recall: 98.8, f1: 98.8013 },
  { task: 'Sentiment', family: 'Transformer', model: 'mBERT', accuracy: 98.0, precision: 98.0278, recall: 98.0, f1: 98.0022 },
  { task: 'Sentiment', family: 'Transformer', model: 'DistilBERT', accuracy: 97.3, precision: 97.3140, recall: 97.3, f1: 97.3039 },
  { task: 'Sentiment', family: 'Transformer', model: 'RoBERTa', accuracy: 95.8, precision: 95.7910, recall: 95.8, f1: 95.7928 },
  { task: 'Sentiment', family: 'Transformer', model: 'BERT', accuracy: 95.8, precision: 95.8225, recall: 95.8, f1: 95.7807 },

  // SARCASM — traditional ML values transcribed approximately from the supplied chart
  { task: 'Sarcasm', family: 'Machine Learning', model: 'Logistic Regression', accuracy: 88.35, precision: 89.35, recall: 88.35, f1: 88.10 },
  { task: 'Sarcasm', family: 'Machine Learning', model: 'Random Forest', accuracy: 88.17, precision: 88.80, recall: 88.17, f1: 88.00 },
  { task: 'Sarcasm', family: 'Machine Learning', model: 'SVM', accuracy: 86.58, precision: 86.62, recall: 86.58, f1: 86.50 },
  { task: 'Sarcasm', family: 'Machine Learning', model: 'Multinomial Naive Bayes', accuracy: 86.50, precision: 87.45, recall: 86.50, f1: 86.20 },
  { task: 'Sarcasm', family: 'Machine Learning', model: 'Decision Tree', accuracy: 85.55, precision: 85.50, recall: 85.55, f1: 85.50 },

  // SARCASM — deep learning CSV
  { task: 'Sarcasm', family: 'Deep Learning', model: 'CNN', accuracy: 87.9082, precision: 88.0055, recall: 87.9082, f1: 87.8255 },
  { task: 'Sarcasm', family: 'Deep Learning', model: 'GRU', accuracy: 87.7317, precision: 87.8948, recall: 87.7317, f1: 87.6278 },
  { task: 'Sarcasm', family: 'Deep Learning', model: 'Attention-BiLSTM', accuracy: 87.5552, precision: 87.8483, recall: 87.5552, f1: 87.4169 },
  { task: 'Sarcasm', family: 'Deep Learning', model: 'BiLSTM', accuracy: 86.2312, precision: 86.2656, recall: 86.2312, f1: 86.2441 },
  { task: 'Sarcasm', family: 'Deep Learning', model: 'Parallel CNN-GRU', accuracy: 85.7899, precision: 86.0261, recall: 85.7899, f1: 85.8350 },
  { task: 'Sarcasm', family: 'Deep Learning', model: 'CNN-BiLSTM', accuracy: 85.2604, precision: 85.2339, recall: 85.2604, f1: 85.2389 },
  { task: 'Sarcasm', family: 'Deep Learning', model: 'RNN', accuracy: 85.2604, precision: 87.9389, recall: 85.2604, f1: 84.6394 },
  { task: 'Sarcasm', family: 'Deep Learning', model: 'LSTM', accuracy: 83.6717, precision: 87.2125, recall: 83.6717, f1: 82.8080 },

  // SARCASM — transformer CSV
  { task: 'Sarcasm', family: 'Transformer', model: 'mBERT', accuracy: 90.83, precision: 90.87, recall: 90.83, f1: 90.79 },
  { task: 'Sarcasm', family: 'Transformer', model: 'XLM-RoBERTa', accuracy: 90.48, precision: 90.52, recall: 90.48, f1: 90.49 },
  { task: 'Sarcasm', family: 'Transformer', model: 'DistilBERT', accuracy: 90.48, precision: 90.81, recall: 90.48, f1: 90.38 },
  { task: 'Sarcasm', family: 'Transformer', model: 'MuRIL', accuracy: 89.42, precision: 89.43, recall: 89.42, f1: 89.38 },
  { task: 'Sarcasm', family: 'Transformer', model: 'BERT', accuracy: 88.89, precision: 89.61, recall: 88.89, f1: 88.70 },
  { task: 'Sarcasm', family: 'Transformer', model: 'RoBERTa', accuracy: 88.71, precision: 89.85, recall: 88.71, f1: 88.46 },
]

const families = ['All Models', 'Machine Learning', 'Deep Learning', 'Transformer']
const metricOptions = [
  { key: 'accuracy', label: 'Accuracy', color: '#3978ed' },
  { key: 'precision', label: 'Precision', color: '#f59e0b' },
  { key: 'recall', label: 'Recall', color: '#16a34a' },
  { key: 'f1', label: 'F1-Score', color: '#dc2626' },
]

function Models() {
  const [task, setTask] = useState('Sentiment')
  const [family, setFamily] = useState('All Models')
  const [metric, setMetric] = useState('accuracy')
  const [search, setSearch] = useState('')

  const filteredModels = useMemo(() => {
    return evaluationData
      .filter((item) => item.task === task)
      .filter((item) => family === 'All Models' || item.family === family)
      .filter((item) =>
        `${item.model} ${item.family}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
      .sort((a, b) => b[metric] - a[metric])
  }, [task, family, metric, search])

  const taskModels = evaluationData.filter((item) => item.task === task)
  const bestModel = taskModels.reduce(
    (best, item) => (!best || item.accuracy > best.accuracy ? item : best),
    null
  )
  const familyCount = (name) =>
    name === 'All Models'
      ? taskModels.length
      : taskModels.filter((item) => item.family === name).length

  return (
    <div className="model-dashboard">
      <style>{`
        .model-dashboard{display:flex;flex-direction:column;gap:22px;color:#172554;min-width:0}
        .md-intro .eyebrow{margin:0 0 8px;color:#7047eb;font-size:12px;font-weight:800;letter-spacing:2px}
        .md-intro h2{font-size:clamp(25px,3vw,33px);margin:0 0 8px}
        .md-intro p{color:#64748b;margin:0;line-height:1.65}
        .md-task-tabs,.md-family-tabs,.md-metric-tabs{display:flex;gap:9px;flex-wrap:wrap}
        .md-tab{border:1px solid #ddd6fe;background:white;color:#5b21b6;border-radius:10px;padding:10px 14px;font-weight:650;cursor:pointer}
        .md-tab.active{background:#7047eb;border-color:#7047eb;color:white}
        .md-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
        .md-stat{background:white;border:1px solid #e0e7f5;border-radius:15px;padding:18px;min-width:0}
        .md-stat-label{display:flex;justify-content:space-between;gap:8px;color:#64748b;font-size:12px;margin-bottom:15px}
        .md-stat-icon{display:grid;place-items:center;width:36px;height:36px;background:#f0ebff;color:#7047eb;border-radius:11px;flex-shrink:0}
        .md-stat strong{display:block;font-size:25px;overflow-wrap:anywhere;margin-bottom:5px}
        .md-stat small{font-size:12px;color:#64748b;line-height:1.5}
        .md-panel{background:white;border:1px solid #e0e7f5;border-radius:17px;padding:21px;min-width:0}
        .md-panel-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:18px}
        .md-panel-heading h3{margin:0 0 6px;font-size:19px}
        .md-panel-heading p{margin:0;color:#64748b;font-size:13px;line-height:1.6}
        .md-controls{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:18px}
        .md-search{display:flex;align-items:center;gap:8px;border:1px solid #dbe3f0;border-radius:10px;padding:10px 12px;color:#64748b;flex:1;min-width:200px;max-width:320px}
        .md-search input{border:0;outline:0;min-width:0;width:100%;font:inherit;color:#172554;background:transparent}
        .md-model-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
        .md-model{border:1px solid #e2e8f0;border-radius:14px;padding:17px;min-width:0}
        .md-model-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
        .md-model h4{margin:0 0 6px;font-size:16px;overflow-wrap:anywhere}
        .md-model-type{font-size:11px;color:#7047eb;background:#f0ebff;padding:5px 8px;border-radius:20px;display:inline-block;margin-top:7px}
        .md-score{text-align:right;flex-shrink:0}
        .md-score strong{font-size:21px}
        .md-score small{display:block;color:#64748b;font-size:11px;margin-top:3px}
        .md-progress{height:7px;border-radius:20px;background:#edf0f7;overflow:hidden;margin:16px 0}
        .md-progress span{display:block;height:100%;border-radius:20px}
        .md-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
        .md-metric{background:#f8faff;padding:9px;border-radius:9px;min-width:0}
        .md-metric span{display:block;font-size:10px;color:#64748b;margin-bottom:5px}
        .md-metric strong{font-size:13px;overflow-wrap:anywhere}
        .md-table-wrap{overflow-x:auto}
        .md-table{width:100%;border-collapse:collapse;text-align:left;font-size:13px}
        .md-table th,.md-table td{padding:13px 11px;border-bottom:1px solid #edf0f7;white-space:nowrap}
        .md-table th{background:#f8f7ff;color:#64748b;font-weight:700}
        .md-table td:first-child{font-weight:700}
        .md-rank{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:8px;background:#f0ebff;color:#5b21b6;margin-right:8px}
        .md-bar-row{display:grid;grid-template-columns:minmax(110px,180px) minmax(80px,1fr) 60px;gap:12px;align-items:center;margin:15px 0;font-size:12px}
        .md-bar-name{overflow-wrap:anywhere;color:#334155}
        .md-bar-track{height:10px;background:#edf0f7;border-radius:20px;overflow:hidden}
        .md-bar-track span{display:block;height:100%;border-radius:20px}
        .md-empty{text-align:center;color:#64748b;padding:28px;border:1px dashed #cbd5e1;border-radius:12px}
        .md-note{font-size:12px;color:#64748b;line-height:1.7}
        @media(max-width:1100px){.md-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:700px){.md-model-list{grid-template-columns:1fr}.md-panel{padding:15px}.md-search{max-width:none;flex-basis:100%}.md-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:420px){.md-stats{grid-template-columns:1fr}.md-model-top{flex-wrap:wrap}.md-score{text-align:left}.md-bar-row{grid-template-columns:95px minmax(50px,1fr) 52px;gap:7px}}
     /* Dashboard stat cards */
.md-stat {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.md-stat:hover {
  transform: translateY(-6px);
  border-color: #a78bfa;
  box-shadow: 0 12px 28px rgba(109, 71, 235, 0.14);
}

/* Model cards */
.md-model {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.md-model:hover {
  transform: translateY(-5px);
  border-color: #8b5cf6;
  box-shadow: 0 10px 24px rgba(109, 71, 235, 0.12);
}

/* Icons inside stat cards */
.md-stat-icon {
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.md-stat:hover .md-stat-icon {
  transform: scale(1.1);
  background: #e5dcff;
}

/* Animated accuracy bars */
.md-progress span,
.md-bar-track span {
  transition: width 0.5s ease;
}

/* Respect reduced-motion preferences */
@media (prefers-reduced-motion: reduce) {
  .md-stat,
  .md-model,
  .md-stat-icon,
  .md-progress span,
  .md-bar-track span {
    transition: none;
  }

  .md-stat:hover,
  .md-model:hover {
    transform: none;
  }
}
     
     
     `}</style>

      <header className="md-intro">
        <p className="eyebrow">RESEARCH & MODEL EVALUATION</p>
        <h2>Model Performance Comparison</h2>
        <p>
          Compare your trained Machine Learning, Deep Learning, and Transformer
          models for Marathi sentiment and sarcasm detection.
        </p>
      </header>

      <div className="md-task-tabs">
        {['Sentiment', 'Sarcasm'].map((name) => (
          <button
            key={name}
            type="button"
            className={`md-tab ${task === name ? 'active' : ''}`}
            onClick={() => {
              setTask(name)
              setFamily('All Models')
              setSearch('')
            }}
          >
            {name === 'Sentiment' ? 'Sentiment Analysis' : 'Sarcasm Detection'}
          </button>
        ))}
      </div>

      <section className="md-stats">
        <div className="md-stat">
          <div className="md-stat-label">
            <span>Evaluated Models</span>
            <span className="md-stat-icon"><ChartColumnIncreasing size={19} /></span>
          </div>
          <strong>{taskModels.length}</strong>
          <small>Across all three model families</small>
        </div>

        <div className="md-stat">
  <div className="md-stat-label">
    <span>Machine Learning</span>
    <span className="md-stat-icon">
      <ChartColumnIncreasing size={19} />
    </span>
  </div>

  <strong>{familyCount('Machine Learning')}</strong>

  <small>Traditional ML experiments</small>
</div>

        <div className="md-stat">
          <div className="md-stat-label">
            <span>Deep Learning</span>
            <span className="md-stat-icon"><Cpu size={19} /></span>
          </div>
          <strong>{familyCount('Deep Learning')}</strong>
          <small>Neural network experiments</small>
        </div>

        <div className="md-stat">
          <div className="md-stat-label">
            <span>Transformers</span>
            <span className="md-stat-icon"><Brain size={19} /></span>
          </div>
          <strong>{familyCount('Transformer')}</strong>
          <small>Pretrained language models</small>
        </div>
      </section>

      <section className="md-panel">
        <div className="md-panel-heading">
          <div>
            <h3>Model Catalogue</h3>
            <p>Choose an architecture family and search for a model.</p>
          </div>
        </div>

        <div className="md-controls">
          <div className="md-family-tabs">
            {families.map((name) => (
              <button
                key={name}
                type="button"
                className={`md-tab ${family === name ? 'active' : ''}`}
                onClick={() => setFamily(name)}
              >
                {name} ({familyCount(name)})
              </button>
            ))}
          </div>

          <label className="md-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search model..."
              aria-label="Search models"
            />
          </label>
        </div>

        {filteredModels.length ? (
          <div className="md-model-list">
            {filteredModels.map((item, index) => (
              <article className="md-model" key={`${item.task}-${item.model}`}>
                <div className="md-model-top">
                  <div>
                    <h4>
                      {index === 0 && metric === 'accuracy' ? '🏆 ' : ''}
                      {item.model}
                    </h4>
                    <span className="md-model-type">{item.family}</span>
                  </div>
                  <div className="md-score">
                    <strong>{item.accuracy.toFixed(2)}%</strong>
                    <small>Accuracy</small>
                  </div>
                </div>

                <div className="md-progress">
                  <span
                    style={{
                      width: `${Math.min(100, item.accuracy)}%`,
                      background: '#7047eb',
                    }}
                  />
                </div>

                <div className="md-metrics">
                  {metricOptions.map((option) => (
                    <div className="md-metric" key={option.key}>
                      <span>{option.label}</span>
                      <strong>{item[option.key].toFixed(2)}%</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="md-empty">No models match your search.</div>
        )}
      </section>

      <section className="md-panel">
        <div className="md-panel-heading">
          <div>
            <h3>Performance Ranking</h3>
            <p>Rank models by the selected evaluation metric.</p>
          </div>
          <select
            className="md-tab"
            value={metric}
            onChange={(event) => setMetric(event.target.value)}
            aria-label="Choose ranking metric"
          >
            {metricOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {filteredModels.map((item, index) => {
          const option = metricOptions.find((m) => m.key === metric)
          return (
            <div className="md-bar-row" key={`${item.model}-${item.family}`}>
              <span className="md-bar-name">
                {index + 1}. {item.model}
              </span>
              <div className="md-bar-track">
                <span
                  style={{
                    width: `${Math.min(100, item[metric])}%`,
                    background: option.color,
                  }}
                />
              </div>
              <strong>{item[metric].toFixed(2)}%</strong>
            </div>
          )
        })}
      </section>

      <section className="md-panel">
        <div className="md-panel-heading">
          <div>
            <h3>Detailed Comparison Table</h3>
            <p>
              {task} models sorted by {metricOptions.find((m) => m.key === metric)?.label}.
            </p>
          </div>
        </div>

        <div className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>Family</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1-Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((item, index) => (
                <tr key={`${item.task}-${item.model}-row`}>
                  <td><span className="md-rank">{index + 1}</span></td>
                  <td>
                    {index === 0 && (
                      <CheckCircle2
                        size={14}
                        style={{
                          display: 'inline',
                          color: '#16a34a',
                          marginRight: 5,
                          verticalAlign: 'middle',
                        }}
                      />
                    )}
                    {item.model}
                  </td>
                  <td>{item.family}</td>
                  <td>{item.accuracy.toFixed(2)}%</td>
                  <td>{item.precision.toFixed(2)}%</td>
                  <td>{item.recall.toFixed(2)}%</td>
                  <td>{item.f1.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

     
    </div>
  )
}

export default Models
