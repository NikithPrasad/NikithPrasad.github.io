import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit,
  BriefcaseBusiness, Check, ChevronDown, Code2, Database, ExternalLink,
  Github, Mail, Menu, MousePointer2, Radar, ScanLine, ShieldCheck,
  X,
} from 'lucide-react'

const projects = [
  {
    id: 'scholarpath', number: '01', name: 'ScholarPath', type: 'AI SYSTEMS · INFORMATION RETRIEVAL',
    quickMetric: '.954 MRR@5',
    color: '#f5c451', image: '/assets/scholarpath.png', imageAlt: 'ScholarPath scholarship question answering dashboard',
    repo: 'https://github.com/NikithPrasad/ScholarPath',
    summary: 'A local-first scholarship navigator that can show its work.',
    description: 'A citation-grounded assistant over official scholarship guidance. BM25 and TF-IDF feed a Reciprocal Rank Fusion pipeline; the app cites the passages behind each answer, abstains when the evidence is weak, and can optionally use a local Ollama model.',
    metrics: [['0.954', 'Source MRR@5'], ['0.931', 'Chunk Hit@3'], ['1.00', 'OOD abstention'], ['11', 'tests']],
    flow: ['Official scheme docs', 'BM25 + TF-IDF', 'RRF ranking', 'Cited answer'],
    stack: ['Python', 'Streamlit', 'BM25', 'scikit-learn', 'Ollama'],
  },
  {
    id: 'queuewatch', number: '02', name: 'QueueWatch', type: 'COMPUTER VISION · REAL-TIME ANALYTICS',
    quickMetric: '12.68 FPS',
    color: '#38bdf8', image: '/assets/queuewatch.gif', imageAlt: 'QueueWatch people detection, line crossing and zone analytics demo',
    repo: 'https://github.com/NikithPrasad/QueueWatch',
    summary: 'From video frames to useful footfall signals.',
    description: 'A people-flow analytics pipeline using YOLO11 detections and ByteTrack identities. Finite-line crossing counts, editable direction names, zone occupancy, dwell estimates, and a footfall heatmap are available for uploaded clips and live sources.',
    metrics: [['13.53%', 'sMAPE'], ['1.625', 'MAE'], ['12.68', 'FPS'], ['11', 'tests']],
    flow: ['Video / webcam', 'YOLO11 detections', 'ByteTrack IDs', 'Crossing + dwell'],
    stack: ['Python', 'YOLO11', 'ByteTrack', 'OpenCV', 'Streamlit'],
  },
  {
    id: 'commerceflow', number: '03', name: 'CommerceFlow', type: 'DATA ENGINEERING · ANALYTICS',
    quickMetric: '7/7 GATES',
    color: '#e63946', image: '/assets/commerceflow.png', imageAlt: 'CommerceFlow retail warehouse dashboard',
    repo: 'https://github.com/NikithPrasad/CommerceFlow',
    summary: 'A reproducible path from raw retail data to trusted metrics.',
    description: 'A deterministic retail ETL workflow that validates raw CSVs, writes cleaned Parquet layers, quarantines invalid and orphan rows, records source SHA-256 hashes, and builds a DuckDB warehouse for the dashboard.',
    metrics: [['7 / 7', 'quality gates'], ['0.0', 'reconciliation delta'], ['4,000', 'synthetic orders'], ['4', 'tests']],
    flow: ['Raw CSVs', 'Validate + quarantine', 'Parquet layers', 'DuckDB dashboard'],
    stack: ['Python', 'DuckDB', 'Parquet', 'Pandas', 'Streamlit'],
  },
  {
    id: 'skincheck', number: '04', name: 'SkinCheck', type: 'APPLIED ML · RESPONSIBLE AI',
    quickMetric: '79.3% TOP-3',
    color: '#f5c451', image: '/assets/skin-disease-detection.png', imageAlt: 'SkinCheck prediction, attention map and safety disclaimer interface',
    repo: 'https://github.com/NikithPrasad/Skin-Disease-Detection',
    summary: 'A careful, explainable skin-concern awareness prototype.',
    description: 'An EfficientNet-B0 classifier covering 24 output groups, with an out-of-distribution photo check, Grad-CAM attention view, plain-language next steps, and a prominent educational-use disclaimer. It is explicitly not a diagnostic tool.',
    metrics: [['79.3%', 'Top-3 accuracy'], ['0.937', 'Macro AUC'], ['78.4%', 'Melanoma recall'], ['53', 'tests']],
    flow: ['Photo quality + OOD', 'EfficientNet-B0', 'Grad-CAM', 'Safety-first result'],
    stack: ['Python', 'PyTorch', 'EfficientNet', 'Grad-CAM', 'Flask'],
  },
  {
    id: 'skinbench', number: '05', name: 'Skin Model Benchmark', type: 'EXPERIMENT DESIGN · MODEL EVALUATION',
    color: '#38bdf8', image: '/assets/skin-disease-model-comparison.png', imageAlt: 'Skin disease model comparison benchmark interface',
    repo: 'https://github.com/NikithPrasad/Skin-Disease-Model-Comparison',
    summary: 'A controlled benchmark designed to expose the trade-offs.',
    description: 'A four-architecture comparison across three seeds, using lesion-level splits on HAM10000 and external ISIC 2018 evaluation. The project also documents and tests for leakage, making the reported comparisons more meaningful.',
    metrics: [['85.8%', 'ResNet50 accuracy'], ['4 × 3', 'models × seeds'], ['10,015', 'HAM10000 images'], ['31', 'tests']],
    flow: ['Lesion-level split', '4 architectures', '3-seed runs', 'External ISIC check'],
    stack: ['Python', 'PyTorch', 'HAM10000', 'ISIC 2018', 'pytest'],
  },
  {
    id: 'campusspace', number: '06', name: 'CampusSpace AI', type: 'FULL-STACK · PRODUCT ENGINEERING',
    color: '#e63946', image: '/assets/campusspace-ai.png', imageAlt: 'CampusSpace E Block interactive floor plan and booking view',
    repo: 'https://github.com/NikithPrasad/CampusSpace-AI',
    summary: 'A shared campus, made easier to navigate and book.',
    description: 'A full-stack campus resource booking product with a React floor plan, room availability, booking workflows, and admin controls. The API uses Express 5, MongoDB, JWT cookies, and Zod validation.',
    metrics: [['50', 'campus spaces'], ['5', 'floors'], ['14', 'API tests'], ['105', 'Postman requests']],
    flow: ['React floor plan', 'Express 5 API', 'JWT + Zod', 'MongoDB bookings'],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB'],
  },
]

