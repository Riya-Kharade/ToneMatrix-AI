
import {
  BrainCircuit,
  Code2,
  Database,
  GitBranch,
  GraduationCap,
  Layers3,
  Languages,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  ExternalLink,
  Cpu,
  MessageCircle,
} from 'lucide-react'

const teamMembers = [
  {
    name: 'Riya Kharade',
    role: 'Project Developer',
    initials: 'RK',
    color: '#7047eb',
    photo: '/images/riya.png',
    description:
      'Solely responsible for planning, designing, and developing ToneMatrix AI. Handles end-to-end project development, including frontend and backend implementation, Marathi NLP model development and integration, testing, and project documentation.',
  },

]

const technologies = [
  { name: 'React.js', detail: 'Frontend interface', icon: Code2 },
  { name: 'Vite', detail: 'Development tooling', icon: Layers3 },
  { name: 'Python & FastAPI', detail: 'Backend API', icon: Workflow },
  { name: 'Machine Learning', detail: 'Traditional ML models', icon: Cpu },
  { name: 'Deep Learning', detail: 'Neural network models', icon: BrainCircuit },
  { name: 'Transformers', detail: 'Marathi NLP models', icon: Languages },
  { name: 'JSON', detail: 'Saved analysis history', icon: Database },
  { name: 'CSS', detail: 'Responsive UI and animations', icon: Sparkles },
]

const features = [
  {
    title: 'Sentiment Analysis',
    description:
      'Classifies Marathi text into positive, negative, and neutral sentiment.',
    icon: Target,
    color: '#10b981',
  },
  {
    title: 'Sarcasm Detection',
    description:
      'Predicts whether Marathi text is sarcastic or non-sarcastic.',
    icon: MessageCircle,
    color: '#7047eb',
  },
  {
    title: 'Model Comparison',
    description:
      'Compare machine learning, deep learning, and transformer experiments.',
    icon: BrainCircuit,
    color: '#3478f6',
  },
  {
    title: 'Analysis History',
    description:
      'Stores prediction records through the backend for review and analytics.',
    icon: Database,
    color: '#f59e0b',
  },
]

