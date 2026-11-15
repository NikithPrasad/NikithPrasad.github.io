import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit,
  BriefcaseBusiness, Check, Code2, Database,
  Github, Mail, Menu, MousePointer2, ScanLine, X,
} from 'lucide-react'

const projects = [
  {
    id: 'queuewatch', number: '01', name: 'QueueWatch', type: 'COMPUTER VISION · REAL-TIME ANALYTICS',
    quickMetric: '12.68 FPS',
    color: '#f5c451', image: '/assets/queuewatch.gif', imageAlt: 'QueueWatch people detection, line crossing and zone analytics demo',
    repo: 'https://github.com/NikithPrasad/QueueWatch',
    summary: 'From video frames to useful footfall signals.',
    description: 'A people-flow analytics pipeline using YOLO11 detections and ByteTrack identities. Finite-line crossing counts, editable direction names, zone occupancy, dwell estimates, and a footfall heatmap are available for uploaded clips and live sources.',
    metrics: [['13.53%', 'sMAPE'], ['1.625', 'MAE'], ['12.68', 'FPS'], ['11', 'tests']],
    flow: ['Video / webcam', 'YOLO11 detections', 'ByteTrack IDs', 'Crossing + dwell'],
    stack: ['Python', 'YOLO11', 'ByteTrack', 'OpenCV', 'Streamlit'],
  },
  {
    id: 'scholarpath', number: '02', name: 'ScholarPath', type: 'AI SYSTEMS · INFORMATION RETRIEVAL',
    quickMetric: '.954 MRR@5',
    color: '#38bdf8', image: '/assets/scholarpath.png', imageAlt: 'ScholarPath scholarship question answering dashboard',
    repo: 'https://github.com/NikithPrasad/ScholarPath',
    summary: 'A local-first scholarship navigator that can show its work.',
    description: 'A citation-grounded assistant over official scholarship guidance. BM25 and TF-IDF feed a Reciprocal Rank Fusion pipeline; the app cites the passages behind each answer, abstains when the evidence is weak, and can optionally use a local Ollama model.',
    metrics: [['0.954', 'Source MRR@5'], ['0.931', 'Chunk Hit@3'], ['1.00', 'OOD abstention'], ['11', 'tests']],
    flow: ['Official scheme docs', 'BM25 + TF-IDF', 'RRF ranking', 'Cited answer'],
    stack: ['Python', 'Streamlit', 'BM25', 'scikit-learn', 'Ollama'],
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

const mapBearing = (x, y) => (Math.round((Math.atan2((x - 50) * 16, (50 - y) * 9) * 180) / Math.PI) + 360) % 360

const chartStops = [
  { x: 46, y: 52, island: 'Sabaody Archipelago', region: 'GRAND LINE · SABAODY', labelX: 43, labelY: 55, anchor: 'end', size: 1.22 },
  { x: 31, y: 73, island: 'Ohara', region: 'WEST BLUE · OHARA', labelX: 34, labelY: 70, anchor: 'start', size: 1.08 },
  { x: 31, y: 48, island: 'Water 7', region: 'GRAND LINE · PARADISE', labelX: 28, labelY: 45, anchor: 'end', size: 1.13 },
  { x: 41, y: 37, island: 'Drum Island', region: 'GRAND LINE · PARADISE', labelX: 39, labelY: 34, anchor: 'end', size: 1.03 },
  { x: 81, y: 51, island: 'Egghead', region: 'GRAND LINE · NEW WORLD', labelX: 77, labelY: 48, anchor: 'end', size: 1.18 },
  { x: 31, y: 60, island: 'Alabasta', region: 'GRAND LINE · PARADISE', labelX: 34, labelY: 63, anchor: 'start', size: 1.28 },
]

const unchartedStops = [
  { id: 'skypiea', island: 'SKYPIEA', x: 37, y: 23, size: .9, labelX: 39, labelY: 21, anchor: 'start' },
  { id: 'fishman', island: 'FISH-MAN ISLAND', x: 56, y: 65, size: 1.04, labelX: 59, labelY: 68, anchor: 'start' },
  { id: 'wano', island: 'WANO', x: 82, y: 31, size: 1.12, labelX: 79, labelY: 29, anchor: 'end' },
]

const grandLinePath = 'M 3 50 C 20 49.7 34 50.3 50 50 S 80 49.7 97 50'

const navItems = [
  ['work', 'WORK'], ['experience', 'EXPERIENCE'], ['skills', 'SKILLS'], ['contact', 'CONTACT'],
]

function useActiveSection() {
  const [active, setActive] = useState('work')
  useEffect(() => {
    const sections = navItems.map(([id]) => document.getElementById(id)).filter(Boolean)
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3
        if (atPageEnd) {
          setActive(sections.at(-1)?.id || 'contact')
          return
        }
        const readingLine = window.innerHeight * 0.34
        let current = sections[0]
        sections.forEach((section) => {
          if (section.getBoundingClientRect().top <= readingLine) current = section
        })
        if (current) setActive(current.id)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return active
}

function Header() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <a className="monogram" href="#top" aria-label="Nikith Prasad, back to top" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}><span>N</span><i>P</i><b /></a>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav className={`nav-pill ${open ? 'nav-open' : ''}`} aria-label="Main navigation" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        {navItems.map(([id, label]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="nav-resume" href="/resume.pdf" target="_blank" rel="noreferrer">RESUME <ArrowUpRight size={12} /></a>
      </nav>
    </header>
  )
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
      <p className="hero-intro">I turn curious questions into useful software — from retrieval systems and vision models to data pipelines and full-stack tools. After 10+ years of gaming, I’m still curious about the mechanics that make a world feel intuitive.</p>
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
    { value: 124, display: '124+', label: 'AUTOMATED TESTS' },
    { value: .954, display: '0.954', label: 'RAG SOURCE MRR@5' },
    { value: .937, display: '0.937', label: 'SKIN MACRO AUC' },
    { value: 12.68, display: '12.68', label: 'TRACKING FPS' },
  ]
  const [seen, setSeen] = useState(false)
  const [progress, setProgress] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setSeen(true) }, { threshold: .25 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!seen) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setProgress(1); return undefined }
    let frame; let start
    const tick = (time) => {
      if (!start) start = time
      const next = Math.min((time - start) / 1000, 1)
      if (next >= 1) {
        setProgress(1)
        return
      }
      setProgress(1 - (1 - next) ** 3)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seen])
  const formatted = (item) => {
    if (progress >= 1) return item.display
    const value = item.value * progress
    if (item.value === 6) return String(Math.round(value)).padStart(2, '0')
    if (item.value === 124) return `${Math.round(value)}+`
    if (item.value < 1) return value.toFixed(3)
    return value.toFixed(2)
  }
  return <div className="metrics-strip" ref={ref}>{metrics.map((item, i) => <div className="metric" key={item.label} style={{ '--delay': `${i * 90}ms` }}><strong className={seen ? 'metric-seen' : ''}>{formatted(item)}</strong><span>{item.label}</span></div>)}</div>
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
  const projectIndex = projects.findIndex((item) => item.id === project.id)
  const stop = chartStops[projectIndex]
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close" onClick={onClose} aria-label="Close project details"><X size={19} /></button>
      <div className="modal-scroll">
        <div className="modal-kicker" style={{ color: project.color }}>DECIPHERED LOG <span>·</span> COORD {project.number} / 06 · {stop.region} <span>·</span> {project.type}</div>
        <h2 id="modal-title">{project.name}<span style={{ color: project.color }}>.</span></h2>
        <p className="modal-summary">{project.description}</p>
        <a className="modal-repo" href={project.repo} target="_blank" rel="noreferrer"><Github size={17} /> Explore source on GitHub <ArrowUpRight size={15} /></a>
        <div className="modal-image-frame"><img src={project.image} alt={project.imageAlt} /></div>
        <div className="modal-section-label">FIELD NOTES <span>MEASURED RESULTS</span></div>
        <div className="modal-metrics">{project.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        <div className="modal-section-label">CHARTED SYSTEM ROUTE <span>HIGH LEVEL</span></div>
        <div className="architecture-flow">{project.flow.map((step, index) => <div className="flow-step" key={step}><span>{String(index + 1).padStart(2, '0')}</span><b>{step}</b>{index < project.flow.length - 1 && <ArrowRight size={15} />}</div>)}</div>
        <div className="tech-tags">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
      </div>
    </section>
  </div>
}

function WorkSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mapZoomed, setMapZoomed] = useState(true)
  const [selected, setSelected] = useState(null)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [cameraViewBox, setCameraViewBox] = useState({ x: 0, y: 0, width: 1600, height: 900 })
  const [decodeLabel, setDecodeLabel] = useState('DECIPHERING RIO PONEGLYPH 01...')
  const markers = useRef([])
  const stageRef = useRef(null)
  const pinnedRef = useRef(null)
  const navigationTarget = useRef(null)
  const navigationTimer = useRef(0)
  const decodeRun = useRef(0)
  const cameraRef = useRef({ x: 0, y: 0, width: 1600, height: 900 })
  const active = projects[activeIndex]
  const stop = chartStops[activeIndex]
  const bearing = mapBearing(stop.x, stop.y)
  useEffect(() => {
    const preloaded = projects.map((project) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = project.image
      return image
    })
    return () => preloaded.forEach((image) => { image.onload = null; image.onerror = null })
  }, [])
  useEffect(() => () => window.clearTimeout(navigationTimer.current), [])
  useEffect(() => {
    const element = pinnedRef.current
    if (!element) return undefined
    const updateViewport = () => setViewport({ width: element.clientWidth, height: element.clientHeight })
    updateViewport()
    const observer = new ResizeObserver(updateViewport)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!viewport.width) return undefined
    const zoom = mapZoomed ? 1.35 : 1
    const target = mapZoomed
      ? {
          width: 1600 / zoom,
          height: 900 / zoom,
          x: stop.x * 16 - (1600 / zoom) * .7,
          y: stop.y * 9 - (900 / zoom) * .5,
        }
      : { x: 0, y: 0, width: 1600, height: 900 }
    const from = cameraRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cameraRef.current = target
      setCameraViewBox(target)
      return undefined
    }
    const startAt = performance.now()
    let frame = 0
    const animate = (now) => {
      const progress = Math.min((now - startAt) / 480, 1)
      const eased = 1 - (1 - progress) ** 3
      const current = {
        x: from.x + (target.x - from.x) * eased,
        y: from.y + (target.y - from.y) * eased,
        width: from.width + (target.width - from.width) * eased,
        height: from.height + (target.height - from.height) * eased,
      }
      cameraRef.current = current
      setCameraViewBox(current)
      if (progress < 1) frame = window.requestAnimationFrame(animate)
    }
    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [activeIndex, mapZoomed, stop, viewport.width])
  useEffect(() => {
    const target = active.name.toUpperCase()
    const run = decodeRun.current + 1
    decodeRun.current = run
    setDecodeLabel(`DECIPHERING RIO PONEGLYPH ${active.number}...`)
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
    const startAt = performance.now()
    let frame = 0
    const settleTimer = window.setTimeout(() => {
      if (decodeRun.current === run) setDecodeLabel(target)
    }, 320)
    const decode = (now) => {
      if (decodeRun.current !== run) return
      const progress = Math.min((now - startAt) / 250, 1)
      if (progress >= 1) {
        setDecodeLabel(target)
        return
      }
      const revealed = Math.floor(progress * target.length)
      const scrambled = Array.from(target.slice(revealed), (character) => character === ' ' ? ' ' : alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
      setDecodeLabel(`${target.slice(0, revealed)}${scrambled}`)
      frame = window.requestAnimationFrame(decode)
    }
    frame = window.requestAnimationFrame(decode)
    return () => {
      decodeRun.current += 1
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
    }
  }, [activeIndex, active.name, active.number])
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nextIndex = Number(entry.target.dataset.index)
          if (navigationTarget.current !== null && nextIndex !== navigationTarget.current) return
          if (navigationTarget.current === nextIndex) {
            navigationTarget.current = null
            window.clearTimeout(navigationTimer.current)
          }
          setActiveIndex(nextIndex)
          setMapZoomed(true)
        }
      })
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 })
    markers.current.forEach((marker) => marker && observer.observe(marker))
    return () => observer.disconnect()
  }, [])
  const goTo = (index) => {
    window.clearTimeout(navigationTimer.current)
    navigationTarget.current = index
    setMapZoomed(true)
    setActiveIndex(index)
    markers.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    navigationTimer.current = window.setTimeout(() => { navigationTarget.current = null }, 1600)
  }
  const handleBeaconKey = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goTo(index)
    }
  }
  return <section id="work" className="work-section">
    <div className="section-shell work-intro"><div><div className="section-kicker"><span>01 / THE WORK</span><span className="kicker-line" /></div><h2>The Rio Poneglyphs.<br /><em>Chart the Grand Line.</em></h2></div><p>Decipher a beacon to land on a build. Six coordinates, six systems, and a trail of measured work.</p></div>
    <div className="work-stage" ref={stageRef}>
      <div className="work-pinned" ref={pinnedRef}>
        <div className="sea-chart-layer" aria-hidden="true">
          <div className="sea-chart-pan">
            <svg className={`sea-chart-svg ${mapZoomed ? 'map-zoomed' : 'map-full'}`} viewBox={`${cameraViewBox.x} ${cameraViewBox.y} ${cameraViewBox.width} ${cameraViewBox.height}`} preserveAspectRatio="none" shapeRendering="geometricPrecision" aria-hidden="true">
              <defs>
                <linearGradient id="ocean-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#050a14" /><stop offset="1" stopColor="#0a1628" /></linearGradient>
                <pattern id="chart-grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeOpacity=".62" strokeWidth=".07" /></pattern>
                <pattern id="redline-strata" width="2.5" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><path d="M 0 0 H 2.5" fill="none" stroke="#e63946" strokeOpacity=".24" strokeWidth=".11" /></pattern>
                <linearGradient id="red-line-fill" x1="0" x2="1"><stop offset="0" stopColor="#5b171d" /><stop offset=".5" stopColor="#7f1d1d" /><stop offset="1" stopColor="#5a171e" /></linearGradient>
                <radialGradient id="chart-vignette"><stop offset="0" stopColor="#050a14" stopOpacity=".02" /><stop offset="1" stopColor="#050a14" stopOpacity=".6" /></radialGradient>
              </defs>
              <g transform="scale(16 9)">
              <rect width="100" height="100" fill="url(#ocean-fill)" />
              <rect width="100" height="100" fill="url(#chart-grid)" />
              <rect width="100" height="100" fill="url(#chart-vignette)" />
              {[10, 30, 50, 70, 90].map((tick) => <g className="chart-tick" key={tick}><path d={`M ${tick} 0 v 1.2 M 0 ${tick} h 1.2`} /><text x={tick - 1.5} y="2.8">{String(tick).padStart(2, '0')}</text><text x="1.7" y={tick + .4}>{String(tick).padStart(2, '0')}</text></g>)}
              <path className="chart-redline-land" d="M 50 -3 C 54 7 49 17 52 27 C 55 38 49 43 52 50 C 55 59 50 66 53 77 C 56 88 50 95 53 103 L 56 103 C 53 92 59 84 56 75 C 53 65 59 58 56 49 C 53 40 59 33 56 25 C 53 15 59 7 55 -3 Z" />
              <path className="chart-redline-texture" d="M 50 -3 C 54 7 49 17 52 27 C 55 38 49 43 52 50 C 55 59 50 66 53 77 C 56 88 50 95 53 103 L 56 103 C 53 92 59 84 56 75 C 53 65 59 58 56 49 C 53 40 59 33 56 25 C 53 15 59 7 55 -3 Z" />
              <path className="chart-redline-ridge" d="M 52 -2 C 56 8 51 17 54 27 S 51 42 54 50 S 51 65 55 77 S 52 92 54 102" />
              <path className="chart-calm-belt" d="M 3 42.5 C 24 42.3 39 42.7 51 42.5 S 78 42.3 97 42.5 M 3 57.5 C 24 57.7 39 57.3 51 57.5 S 78 57.7 97 57.5" />
              <path className="chart-grand-line" d={grandLinePath} />
              <path className="chart-grand-line-core" d={grandLinePath} />
              <text className="chart-calm-label" x="4" y="41.1">CALM BELT</text>
              <text className="chart-calm-label" x="4" y="59.6">CALM BELT</text>
              <text className="chart-blue-label" x="10" y="17">NORTH BLUE</text>
              <text className="chart-blue-label" x="77" y="17">EAST BLUE</text>
              <text className="chart-blue-label" x="10" y="86">WEST BLUE</text>
              <text className="chart-blue-label" x="77" y="86">SOUTH BLUE</text>
              <text className="chart-grand-label" x="20" y="49">PARADISE</text>
              <text className="chart-grand-label" x="72" y="45">NEW WORLD</text>
              <g className="map-landmark reverse-mountain" transform="translate(53 42.5)">
                <path d="M -1.35 .7 L -.45 -.65 L .05 .15 L .65 -1.05 L 1.45 .7 Z" />
                <text x="1.8" y="-.5">REVERSE MOUNTAIN</text>
              </g>
              <g className="map-landmark mary-geoise" transform="translate(56 47.1)">
                <path d="M 0 -.65 L .65 0 0 .65 -.65 0 Z" />
                <text x="1.4" y=".25">MARY GEOISE</text>
              </g>
              <text className="chart-heading-label" x="4" y="7">GRAND LINE / WORLD NAVIGATION CHART</text>
              <text className="chart-coordinate-label" x="4" y="96">NORTH IS UP · ROUTES NOT TO SCALE</text>
              {projects.map((project, index) => {
                const point = chartStops[index]
                return <g className="chart-island" key={project.id} style={{ '--beacon-color': project.color }}>
                  <g transform={`translate(${point.x} ${point.y}) scale(${point.size})`}>
                    {index === 0 && <g className="archipelago-shapes"><path d="M -2.45 -.1 C -2.2 -.95 -1.2 -1.1 -.65 -.35 C -.25 .15 -.75 .95 -1.55 .8 C -2.2 .72 -2.7 .48 -2.45 -.1 Z" /><path d="M -.25 -.72 C .15 -1.55 1.13 -1.42 1.34 -.7 C 1.55 .05 .85 .57 .22 .28 C -.15 .12 -.52 -.2 -.25 -.72 Z" /><path d="M 1.2 .6 C 1.58 .1 2.25 .42 2.34 .95 C 2.4 1.42 1.78 1.62 1.38 1.28 C 1.1 1.05 1.02 .83 1.2 .6 Z" /></g>}
                    {index !== 0 && <path className="island-silhouette" d="M -2.55 -.15 C -2.2 -1.03 -1.38 -.92 -1.02 -1.46 C -.38 -1.8 .05 -1.12 .58 -1.24 C 1.15 -1.48 2.22 -.89 2.06 -.1 C 2.64 .54 1.82 1.37 1.18 1.12 C .53 1.61 -.04 1.03 -.64 1.4 C -1.24 1.72 -2.35 1.1 -2.08 .48 C -2.62 .32 -2.83 .08 -2.55 -.15 Z" />}
                    <path className="island-topography" d="M -1.72 -.14 C -1.38 -.78 -.76 -.78 -.39 -.39 C .07 -.95 .98 -.63 1.09 -.07 C 1.54 .44 .75 .88 .28 .59 C -.24 1.05 -.81 .58 -1.15 .75 C -1.58 .58 -1.89 .25 -1.72 -.14 Z" />
                    <path className="island-topography inner" d="M -.92 -.05 C -.52 -.47 .1 -.42 .32 -.06 C .67 .24 .05 .52 -.31 .31 C -.7 .54 -1.02 .24 -.92 -.05 Z" />
                    <path className="poneglyph-mark" d="M 0 -.56 L .5 0 0 .56 -.5 0 Z" />
                  </g>
                </g>
              })}
              {projects.map((project, index) => {
                const point = chartStops[index]
                const style = { '--beacon-color': project.color }
                return <g className="map-full-label" key={`full-${project.id}`} style={style}>
                  <path d={`M ${point.x} ${point.y} L ${point.labelX} ${point.labelY + .45}`} />
                  <text className="map-label-project" x={point.labelX} y={point.labelY} textAnchor={point.anchor}>{project.number} // {project.name.toUpperCase()}</text>
                  <text className="map-label-island" x={point.labelX} y={point.labelY + 1.2} textAnchor={point.anchor}>{point.island.toUpperCase()}</text>
                </g>
              })}
              {projects.map((project, index) => {
                const point = chartStops[index]
                const side = point.x > 75 ? -1 : 1
                return <g className={`map-zoom-label ${index === activeIndex ? 'is-current' : ''}`} key={`zoom-${project.id}`} style={{ '--beacon-color': project.color }}>
                  <path d={`M ${point.x} ${point.y} L ${point.x + side * 2.8} ${point.y - 1.5}`} />
                  <text className="map-label-project" x={point.x + side * 3.1} y={point.y - 1.4} textAnchor={side < 0 ? 'end' : 'start'}>{project.number} // {project.name.toUpperCase()}</text>
                  <text className="map-label-island" x={point.x + side * 3.1} y={point.y - .25} textAnchor={side < 0 ? 'end' : 'start'}>{point.island.toUpperCase()}</text>
                </g>
              })}
              {unchartedStops.map((place) => <g className="chart-uncharted" key={place.id}>
                <g transform={`translate(${place.x} ${place.y}) scale(${place.size})`}>
                  <path className="uncharted-island-shape" d="M -2.2 -.2 C -1.68 -1.24 -.86 -1.08 -.46 -1.4 C .22 -1.72 .37 -.8 1.1 -.8 C 1.93 -.52 2.22 .2 1.55 .78 C 1.01 1.41 .12 .88 -.38 1.32 C -1.13 1.54 -2.11 .83 -1.72 .27 C -2.35 .22 -2.54 .05 -2.2 -.2 Z" />
                  <path className="uncharted-contour" d="M -1.24 -.13 C -.8 -.76 -.04 -.62 .28 -.24 C .9 -.43 1.24 .19 .73 .56 C .15 .81 -.44 .33 -1 .5 Z" />
                  <path className="uncharted-mark" d="M 0 -.48 L .43 0 0 .48 -.43 0 Z" />
                </g>
                <path d={`M ${place.x} ${place.y} L ${place.labelX} ${place.labelY + .4}`} />
                <text className="uncharted-title" x={place.labelX} y={place.labelY} textAnchor={place.anchor}>VOID CENTURY // UNCHARTED</text>
                <text className="uncharted-island-name" x={place.labelX} y={place.labelY + 1.1} textAnchor={place.anchor}>{place.island}</text>
              </g>)}
              </g>
            </svg>
          </div>
        </div>
        <div className="chart-hotspots" role="group" aria-label="Select a Poneglyph on the sea chart">
          {projects.map((project, index) => {
            const point = chartStops[index]
            const left = (point.x * 16 - cameraViewBox.x) / cameraViewBox.width * 100
            const top = (point.y * 9 - cameraViewBox.y) / cameraViewBox.height * 100
            return <button key={project.id} type="button" className={`chart-hotspot ${index === activeIndex ? 'is-active' : ''}`} style={{ left: `${left}%`, top: `${top}%`, '--beacon-color': project.color }} aria-label={`Zoom to ${project.number}, ${project.name}`} aria-current={index === activeIndex ? 'location' : undefined} onClick={() => goTo(index)} onKeyDown={(event) => handleBeaconKey(event, index)}>
              <span className="chart-hotspot-dot" /><span className="chart-hotspot-tooltip" data-edge={point.x > 76 ? 'left' : 'right'}>{project.number} // {project.name.toUpperCase()} · {point.island.toUpperCase()}</span>
            </button>
          })}
        </div>
        <div className="chart-ui">
          <button type="button" className="full-map-button" aria-pressed={!mapZoomed} aria-label={mapZoomed ? 'Show full sea chart' : 'Return to selected location'} onClick={() => setMapZoomed(!mapZoomed)}>{mapZoomed ? 'FULL MAP' : 'RETURN TO LOCATION'} <span>↗</span></button>
          <div className="chart-jumpbar" aria-label="Jump to a Poneglyph">{projects.map((project, index) => <button key={project.id} type="button" className={index === activeIndex ? 'is-active' : ''} style={{ '--beacon-color': project.color }} aria-label={`Jump to ${project.name}`} aria-current={index === activeIndex ? 'step' : undefined} onClick={() => goTo(index)}>{project.number}</button>)}</div>
          <div className="chart-bearing" aria-label={`Log Pose bearing from chart center to ${stop.island}: ${bearing} degrees`}><span>LOG POSE</span><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="39" /><path className="bearing-needle" style={{ transform: `rotate(${bearing}deg)` }} d="M50 14 L56 56 L50 50 L44 56 Z" /><circle cx="50" cy="50" r="4" /></svg><b>{String(bearing).padStart(3, '0')}°</b></div>
        </div>
        {mapZoomed && <>
        <div className="work-index" aria-hidden="true">{active.number}</div>
        <div className="work-card" key={active.id} style={{ '--project-accent': active.color, '--arrival-x': activeIndex % 2 ? '-12px' : '12px' }}>
          <div className="work-card-top"><span>{active.number} <i /> DECIPHERED COORDINATE</span><a href={active.repo} target="_blank" rel="noreferrer" aria-label={`Open ${active.name} on GitHub`}><ArrowUpRight size={18} /></a></div>
          <div className="work-card-body">
            <div className="work-visual">{projects.map((project, index) => <img className={`project-image-layer ${project.id === 'commerceflow' ? 'object-contain' : ''} ${index === activeIndex ? 'is-active' : ''}`} key={project.id} src={project.image} alt={index === activeIndex ? project.imageAlt : ''} aria-hidden={index !== activeIndex} loading="eager" decoding="async" />)}<div className="visual-overlay" /><span className="visual-coordinate">FIG. {active.number} — FIELD RECORD</span></div>
            <div className="work-content" key={active.id} style={{ '--copy-shift': activeIndex % 2 ? '-10px' : '10px' }}><span className="project-type" aria-live="polite">{decodeLabel}</span><h3>{active.name}<span>.</span></h3><p className="work-summary">{active.summary}</p>
              <div className="work-metrics">{active.metrics.slice(0, 3).map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
              <div className="work-card-bottom"><button className="details-button" onClick={() => setSelected(active)}>Details <ArrowUpRight size={14} /></button><span className="work-stack">{active.stack.slice(0, 3).join(' · ')}</span></div>
            </div>
          </div>
          <div className="work-card-base"><span>CHARTED IN HYDERABAD</span><span>{stop.region} / {active.number}</span></div>
        </div>
        </>}
      </div>
      <div className="work-markers" aria-hidden="true">{projects.map((project, index) => <div className="work-marker" data-index={index} key={project.id} ref={(element) => { markers.current[index] = element }}><span>{project.number}</span><span>{project.name}</span></div>)}</div>
    </div>
    <ProjectModal project={selected} onClose={() => setSelected(null)} />
  </section>
}

function OceanCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = 0; let height = 0; let frame = 0; let particles = []; let lastTime = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width; height = rect.height; canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from({ length: Math.max(140, Math.min(320, Math.floor(width / 4))) }, () => ({
        angle: Math.random() * Math.PI * 2,
        depth: Math.random(),
        speed: .1 + Math.random() * .24,
        spin: (Math.random() - .5) * .07,
        size: .35 + Math.random() * 1.15,
        gold: Math.random() > .55,
      }))
    }
    const draw = (time = 0) => {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0
      lastTime = time
      ctx.clearRect(0, 0, width, height)
      const cx = width * .52; const cy = height * .5
      const radius = Math.hypot(width, height) * .62
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * .8)
      glow.addColorStop(0, 'rgba(56,189,248,.055)')
      glow.addColorStop(.45, 'rgba(245,196,81,.018)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      particles.forEach((p) => {
        p.depth += delta * p.speed
        p.angle += delta * p.spin
        if (p.depth >= 1) {
          p.depth = .018 + Math.random() * .08
          p.angle = Math.random() * Math.PI * 2
          p.gold = Math.random() > .55
        }
        const tail = Math.max(.01, p.depth - (.02 + p.depth * .055))
        const headRadius = p.depth * radius
        const tailRadius = tail * radius
        const x = cx + Math.cos(p.angle) * headRadius
        const y = cy + Math.sin(p.angle) * headRadius * .58
        const tx = cx + Math.cos(p.angle) * tailRadius
        const ty = cy + Math.sin(p.angle) * tailRadius * .58
        const alpha = .04 + p.depth * p.depth * .24
        const tint = p.gold ? '245,196,81' : '56,189,248'
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(x, y)
        ctx.strokeStyle = `rgba(${tint},${alpha})`
        ctx.lineWidth = p.size * (.3 + p.depth)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x, y, p.size * (.35 + p.depth * .55), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${tint},${Math.min(alpha * 1.8, .42)})`
        ctx.fill()
      })
      ctx.globalCompositeOperation = 'source-over'
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
    <div className="education-row">
      <div className="education-label"><span>04 / THE FOUNDATION</span><span className="kicker-line" /></div>
      <div className="education-list">
        <div className="education-detail"><div><h3>VNR Vignana Jyothi Institute of Engineering and Technology</h3><p>B.Tech CSE (AI &amp; ML) · Hyderabad</p></div><div className="education-meta"><strong>8.85<span> / 10</span></strong><span>EXPECTED 2029</span></div></div>
        <div className="education-detail"><div><h3>Vinjee Junior College</h3><p>Intermediate (Class XII Boards) · Hyderabad</p></div><div className="education-meta"><strong>97.7%</strong><span>CLASS XII</span></div></div>
        <div className="education-detail"><div><h3>The Hyderabad Public School (HPS), Begumpet</h3><p>Class X</p></div><div className="education-meta"><strong>8.5</strong><span>GRADE</span></div></div>
      </div>
    </div>
  </section>
}

function ContactIcon({ children }) { return <span className="contact-icon-shell"><span className="contact-icon-face">{children}</span></span> }

function ContactSection() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText('chinthalanikithprasad0201@gmail.com'); setCopied(true); window.setTimeout(() => setCopied(false), 1700) }
    catch { window.location.href = 'mailto:chinthalanikithprasad0201@gmail.com' }
  }
  return <section id="contact" className="contact-section section-shell">
    <div className="section-kicker"><span>05 / MAKE CONTACT</span><span className="kicker-line" /></div>
    <div className="contact-layout"><div className="contact-copy"><span className="micro-label">THE LOG POSE POINTS HERE</span><h2>Have a good<br /><em>problem?</em></h2><p>I’m always interested in thoughtful teams, ambitious ideas, and useful things to build.</p><a className="button button-gold" href="mailto:chinthalanikithprasad0201@gmail.com">Say hello <ArrowUpRight size={16} /></a></div>
      <div className="contact-links">
        <a className="contact-link" href="https://github.com/NikithPrasad" target="_blank" rel="noreferrer"><ContactIcon><Github size={21} /></ContactIcon><span><small>CODE & PROJECTS</small><strong>GitHub</strong></span><ArrowUpRight size={16} /></a>
        <button className="contact-link" onClick={copyEmail}><ContactIcon>{copied ? <Check size={20} /> : <Mail size={20} />}</ContactIcon><span><small>{copied ? 'COPIED TO CLIPBOARD' : 'CLICK TO COPY'}</small><strong>chinthalanikithprasad0201@gmail.com</strong></span>{copied ? <Check size={16} /> : <ArrowUpRight size={16} />}</button>
        <a className="contact-link" href="/resume.pdf" target="_blank" rel="noreferrer"><ContactIcon><BriefcaseBusiness size={19} /></ContactIcon><span><small>ONE-PAGE OVERVIEW</small><strong>Resume PDF</strong></span><ArrowUpRight size={16} /></a>
      </div>
    </div>
    <footer className="site-footer"><a className="footer-mark" href="#top">NP<span>·</span></a><span>DESIGNED WITH INTENTION · BUILT IN HYDERABAD</span><a href="#top">BACK TO TOP ↑</a><span>© 2026 NIKITH PRASAD</span></footer>
  </section>
}

export default function App() {
  useLayoutEffect(() => {
    if (window.location.hash !== '#top') return undefined
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const forceTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    forceTop()
    let frame = window.requestAnimationFrame(() => {
      forceTop()
      frame = window.requestAnimationFrame(forceTop)
    })
    return () => {
      window.cancelAnimationFrame(frame)
      window.history.scrollRestoration = previousRestoration
    }
  }, [])
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