const navItems = [
  ['work', 'WORK'], ['experience', 'EXPERIENCE'], ['skills', 'SKILLS'], ['contact', 'CONTACT'],
]

function useActiveSection() {
  const [active, setActive] = useState('work')
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.35] })
    navItems.forEach(([id]) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [])
  return active
}

function Header() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <a className="monogram" href="#top" aria-label="Nikith Prasad, back to top"><span>N</span><i>P</i><b /></a>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav className={`nav-pill ${open ? 'nav-open' : ''}`} aria-label="Main navigation">
        {navItems.map(([id, label]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="nav-resume" href="/resume.pdf" target="_blank" rel="noreferrer">RESUME <ArrowUpRight size={12} /></a>
      </nav>
    </header>
  )
}

function CompassMark({ color = '#f5c451' }) {
  return <svg className="compass-mark" viewBox="0 0 220 220" aria-hidden="true">
    <defs><radialGradient id="compassGlow"><stop stopColor={color} stopOpacity=".23"/><stop offset="1" stopColor={color} stopOpacity="0"/></radialGradient></defs>
    <circle cx="110" cy="110" r="105" fill="url(#compassGlow)" />
    <circle cx="110" cy="110" r="73" fill="none" stroke={color} strokeOpacity=".24" />
    <circle cx="110" cy="110" r="56" fill="none" stroke={color} strokeOpacity=".12" strokeDasharray="2 6" />
    <path d="M110 22v23M110 175v23M22 110h23M175 110h23M48 48l16 16m102 102 16 16m0-134-16 16M64 156l-16 16" stroke={color} strokeOpacity=".38" />
    <path d="m110 70 13 40-13 40-13-40z" fill={color} fillOpacity=".76" />
    <path d="m110 70 13 40-13-5z" fill="#e63946" />
    <circle cx="110" cy="110" r="6" fill="#0a0a0a" stroke={color} strokeWidth="2" />
    <text x="110" y="18" textAnchor="middle" fill={color} fillOpacity=".7" fontSize="9" fontFamily="monospace">N</text>
    <text x="110" y="215" textAnchor="middle" fill={color} fillOpacity=".7" fontSize="9" fontFamily="monospace">S</text>
  </svg>
}

function Hero() {
  const [typed, setTyped] = useState('')
  const phrases = ['AI/ML engineer', 'computer vision builder', 'data product developer']
  useEffect(() => {
    let phrase = 0; let letter = 0; let deleting = false; let timer
    const tick = () => {
      const current = phrases[phrase]
      letter += deleting ? -1 : 1
      setTyped(current.slice(0, letter))
      let delay = deleting ? 38 : 72
      if (!deleting && letter === current.length) { deleting = true; delay = 1400 }
      else if (deleting && letter === 0) { deleting = false; phrase = (phrase + 1) % phrases.length; delay = 300 }
      timer = window.setTimeout(tick, delay)
    }
    timer = window.setTimeout(tick, 300)
    return () => window.clearTimeout(timer)
  }, [])
  return <section className="hero section-shell" id="top">
    <div className="hero-copy">
      <div className="eyebrow"><span className="status-dot" /> OPEN TO BUILDING WHAT’S NEXT <span className="eyebrow-rule" /></div>
      <h1>Building <em>AI systems</em><br />that ship<span className="gold-period">.</span></h1>
      <p className="hero-typed"><span className="typed-line">{typed}</span><span className="typing-caret">_</span><span className="typed-context"> based in Hyderabad, India</span></p>
      <p className="hero-intro">I turn curious questions into useful software — from retrieval systems and vision models to data pipelines and full-stack tools.</p>
      <div className="hero-actions"><a className="button button-gold" href="#contact">Get in touch <ArrowUpRight size={16} /></a><a className="button button-quiet" href="#work">View work <ArrowDown size={15} /></a></div>
      <div className="hero-footnote"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /></div>
    </div>
    <div className="hero-aside-wrap">
      <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      <aside className="profile-card">
        <div className="profile-top"><span className="micro-label">CREATOR PROFILE</span><span className="card-index">NP / 26</span></div>
        <div className="profile-heading"><div className="profile-seal">N<span>P</span><i /></div><div><h2>Chinthala<br />Nikith Prasad</h2><p>Hyderabad, India · B.Tech CSE (AI/ML)</p></div></div>
        <div className="profile-divider" />
        <div className="quick-title"><span>FEATURED REPOS</span><span className="quick-action"><MousePointer2 size={12} /> QUICK INSPECT</span></div>
        <div className="quick-list">{projects.slice(0, 4).map((project) => <a className="quick-row" key={project.id} href={project.repo} target="_blank" rel="noreferrer"><span><i style={{ background: project.color }} />{project.name}</span><code>{project.quickMetric}</code><ArrowUpRight size={14} /></a>)}</div>
        <div className="profile-card-foot"><span><span className="status-dot" /> SHIPPING IN PUBLIC</span><span>HYD · IN</span></div>
      </aside>
      <div className="floating-coordinate"><span>17°23' N</span><span>78°29' E</span></div>
    </div>
  </section>
}

function MetricsStrip() {
  const metrics = [
    { value: 6, display: '06', label: 'SHIPPED REPOS' },
    { value: 124, display: '124', label: 'AUTOMATED TESTS' },
    { value: .954, display: '.954', label: 'RAG SOURCE MRR@5' },
    { value: .937, display: '.937', label: 'SKIN MACRO AUC' },
    { value: 12.68, display: '12.68', label: 'TRACKING FPS' },
  ]
  const [seen, setSeen] = useState(false)
  const [progress, setProgress] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setSeen(true) }, { threshold: .5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!seen) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setProgress(1); return undefined }
    let frame; let start
    const tick = (time) => {
      if (!start) start = time
      const next = Math.min((time - start) / 1150, 1)
      setProgress(1 - (1 - next) ** 3)
      if (next < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seen])
  const formatted = (item) => {
    const value = item.value * progress
    if (item.value === 6) return String(Math.round(value)).padStart(2, '0')
    if (item.value === 124) return `${Math.round(value)}+`
    if (item.value < 1) return value.toFixed(3).replace(/^0/, '')
    return value.toFixed(2)
  }
  return <div className="metrics-strip" ref={ref}>{metrics.map((item, i) => <div className="metric" key={item.label} style={{ '--delay': `${i * 90}ms` }}><strong className={seen ? 'metric-seen' : ''}>{formatted(item)}</strong><span>{item.label}</span></div>)}</div>
}