function About() {
  return (
    <main className="about-page">
      <style>{`
        .about-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
          color: #172554;
          animation: aboutEnter .45s ease both;
        }

        @keyframes aboutEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .about-hero {
          position: relative;
          overflow: hidden;
          padding: 32px;
          border: 1px solid #ddd6fe;
          border-radius: 20px;
          background: linear-gradient(120deg, #fff, #f6f2ff 65%, #edf5ff);
        }

        .about-hero::after {
          content: "";
          position: absolute;
          width: 210px;
          height: 210px;
          top: -120px;
          right: -65px;
          border-radius: 50%;
          background: #7047eb12;
          pointer-events: none;
        }

        .about-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 13px;
          color: #7047eb;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .about-hero h2 {
          margin: 0;
          font-size: clamp(27px, 3vw, 36px);
          letter-spacing: -.8px;
        }

        .about-hero > p {
          max-width: 850px;
          margin: 13px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.9;
        }

        .about-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 21px;
        }

        .about-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          border: 1px solid #e5ddff;
          border-radius: 10px;
          background: #ffffffc9;
          color: #5b21b6;
          font-size: 11px;
          font-weight: 650;
        }

        .about-section-heading {
          margin-bottom: 15px;
        }

        .about-section-heading h3 {
          margin: 0;
          font-size: 20px;
        }

        .about-section-heading p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.8;
        }

        .about-team-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 17px;
        }

        .about-team-card {
          padding: 23px;
          border: 1px solid #e0e7f5;
          border-radius: 17px;
          background: white;
          transition: transform .25s ease, box-shadow .25s ease,
            border-color .25s ease;
        }

        .about-team-card:hover {
          transform: translateY(-5px);
          border-color: #c4b5fd;
          box-shadow: 0 14px 28px #7047eb12;
        }

        .about-team-top {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .about-avatar {
          display: grid;
          place-items: center;
          width: 76px;
          height: 76px;
          flex-shrink: 0;
          overflow: hidden;
          border: 3px solid #eee8ff;
          border-radius: 50%;
          color: white;
          background: linear-gradient(135deg, var(--member-color), #bda7ff);
          font-size: 22px;
          font-weight: 800;
          transition: transform .25s ease;
        }

        .about-team-card:hover .about-avatar {
          transform: scale(1.05);
        }

        .about-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-team-card h4 {
          margin: 0;
          font-size: 17px;
          line-height: 1.5;
        }

        .about-team-role {
          margin: 5px 0 0;
          color: var(--member-color);
          font-size: 11px;
          font-weight: 750;
          line-height: 1.6;
        }

        .about-team-description {
          margin: 19px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.9;
        }

        .about-guide-card {
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 23px;
          border: 1px solid #ddd6fe;
          border-radius: 17px;
          background: linear-gradient(115deg, #fff, #f7f3ff);
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .about-guide-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px #7047eb12;
        }

        .about-guide-icon {
          display: grid;
          place-items: center;
          width: 55px;
          height: 55px;
          flex-shrink: 0;
          border-radius: 15px;
          color: #7047eb;
          background: #eee8ff;
        }

        .about-guide-card h4 {
          margin: 0;
          font-size: 17px;
        }

        .about-guide-card p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .about-feature-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .about-feature-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 19px;
          border: 1px solid #e0e7f5;
          border-radius: 15px;
          background: white;
          transition: transform .22s ease, box-shadow .22s ease,
            border-color .22s ease;
        }

        .about-feature-card:hover {
          transform: translateY(-4px);
          border-color: #c4b5fd;
          box-shadow: 0 10px 23px #7047eb10;
        }

        .about-feature-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border-radius: 12px;
          color: var(--feature-color);
          background: var(--feature-tint);
        }

        .about-feature-card h4 {
          margin: 1px 0 7px;
          font-size: 14px;
        }

        .about-feature-card p {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.8;
        }

        .about-tech-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .about-tech-card {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 15px 12px;
          border: 1px solid #e0e7f5;
          border-radius: 13px;
          background: white;
          transition: transform .2s ease, border-color .2s ease,
            box-shadow .2s ease;
        }

        .about-tech-card:hover {
          transform: translateY(-3px);
          border-color: #c4b5fd;
          box-shadow: 0 8px 18px #7047eb10;
        }

        .about-tech-icon {
          display: grid;
          place-items: center;
          width: 37px;
          height: 37px;
          flex-shrink: 0;
          border-radius: 10px;
          color: #7047eb;
          background: #f1ecff;
        }

        .about-tech-card strong {
          display: block;
          font-size: 11px;
          line-height: 1.5;
        }

        .about-tech-card span {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 10px;
          line-height: 1.5;
        }

        .about-repo-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          align-self: flex-start;
          padding: 12px 16px;
          border: 1px solid #7047eb;
          border-radius: 11px;
          background: #7047eb;
          color: white;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: transform .2s ease, box-shadow .2s ease,
            background .2s ease;
        }

        .about-repo-link:hover {
          transform: translateY(-2px);
          background: #5b32d6;
          box-shadow: 0 8px 18px #7047eb35;
        }

        .about-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 17px;
          border: 1px solid #e5ddff;
          border-radius: 13px;
          background: #f7f4ff;
          color: #5b21b6;
          font-size: 11px;
          line-height: 1.8;
        }

        .about-note svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        @media (max-width: 1050px) {
          .about-tech-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .about-hero {
            padding: 22px;
          }

          .about-team-grid,
          .about-feature-grid,
          .about-tech-grid {
            grid-template-columns: 1fr;
          }

          .about-team-card {
            padding: 19px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-page *,
          .about-page *::before {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className="about-hero">
        <p className="about-eyebrow">
          <Sparkles size={15} />
          ABOUT THE PROJECT
        </p>

        <h2>ToneMatrix AI</h2>

        <p>
          An intelligent Marathi Natural Language Processing (NLP) platform
          designed to analyze sentiment and detect sarcasm in Marathi text.
          The project brings together machine learning, deep learning,
          transformer models, and an interactive web dashboard.
        </p>

        <div className="about-badges">
          <span className="about-badge">
            <Languages size={15} /> Marathi NLP
          </span>
          <span className="about-badge">
            <BrainCircuit size={15} /> ML · DL · Transformers
          </span>
          <span className="about-badge">
            <Users size={15} /> Student Research Project
          </span>
        </div>
      </header>

      <section>
        <div className="about-section-heading">
          <h3>Project Overview</h3>
          <p>Purpose, scope, and main objectives of ToneMatrix AI.</p>
        </div>

        <div className="about-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                className="about-feature-card"
                key={feature.title}
                style={{
                  '--feature-color': feature.color,
                  '--feature-tint': `${feature.color}16`,
                }}
              >
                <div className="about-feature-icon">
                  <Icon size={21} />
                </div>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section>
        <div className="about-section-heading">
          <h3>Project Admin</h3>
          <p>Project Lead & Full-Stack AI Developer</p>
        </div>

        <div className="about-team-grid">
          {teamMembers.map((member) => (
            <article
              className="about-team-card"
              key={member.name}
              style={{ '--member-color': member.color }}
            >
              <div className="about-team-top">
                <div className="about-avatar">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} />
                  ) : (
                    member.initials
                  )}
                </div>

                <div>
                  <h4>{member.name}</h4>
                  <p className="about-team-role">{member.role}</p>
                </div>
              </div>

              <p className="about-team-description">
                {member.description}
              </p>
            </article>
          ))}
        </div>
      </section>

     

      <section>
        <div className="about-section-heading">
          <h3>Technology Stack</h3>
          <p>Technologies used across the application and NLP workflow.</p>
        </div>

        <div className="about-tech-grid">
          {technologies.map((technology) => {
            const Icon = technology.icon

            return (
              <article className="about-tech-card" key={technology.name}>
                <div className="about-tech-icon">
                  <Icon size={19} />
                </div>
                <div>
                  <strong>{technology.name}</strong>
                  <span>{technology.detail}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section>
        <div className="about-section-heading">
          <h3>Source Code</h3>
          <p>Explore the project repository and implementation.</p>
        </div>

        <a
          className="about-repo-link"
          href="https://github.com/Riya-Kharade/ToneMatrix-AI"
          target="_blank"
          rel="noreferrer"
        >
          <GitBranch size={17} />
          View ToneMatrix AI on GitHub
          <ExternalLink size={15} />
        </a>
      </section>

      
    </main>
  )
}

export default About
