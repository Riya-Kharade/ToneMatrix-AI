
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Database,
  Heart,
  MessageCircle,
  RefreshCw,
  Workflow,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const COLORS = {
  purple: '#7047eb',
  blue: '#3478f6',
  green: '#10b981',
  red: '#f87171',
  cyan: '#0ea5e9',
  orange: '#f59e0b',
  muted: '#64748b',
  grid: '#e8eaf5',
}

const SENTIMENT_COLORS = {
  Positive: COLORS.green,
  Negative: COLORS.red,
  Neutral: COLORS.blue,
}

const SARCASM_COLORS = {
  'Label -1': COLORS.purple,
  'Label 1': COLORS.cyan,
}

const SENTIMENT_DATASET = [
  { name: 'Positive', value: 1672 },
  { name: 'Negative', value: 1668 },
  { name: 'Neutral', value: 1660 },
]

const SARCASM_DATASET = [
  { name: 'Label -1', value: 3221 },
  { name: 'Label 1', value: 2444 },
]

const WORKFLOW = [
  {
    title: 'Self-made Dataset',
    subtitle: 'Original Marathi data',
    icon: Database,
    description:
      'Your independently created Marathi sentiment and sarcasm datasets provide the data for your research.',
  },
  {
    title: 'Model Prediction',
    subtitle: 'ML, DL and Transformers',
    icon: BrainCircuit,
    description:
      'The trained model processes Marathi text and predicts its sentiment or sarcasm class.',
  },
  {
    title: 'Save to History',
    subtitle: 'Existing JSON storage',
    icon: CheckCircle2,
    description:
      'The backend stores analysis results in your existing history JSON file.',
  },
  {
    title: 'Analytics Charts',
    subtitle: 'Counts and distributions',
    icon: Workflow,
    description:
      'Analytics reads saved records from /api/history and updates the prediction charts.',
  },
]

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

function MetricCard({ title, value, note, icon: Icon, color }) {
  return (
    <article className="ax-metric">
      <div className="ax-metric-top">
        <span>{title}</span>
        <span className="ax-metric-icon" style={{ color, background: `${color}18` }}>
          <Icon size={20} />
        </span>
      </div>
      <strong className="ax-metric-value">{value}</strong>
      <small>{note}</small>
    </article>
  )
}

function ChartCard({ title, description, total, children }) {
  return (
    <section className="ax-card">
      <div className="ax-card-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {total !== undefined && (
          <div className="ax-total">
            <span>Total</span>
            <strong>{total.toLocaleString()}</strong>
          </div>
        )}
      </div>
      {children}
    </section>
  )
}

function EmptyChart({ title, description }) {
  return (
    <div className="ax-empty">
      <BrainCircuit size={28} />
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  )
}