function ProjectGlyph({ color }) {
  return <div className="glyph-wrap" aria-hidden="true"><CompassMark color={color} /><div className="glyph-coordinate">LOG POSE <span>01 / GRAND LINE</span></div></div>
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('modal-open') }
  }, [onClose])
  if (!project) return null
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close" onClick={onClose} aria-label="Close project details"><X size={19} /></button>
      <div className="modal-scroll">
        <div className="modal-kicker" style={{ color: project.color }}>PONEGLYPH {project.number} <span>·</span> {project.type}</div>
        <h2 id="modal-title">{project.name}<span style={{ color: project.color }}>.</span></h2>
        <p className="modal-summary">{project.description}</p>
        <a className="modal-repo" href={project.repo} target="_blank" rel="noreferrer"><Github size={17} /> Explore source on GitHub <ArrowUpRight size={15} /></a>
        <div className="modal-image-frame"><img src={project.image} alt={project.imageAlt} /></div>
        <div className="modal-section-label">FIELD NOTES <span>MEASURED RESULTS</span></div>
        <div className="modal-metrics">{project.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        <div className="modal-section-label">SYSTEM ROUTE <span>HIGH LEVEL</span></div>
        <div className="architecture-flow">{project.flow.map((step, index) => <div className="flow-step" key={step}><span>{String(index + 1).padStart(2, '0')}</span><b>{step}</b>{index < project.flow.length - 1 && <ArrowRight size={15} />}</div>)}</div>
        <div className="tech-tags">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
      </div>
    </section>
  </div>
}

function WorkSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const markers = useRef([])
  const active = projects[activeIndex]
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveIndex(Number(entry.target.dataset.index))
      })
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 })
    markers.current.forEach((marker) => marker && observer.observe(marker))
    return () => observer.disconnect()
  }, [])
  const goTo = (index) => markers.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return <section id="work" className="work-section">
    <div className="section-shell work-intro"><div><div className="section-kicker"><span>01 / THE WORK</span><span className="kicker-line" /></div><h2>Six Poneglyphs.<br /><em>Six proofs of work.</em></h2></div><p>Each build is a coordinate: a problem understood, a system shaped, a result measured. Follow the trail.</p></div>
    <div className="work-stage">
      <div className="work-pinned">
        <div className="work-card" key={active.id} style={{ '--project-accent': active.color }}>
          <div className="work-card-top"><span>{active.number} <i /> SIX PROOFS</span><a href={active.repo} target="_blank" rel="noreferrer" aria-label={`Open ${active.name} on GitHub`}><ArrowUpRight size={18} /></a></div>
          <div className="work-card-body">
            <div className="work-visual"><img src={active.image} alt={active.imageAlt} /><div className="visual-overlay" /><span className="visual-coordinate">FIG. {active.number} — FIELD RECORD</span></div>
            <div className="work-content"><span className="project-type">{active.type}</span><h3>{active.name}<span>.</span></h3><p className="work-summary">{active.summary}</p>
              <div className="work-metrics">{active.metrics.slice(0, 3).map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
              <div className="work-card-bottom"><button className="details-button" onClick={() => setSelected(active)}>Details <ArrowUpRight size={14} /></button><span className="work-stack">{active.stack.slice(0, 3).join(' · ')}</span></div>
            </div>
          </div>
          <div className="work-card-base"><span>CHARTED IN HYDERABAD</span><span>GRAND LINE / {active.number}</span></div>
        </div>
        <div className="work-glyph"><ProjectGlyph color={active.color} /></div>
        <div className="work-progress" aria-label="Project progress">{projects.map((project, index) => <button key={project.id} aria-label={`Go to ${project.name}`} aria-current={index === activeIndex ? 'step' : undefined} className={index === activeIndex ? 'current' : ''} style={{ '--node-color': project.color }} onClick={() => goTo(index)}><span>{project.number}</span></button>)}</div>
        <div className="work-index" aria-hidden="true">{active.number}</div>
      </div>
      <div className="work-markers" aria-hidden="true">{projects.map((project, index) => <div className="work-marker" data-index={index} key={project.id} ref={(element) => { markers.current[index] = element }}><span>{project.number}</span><span>{project.name}</span><ChevronDown size={14} /></div>)}</div>
    </div>
    <ProjectModal project={selected} onClose={() => setSelected(null)} />
  </section>
}

function OceanCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = 0; let height = 0; let frame = 0; let particles = []
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width; height = rect.height; canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: Math.max(30, Math.floor(width / 12)) }, (_, i) => ({ angle: (i / Math.max(30, Math.floor(width / 12))) * Math.PI * 2, radius: 30 + Math.random() * Math.max(width, height) * .62, speed: .00012 + Math.random() * .00028, size: Math.random() * 1.6 + .25, alpha: Math.random() * .3 + .07 }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const cx = width * .52; const cy = height * .5
      particles.forEach((p) => {
        p.angle += p.speed
        const x = cx + Math.cos(p.angle) * p.radius
        const y = cy + Math.sin(p.angle) * p.radius * .42
        ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(56,189,248,${p.alpha})`; ctx.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    resize(); draw(); window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas className="ocean-canvas" ref={canvasRef} aria-hidden="true" />
}

function ExperienceSection() {
  return <section className="experience-section" id="experience">
    <OceanCanvas />
    <div className="experience-content section-shell">
      <div className="section-kicker"><span>02 / THE JOURNEY</span><span className="kicker-line" /></div>
      <div className="journey-title"><div><p className="micro-label">A COURSE IN PROGRESS</p><h2>Learning by<br /><em>making things.</em></h2></div><p className="journey-aside">Every current leaves a trace. Here’s one of mine so far.</p></div>
      <div className="timeline-card">
        <div className="timeline-date"><span>OCT — NOV</span><i /></div>
        <div className="timeline-main"><div className="timeline-company"><span className="company-mark">H</span><div><h3>Freelance AI Trainer</h3><p>Handshake AI <span>·</span> Project Seal India</p></div></div><p className="timeline-description">Contributed as an AI trainer on Project Seal India, bringing a practical builder’s perspective to AI work.</p></div>
        <div className="timeline-type"><BriefcaseBusiness size={15} /><span>CONTRACT</span></div>
      </div>
      <div className="timeline-note"><span className="note-dot" /> THE NEXT COORDINATE IS STILL BEING CHARTED</div>
    </div>
    <div className="year-watermark">航海</div>
  </section>
}

const skillWords = ['PYTHON', 'PYTORCH', 'YOLO11', 'DUCKDB', 'FASTAPI', 'REACT', 'NODE.JS', 'MONGODB', 'DOCKER', 'GITHUB ACTIONS', 'BM25', 'OPENCV', 'PARQUET']

const capabilities = [
  { id: '01', icon: BrainCircuit, title: 'AI / ML & RAG', text: 'Grounded retrieval, model evaluation, responsible AI, and clear explanations.' , tags: 'PyTorch · BM25 · TF-IDF · RRF' },
  { id: '02', icon: ScanLine, title: 'Computer Vision', text: 'Detection, tracking, visual explanations, and measurable video analytics.', tags: 'YOLO11 · ByteTrack · OpenCV' },
  { id: '03', icon: Database, title: 'Data Engineering', text: 'Reliable transformations, quality checks, lineage, and analytics-ready data.', tags: 'DuckDB · Parquet · SQL' },
  { id: '04', icon: Code2, title: 'Full-Stack & MLOps', text: 'End-to-end product thinking from API boundaries to automated delivery.', tags: 'React · Node.js · GitHub Actions' },
]

function SkillsSection() {
  return <section className="skills-section section-shell" id="skills">
    <div className="section-kicker"><span>03 / THE TOOLKIT</span><span className="kicker-line" /></div>
    <div className="skills-heading"><h2>Tools are a compass.<br /><em>Problems are the map.</em></h2><p>I like moving between disciplines to get a useful thing over the line.</p></div>
    <div className="skills-marquee" aria-label="Technologies"><div className="marquee-track">{[...skillWords, ...skillWords].map((word, i) => <span key={`${word}-${i}`}>{word}<i>✳</i></span>)}</div></div>
    <div className="capability-grid">{capabilities.map(({ id, icon: Icon, title, text, tags }) => <article className={`capability-card capability-${id}`} key={id}><div className="capability-top"><span>{id} / CAPABILITY</span><Icon size={18} strokeWidth={1.5} /></div><h3>{title}</h3><p>{text}</p><div className="capability-tags">{tags}</div><ArrowDownRight className="capability-arrow" size={18} /></article>)}</div>
    <div className="education-row"><div className="education-label"><span>04 / THE FOUNDATION</span><span className="kicker-line" /></div><div className="education-detail"><div><h3>VNR VJIET</h3><p>B.Tech · Computer Science & Engineering (AI/ML)</p></div><div className="education-meta"><strong>8.85<span> / 10</span></strong><span>EXPECTED 2029</span></div></div></div>
  </section>
}

function ContactIcon({ children }) { return <span className="contact-icon-shell"><span className="contact-icon-face">{children}</span></span> }

function ContactSection() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText('chinthalanikprasad0201@gmail.com'); setCopied(true); window.setTimeout(() => setCopied(false), 1700) }
    catch { window.location.href = 'mailto:chinthalanikprasad0201@gmail.com' }
  }
  return <section id="contact" className="contact-section section-shell">
    <div className="section-kicker"><span>05 / MAKE CONTACT</span><span className="kicker-line" /></div>
    <div className="contact-layout"><div className="contact-copy"><span className="micro-label">THE LOG POSE POINTS HERE</span><h2>Have a good<br /><em>problem?</em></h2><p>I’m always interested in thoughtful teams, ambitious ideas, and useful things to build.</p><a className="button button-gold" href="mailto:chinthalanikprasad0201@gmail.com">Say hello <ArrowUpRight size={16} /></a></div>
      <div className="contact-links">
        <a className="contact-link" href="https://github.com/NikithPrasad" target="_blank" rel="noreferrer"><ContactIcon><Github size={21} /></ContactIcon><span><small>CODE & PROJECTS</small><strong>GitHub</strong></span><ArrowUpRight size={16} /></a>
        <button className="contact-link" onClick={copyEmail}><ContactIcon>{copied ? <Check size={20} /> : <Mail size={20} />}</ContactIcon><span><small>{copied ? 'COPIED TO CLIPBOARD' : 'CLICK TO COPY'}</small><strong>chinthalanikprasad0201@gmail.com</strong></span>{copied ? <Check size={16} /> : <ArrowUpRight size={16} />}</button>
        <a className="contact-link" href="/resume.pdf" target="_blank" rel="noreferrer"><ContactIcon><BriefcaseBusiness size={19} /></ContactIcon><span><small>ONE-PAGE OVERVIEW</small><strong>Resume PDF</strong></span><ArrowUpRight size={16} /></a>
      </div>
    </div>
    <footer className="site-footer"><a className="footer-mark" href="#top">NP<span>·</span></a><span>DESIGNED WITH INTENTION · BUILT IN HYDERABAD</span><a href="#top">BACK TO TOP ↑</a><span>© 2026 NIKITH PRASAD</span></footer>
  </section>
}

export default function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main">
      <Hero />
      <MetricsStrip />
      <WorkSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </main>
  </>
}