function DonutChart({ data, colors, total, loading }) {
  if (loading) {
    return <div className="ax-empty">Loading chart data…</div>
  }

  if (!total) {
    return (
      <EmptyChart
        title="No saved predictions yet"
        description="Run an analysis to populate this chart."
      />
    )
  }

  return (
    <>
      <div className="ax-donut">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="59%"
              outerRadius="80%"
              paddingAngle={3}
              cornerRadius={5}
              stroke="#fff"
              strokeWidth={3}
              isAnimationActive
              animationDuration={850}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={colors[item.name]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} (${((value / total) * 100).toFixed(1)}%)`,
                name,
              ]}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e0e7f5',
                fontSize: 12,
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="ax-donut-center">
          <strong>{total.toLocaleString()}</strong>
          <span>Predictions</span>
        </div>
      </div>

      <div className="ax-label-list">
        {data.map((item) => (
          <div className="ax-label-row" key={item.name}>
            <span className="ax-label-name">
              <i style={{ background: colors[item.name] }} />
              {item.name}
            </span>
            <strong>{item.value.toLocaleString()}</strong>
            <span className="ax-percent">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function BarDistribution({ data, colors, total, loading }) {
  if (loading) {
    return <div className="ax-empty">Loading chart data…</div>
  }

  if (!total) {
    return (
      <EmptyChart
        title="No data available"
        description="There are no matching records to display."
      />
    )
  }

  return (
    <>
      <div className="ax-bar">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 24, right: 10, left: -15, bottom: 5 }}
          >
            <CartesianGrid
              stroke={COLORS.grid}
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: COLORS.muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, 'auto']}
              tick={{ fill: COLORS.muted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [value.toLocaleString(), 'Count']}
              contentStyle={{ borderRadius: 12, fontSize: 12 }}
            />
            <Bar
              dataKey="value"
              name="Count"
              radius={[7, 7, 0, 0]}
              maxBarSize={72}
              isAnimationActive
              animationDuration={850}
              label={{
                position: 'top',
                fill: '#334155',
                fontSize: 11,
                fontWeight: 700,
                formatter: (value) => value.toLocaleString(),
              }}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={colors[item.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="ax-chart-foot">
        Total samples: <strong>{total.toLocaleString()}</strong>
      </p>
    </>
  )
}

function AccuracyChart({ title, description, data, color }) {
  const validData = data.filter(
    (item) =>
      Number.isFinite(item.accuracy) &&
      item.accuracy >= 0 &&
      item.accuracy <= 100,
  )

  return (
    <ChartCard title={title} description={description}>
      {validData.length === 0 ? (
        <EmptyChart
          title="Evaluation results needed"
          description="Add your actual test accuracy for the best ML, deep learning and transformer model in this task. Prediction counts are not model accuracy."
        />
      ) : (
        <>
          <div className="ax-bar">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={validData}
                margin={{ top: 25, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid
                  stroke={COLORS.grid}
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="model"
                  tick={{ fill: COLORS.muted, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: COLORS.muted, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(2)}%`,
                    'Test accuracy',
                  ]}
                  contentStyle={{ borderRadius: 12, fontSize: 12 }}
                />
                <Bar
                  dataKey="accuracy"
                  name="Test accuracy"
                  fill={color}
                  radius={[7, 7, 0, 0]}
                  maxBarSize={70}
                  isAnimationActive
                  animationDuration={900}
                  label={{
                    position: 'top',
                    fill: '#334155',
                    fontSize: 11,
                    formatter: (value) => `${value}%`,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="ax-chart-foot">
            Highest measured accuracy:{' '}
            <strong>
              {Math.max(...validData.map((item) => item.accuracy)).toFixed(2)}%
            </strong>
          </p>
        </>
      )}
    </ChartCard>
  )
}

function WorkflowCard() {
  const [active, setActive] = useState(0)
  const stage = WORKFLOW[active]
  const Icon = stage.icon

  return (
    <section className="ax-card ax-workflow">
      <div className="ax-card-heading">
        <div>
          <h3>How ToneMatrix Analytics Works</h3>
          <p>Select a stage to explore the research pipeline.</p>
        </div>
        <Workflow size={22} color={COLORS.purple} />
      </div>

      <div className="ax-flow">
        {WORKFLOW.map((item, index) => {
          const StageIcon = item.icon
          return (
            <button
              type="button"
              key={item.title}
              className={`ax-flow-node ${active === index ? 'active' : ''}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span className="ax-stage-number">0{index + 1}</span>
              <span className="ax-flow-icon">
                <StageIcon size={20} />
              </span>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </button>
          )
        })}
      </div>

      <div className="ax-flow-detail" aria-live="polite">
        <span className="ax-flow-detail-icon">
          <Icon size={20} />
        </span>
        <div className="ax-flow-description">
          <strong>{stage.title}</strong>
          <p>{stage.description}</p>
        </div>
        <div className="ax-flow-controls">
          <button
            type="button"
            className="ax-button"
            disabled={active === 0}
            onClick={() => setActive((value) => value - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="ax-button ax-button-primary"
            onClick={() => setActive((value) => (value + 1) % WORKFLOW.length)}
          >
            {active === WORKFLOW.length - 1 ? 'Start again' : 'Next stage'}
          </button>
        </div>
      </div>
    </section>
  )
}

function Analytics() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API}/api/history`)

      if (!response.ok) {
        throw new Error(`History API returned ${response.status}.`)
      }

      const records = await response.json()

      if (!Array.isArray(records)) {
        throw new Error('The history endpoint did not return a JSON array.')
      }

      setHistory(records)
      setUpdatedAt(new Date())
    } catch (err) {
      setError(
        err.message || 'Could not load the saved analysis history.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const sentimentRecords = useMemo(
    () =>
      history.filter((record) =>
        ['positive', 'negative', 'neutral'].includes(
          normalize(record.sentiment),
        ),
      ),
    [history],
  )

  const sarcasmRecords = useMemo(
    () =>
      history.filter((record) =>
        ['sarcastic', 'non-sarcastic', 'non sarcastic'].includes(
          normalize(record.sarcasm),
        ),
      ),
    [history],
  )

  const sentimentData = useMemo(
    () =>
      ['Positive', 'Negative', 'Neutral'].map((name) => ({
        name,
        value: sentimentRecords.filter(
          (record) => normalize(record.sentiment) === name.toLowerCase(),
        ).length,
      })),
    [sentimentRecords],
  )

  const sarcasmData = useMemo(
    () => [
      {
        name: 'Sarcastic',
        value: sarcasmRecords.filter(
          (record) => normalize(record.sarcasm) === 'sarcastic',
        ).length,
      },
      {
        name: 'Non-Sarcastic',
        value: sarcasmRecords.filter((record) =>
          ['non-sarcastic', 'non sarcastic'].includes(
            normalize(record.sarcasm),
          ),
        ).length,
      },
    ],
    [sarcasmRecords],
  )

  const modelCount = useMemo(() => {
    const models = new Set()

    history.forEach((record) => {
      ;[
        record.sentiment_model,
        record.sarcasm_model,
        record.sentimentModel,
        record.sarcasmModel,
      ].forEach((model) => {
        if (typeof model === 'string' && model.trim()) {
          models.add(model.trim())
        }
      })
    })

    return models.size
  }, [history])

  const sentimentTotal = sentimentData.reduce(
    (sum, item) => sum + item.value,
    0,
  )
  const sarcasmTotal = sarcasmData.reduce(
    (sum, item) => sum + item.value,
    0,
  )
  const sentimentDatasetTotal = SENTIMENT_DATASET.reduce(
    (sum, item) => sum + item.value,
    0,
  )
  const sarcasmDatasetTotal = SARCASM_DATASET.reduce(
    (sum, item) => sum + item.value,
    0,
  )

  // Evaluation values transcribed from the model-comparison results previously shared.
  // These are test/evaluation metrics, not live prediction counts or confidence scores.
  const sentimentAccuracy = [
    { model: 'Logistic Regression', family: 'Traditional ML', accuracy: 97.6 },
    { model: 'SVM', family: 'Traditional ML', accuracy: 97.4 },
    { model: 'Logistic Regression', family: 'Traditional ML', accuracy: 97.2 },
    { model: 'Random Forest', family: 'Traditional ML', accuracy: 96.0 },
    { model: 'Decision Tree', family: 'Traditional ML', accuracy: 94.7 },
  ]
  const sarcasmAccuracy = [
    { model: 'Logistic Regression', family: 'Traditional ML', accuracy: 88.4 },
    { model: 'CNN', family: 'Deep Learning', accuracy: 87.9 },
    { model: 'mBERT', family: 'Transformer', accuracy: 90.83 },
  ]

  return (
    <main className="ax-dashboard">
      <style>{`
        .ax-dashboard {
          display: flex;
          flex-direction: column;
          gap: 22px;
          min-width: 0;
          color: #172554;
          animation: ax-enter .4s ease both;
        }

        @keyframes ax-enter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ax-hero {
          padding: 26px;
          border: 1px solid #ddd6fe;
          border-radius: 18px;
          background: linear-gradient(120deg,#fff,#f5f1ff 68%,#eef5ff);
        }

        .ax-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          color: ${COLORS.purple};
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .ax-hero h2 {
          margin: 0 0 9px;
          font-size: clamp(24px,3vw,31px);
        }

        .ax-hero p {
          color: ${COLORS.muted};
          font-size: 13px;
          line-height: 1.8;
        }

        .ax-hero-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }

        .ax-updated {
          color: ${COLORS.muted};
          font-size: 11px;
        }

        .ax-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 15px;
          border: 1px solid #ddd6fe;
          border-radius: 10px;
          background: white;
          color: #5b21b6;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: .2s ease;
        }

        .ax-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 14px #7047eb18;
          border-color: ${COLORS.purple};
        }

        .ax-button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .ax-button-primary {
          background: ${COLORS.purple};
          color: white;
          border-color: ${COLORS.purple};
        }

        .ax-metrics {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 14px;
        }

        .ax-metric {
          min-width: 0;
          padding: 19px;
          border: 1px solid #e0e7f5;
          border-radius: 15px;
          background: white;
          transition: transform .22s,box-shadow .22s,border-color .22s;
        }

        .ax-metric:hover {
          transform: translateY(-4px);
          border-color: #c4b5fd;
          box-shadow: 0 12px 26px #7047eb14;
        }

        .ax-metric-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 17px;
          color: ${COLORS.muted};
          font-size: 12px;
        }

        .ax-metric-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .ax-metric-value {
          display: block;
          margin-bottom: 8px;
          font-size: 28px;
          overflow-wrap: anywhere;
        }

        .ax-metric small {
          color: ${COLORS.muted};
          font-size: 11px;
          line-height: 1.7;
        }

        .ax-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 18px;
          align-items: stretch;
        }

        .ax-card {
          min-width: 0;
          padding: 22px;
          border: 1px solid #e0e7f5;
          border-radius: 17px;
          background: white;
          transition: border-color .2s,box-shadow .2s;
        }

        .ax-card:hover {
          border-color: #c4b5fd;
          box-shadow: 0 9px 24px #7047eb0b;
        }

        .ax-card-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 15px;
        }

        .ax-card-heading h3 {
          margin: 0 0 6px;
          font-size: 15px;
        }

        .ax-card-heading p {
          margin: 0;
          color: ${COLORS.muted};
          font-size: 11px;
          line-height: 1.7;
        }

        .ax-total {
          padding: 9px 12px;
          border-radius: 11px;
          background: #f5f3ff;
          text-align: right;
          flex-shrink: 0;
        }

        .ax-total span,.ax-total strong {
          display: block;
        }

        .ax-total span {
          color: ${COLORS.muted};
          font-size: 10px;
        }

        .ax-total strong {
          margin-top: 3px;
          color: ${COLORS.purple};
          font-size: 20px;
        }

        .ax-donut {
          position: relative;
          width: 100%;
          height: 265px;
        }

        .ax-donut-center {
          position: absolute;
          top: 42%;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%,-50%);
          pointer-events: none;
        }

        .ax-donut-center strong {
          font-size: 27px;
        }

        .ax-donut-center span {
          margin-top: 3px;
          color: ${COLORS.muted};
          font-size: 10px;
        }

        .ax-label-list {
          display: grid;
          gap: 13px;
          margin-top: 12px;
          padding-top: 15px;
          border-top: 1px solid #edf0f8;
        }

        .ax-label-row {
          display: grid;
          grid-template-columns: minmax(0,1fr) auto auto;
          align-items: center;
          gap: 15px;
          font-size: 12px;
        }

        .ax-label-name {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .ax-label-name i {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .ax-percent {
          min-width: 48px;
          color: ${COLORS.muted};
          text-align: right;
        }

        .ax-bar {
          width: 100%;
          height: 285px;
          min-width: 0;
        }

        .ax-chart-foot {
          margin: 12px 0 0;
          padding-top: 12px;
          border-top: 1px solid #edf0f8;
          color: ${COLORS.muted};
          font-size: 11px;
        }

        .ax-chart-foot strong {
          color: #172554;
        }

        .ax-empty {
          min-height: 285px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 11px;
          padding: 25px;
          border: 1px dashed #d8d4ee;
          border-radius: 13px;
          color: ${COLORS.muted};
          font-size: 12px;
          line-height: 1.8;
          text-align: center;
        }

        .ax-empty strong {
          color: #172554;
          font-size: 14px;
        }

        .ax-error {
          padding: 15px;
          border: 1px solid #fecaca;
          border-radius: 12px;
          background: #fff1f2;
          color: #991b1b;
          font-size: 12px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .ax-workflow {
          padding: 24px;
        }

        .ax-flow {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 15px;
        }

        .ax-flow-node {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          min-width: 0;
          min-height: 160px;
          padding: 17px;
          border: 1px solid #e0e7f5;
          border-radius: 14px;
          background: white;
          text-align: left;
          cursor: pointer;
          transition: .22s ease;
        }

        .ax-flow-node:hover {
          transform: translateY(-3px);
          border-color: #b8a5ff;
        }

        .ax-flow-node.active {
          border-color: ${COLORS.purple};
          background: #f7f4ff;
          box-shadow: 0 8px 20px #7047eb13;
        }

        .ax-stage-number {
          color: ${COLORS.purple};
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1px;
        }

        .ax-flow-icon {
          display: grid;
          place-items: center;
          width: 37px;
          height: 37px;
          border-radius: 11px;
          background: #f1ecff;
          color: ${COLORS.purple};
        }

        .ax-flow-node strong {
          font-size: 12px;
          line-height: 1.6;
        }

        .ax-flow-node small {
          color: ${COLORS.muted};
          font-size: 10px;
          line-height: 1.6;
        }

        .ax-flow-detail {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 20px;
          padding: 17px;
          border: 1px solid #e5ddff;
          border-radius: 13px;
          background: #f7f4ff;
        }

        .ax-flow-detail-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 11px;
          background: white;
          color: ${COLORS.purple};
        }

        .ax-flow-description {
          flex: 1;
          min-width: 0;
        }

        .ax-flow-description strong {
          color: #4c1d95;
          font-size: 12px;
        }

        .ax-flow-description p {
          margin: 5px 0 0;
          color: #6d3ac7;
          font-size: 11px;
          line-height: 1.8;
        }

        .ax-flow-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        .ax-note {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 16px;
          border: 1px solid #e5ddff;
          border-radius: 13px;
          background: #f7f4ff;
          color: #5b21b6;
          font-size: 11px;
          line-height: 1.8;
        }

        .ax-note svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        @media(max-width:1100px) {
          .ax-metrics { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .ax-grid { grid-template-columns: 1fr; }
          .ax-flow { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .ax-flow-detail { flex-wrap: wrap; }
          .ax-flow-controls { width: 100%; justify-content: center; }
        }

        @media(max-width:600px) {
          .ax-hero,.ax-card,.ax-workflow { padding: 15px; }
          .ax-metrics { grid-template-columns: 1fr; }
          .ax-flow { grid-template-columns: 1fr; }
          .ax-flow-node { min-height: auto; }
          .ax-donut { height: 240px; }
          .ax-bar { height: 245px; }
          .ax-card-heading { flex-wrap: wrap; }
        }

        @media(prefers-reduced-motion:reduce) {
          .ax-dashboard * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className="ax-hero">
        <div className="ax-eyebrow">
          <Activity size={15} />
          RESEARCH &amp; MODEL INTELLIGENCE
        </div>
        <h2>Analytics Dashboard</h2>
        <p>
          Explore your self-created Marathi datasets, saved predictions and
          model evaluation results in one interactive workspace.
        </p>
        <div className="ax-hero-bottom">
          <span className="ax-updated">
            {updatedAt
              ? `History refreshed at ${updatedAt.toLocaleTimeString()}`
              : 'Connecting to saved history…'}
          </span>
          <button
            className="ax-button"
            type="button"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={15} />
            {loading ? 'Refreshing…' : 'Refresh Analytics'}
          </button>
        </div>
      </header>

      {error && (
        <div className="ax-error" role="alert">
          <strong>Unable to load saved history.</strong>
          <br />
          {error}
          <br />
          Check that FastAPI is running and `/api/history` returns a JSON array.
          <br />
          <button className="ax-button" onClick={refresh} type="button">
            Retry
          </button>
        </div>
      )}

      <section className="ax-metrics">
        <MetricCard
          title="Saved Analyses"
          value={loading ? '…' : history.length}
          note="Records from your existing history"
          icon={Activity}
          color={COLORS.purple}
        />
        <MetricCard
          title="Sentiment Predictions"
          value={loading ? '…' : sentimentTotal}
          note="Recognized saved sentiment labels"
          icon={Heart}
          color={COLORS.green}
        />
        <MetricCard
          title="Sarcasm Predictions"
          value={loading ? '…' : sarcasmTotal}
          note="Recognized saved sarcasm labels"
          icon={MessageCircle}
          color={COLORS.blue}
        />
        <MetricCard
          title="Models Used"
          value={loading ? '…' : modelCount}
          note="Distinct model names in saved history"
          icon={BrainCircuit}
          color={COLORS.orange}
        />
      </section>

      {/* ROW 1: Saved analysis totals */}
      <section className="ax-grid">
        <ChartCard
          title="Sentiment Analysis Count"
          description="Saved predictions grouped by sentiment label"
          total={sentimentTotal}
        >
          <DonutChart
            data={sentimentData}
            colors={SENTIMENT_COLORS}
            total={sentimentTotal}
            loading={loading}
          />
        </ChartCard>

        <ChartCard
          title="Sarcasm Analysis Count"
          description="Saved predictions grouped by sarcasm label"
          total={sarcasmTotal}
        >
          <DonutChart
            data={sarcasmData}
            colors={SARCASM_COLORS}
            total={sarcasmTotal}
            loading={loading}
          />
        </ChartCard>
      </section>

      {/* ROW 2: Saved prediction breakdowns */}
      <section className="ax-grid">
        <ChartCard
          title="Sentiment Prediction Breakdown"
          description="Positive, negative and neutral predictions from history"
          total={sentimentTotal}
        >
          <BarDistribution
            data={sentimentData}
            colors={SENTIMENT_COLORS}
            total={sentimentTotal}
            loading={loading}
          />
        </ChartCard>

        <ChartCard
          title="Sarcasm Prediction Breakdown"
          description="Sarcastic and non-sarcastic predictions from history"
          total={sarcasmTotal}
        >
          <BarDistribution
            data={sarcasmData}
            colors={{
              Sarcastic: COLORS.purple,
              'Non-Sarcastic': COLORS.cyan,
            }}
            total={sarcasmTotal}
            loading={loading}
          />
        </ChartCard>
      </section>

      {/* ROW 3: Actual CSV dataset distributions */}
      <section className="ax-grid">
        <ChartCard
          title="Sentiment Dataset Distribution"
          description="Label counts in your self-created sentiment CSV"
          total={sentimentDatasetTotal}
        >
          <BarDistribution
            data={SENTIMENT_DATASET}
            colors={SENTIMENT_COLORS}
            total={sentimentDatasetTotal}
            loading={false}
          />
        </ChartCard>

        <ChartCard
          title="Sarcasm Dataset Distribution"
          description="Original numeric labels in your self-created sarcasm CSV"
          total={sarcasmDatasetTotal}
        >
          <BarDistribution
            data={SARCASM_DATASET}
            colors={SARCASM_COLORS}
            total={sarcasmDatasetTotal}
            loading={false}
          />
          <p className="ax-chart-foot">
            Numeric label meanings have not been assumed. Confirm the mapping
            before renaming these labels to Sarcastic and Non-Sarcastic.
          </p>
        </ChartCard>
      </section>

      {/* ROW 4: Actual model evaluation accuracy */}
      <section className="ax-grid">
        <AccuracyChart
          title="Best Sentiment Model Accuracy"
          description="Highest measured test accuracy across ML, deep learning and transformer families"
          data={sentimentAccuracy}
          color={COLORS.blue}
        />
        <AccuracyChart
          title="Best Sarcasm Model Accuracy"
          description="Highest measured test accuracy across ML, deep learning and transformer families"
          data={sarcasmAccuracy}
          color={COLORS.purple}
        />
      </section>

      <WorkflowCard />
    </main>
  )
}

export default Analytics
