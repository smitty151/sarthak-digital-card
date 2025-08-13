'use client'

/**
 * Main page component for Sarthak's digital contacts & resume site.
 * This version includes:
 * - Mobile-friendly QR (Card) section: centered on small screens, consistent sizing
 * - Mobile hamburger menu
 * - "Share" renamed to "Card"
 * - Download vCard moved to Card section (header button removed)
 * - Skill pills: dark grey in light, deep blue in dark
 * - Buttons expect green-accent .btn-primary from globals.css
 */

import { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode'
import {
  Mail, MapPin, Linkedin, Calendar, Copy, ChevronDown, ChevronUp,
  Sun, Moon, Briefcase, Layers, BarChart2, FileText, BookOpen,
  Download, QrCode, Menu
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Custom content data
const content = {
  name: 'Sarthak Mittal',
  title: 'Strategy, Deals & Transformation | PE, VC, Consulting',
  location: 'Bengaluru, India',
  email: 'mittal.sart@gmail.com',
  phone: '+91 8073877696',
  linkedin: 'https://www.linkedin.com/in/sarthakmittal115/',
  calendly: 'https://calendly.com/mittal-sart/30min',
  resumePdfUrl: '/resume.pdf',
  coverLetterPdfUrl: '/cover-letter.pdf',
  photo: '/images/portrait_pro.webp',
  photoAlt: 'Sarthak Mittal professional portrait',
  aboutBio: `I build value at the intersection of investing and execution. My background spans PwC Deals (transaction diligence), Nitya Capital (acquisitions & portfolio value creation), and a founder-operator stint at OurEarth BioPlastics. I like translating models into operating rhythms—clear KPIs, decision cadences, and accountability—so the plan actually happens. Sector experience includes real assets and consumer/industrial adjacencies; comfort with analytics (Python/SQL/BI) helps me pressure‑test assumptions and make performance visible.`,
  quickStats: [
    { title: 'Years of Experience', value: '7+' },
    { title: 'Deals Closed', value: '15+' },
    { title: 'Capital Deployed', value: '$1.6 billion+' },
  ],
  skills: {
    'Finance & Deals': [
      { name: 'Financial Modeling', description: 'Advanced financial projections and valuation.' },
      { name: 'Valuation', description: 'DCF, LBO, NAV, Waterfall' },
      { name: 'Synergy Modeling', description: 'Assessing and modeling post-merger synergies.' },
      { name: 'Due Diligence', description: 'CDD/ODD/IDD' },
      { name: 'Portfolio/Asset Management', description: 'Optimizing and managing asset portfolios.' },
      { name: 'PMO/IMO/SMO', description: 'Program, Integration, and Separation Management Office.' },
    ],
    'Analytics & BI': [
      { name: 'Advanced Excel & VBA', description: 'Complex data analysis and automation.' },
      { name: 'Tableau', description: 'Data visualization and dashboard design.' },
      { name: 'SQL', description: 'Querying and managing relational databases.' },
      { name: 'Data Modeling', description: 'Designing efficient database structures.' },
    ],
    'Programming': [
      { name: 'Python', description: 'Familiarity for analysis and automation.' },
      { name: 'R', description: 'Working knowledge for statistical analysis.' },
      { name: 'Java/C++', description: 'Foundational programming knowledge.' },
    ],
    'Data/Systems': [
      { name: 'Bloomberg', description: 'Terminal for market data and analysis.' },
      { name: 'FactSet', description: 'Data and analytics for financial professionals.' },
      { name: 'SAP', description: 'Enterprise resource planning software.' },
      { name: 'Data Management & Governance', description: 'Ensuring data quality and integrity.' },
    ],
    'Strategy & Execution': [
      { name: 'Operating Model & TOM', description: 'Designing Target Operating Models.' },
      { name: 'KPI Trees & Benefits Tracking', description: 'Defining and tracking key performance indicators.' },
      { name: 'Program/Project Management', description: 'Leading and overseeing strategic projects.' },
      { name: 'Stakeholder Management', description: 'Engaging with and managing key stakeholders.' },
      { name: 'Agile', description: 'Familiarity with agile methodologies.' },
    ],
    'Communication': [
      { name: 'Executive Storytelling', description: 'Crafting compelling narratives for senior leadership.' },
      { name: 'Memo Writing', description: 'Producing concise and impactful memos.' },
      { name: 'IC Materials', description: 'Preparing materials for investment committees.' },
      { name: 'Client Presentations', description: 'Delivering professional presentations to clients.' },
    ],
  },
  timeline: [
    {
      company: 'PwC',
      role: 'Enterprise & Foundational Strategy',
      duration: '2025-Present',
      description: 'Translate strategy into execution via pilot playbooks, KPI trees, TOM/RACI, and cadence/RAID governance.',
    },
    {
      company: 'PwC',
      role: 'Deals Transformation',
      duration: '2022-2024',
      description: 'Delivered playbooks for diligence, IMOs and SMOs.',
    },
    {
      company: 'Nitya Capital',
      role: 'Acquisitions & Value Creation',
      duration: '2017-2022',
      description: 'Sourced, underwrote, and onboarded acquisitions; led value creation via KPIs and risk-based sampling.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Toast
function Toast({ open, kind = 'success', message }: { open: boolean, kind?: 'success' | 'error', message: string }) {
  if (!open) return null
  const base = 'fixed left-1/2 -translate-x-1/2 bottom-6 z-50 rounded-full px-4 py-2 shadow-lg text-sm transition-opacity duration-300'
  const styles = kind === 'success' ? 'bg-emerald-600 text-white opacity-100' : 'bg-rose-600 text-white opacity-100'
  return <div role="status" aria-live="polite" className={`${base} ${styles}`}>{message}</div>
}

// Section fade-in
const SectionWithAnimation = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// QR Card
function QRCard() {
  const [png, setPng] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const size = 280 // generated size; we scale down on mobile for crispness

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = `${window.location.origin}/api/vcard`
    const opts = { width: size, margin: 2, color: { dark: '#111827', light: '#FFFFFF' } }
    setBusy(true)
    QRCode.toDataURL(url, opts).then(setPng).finally(() => setBusy(false))
  }, [])

  return (
    <div className="rounded-2xl border border-neutral-300 dark:border-neutral-700 p-5 md:p-6 bg-[var(--card)] shadow-sm center-sm">
      <div className="flex items-start gap-6 flex-col sm:flex-row sm:items-center">
        <div className="shrink-0 rounded-xl p-3 bg-white ring-1 ring-neutral-200 shadow-sm">
          {busy || !png ? (
            <div className="h-[220px] w-[220px] md:h-[280px] md:w-[280px] flex items-center justify-center text-sm text-neutral-500">
              Generating…
            </div>
          ) : (
            <img
              src={png}
              alt="QR to add contact"
              className="rounded w-[220px] h-[220px] md:w-[280px] md:h-[280px]"
              width={size}
              height={size}
            />
          )}
        </div>

        <div className="flex-1 sm:min-w-[280px]">
          <h3 className="text-xl font-semibold mb-2">Digital Card</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
            Scan to add my contact to your phone. Works on iOS and Android.
          </p>
          <div className="flex gap-2 justify-center sm:justify-start">
            <a href="/api/vcard" className="btn btn-primary">
              <Download className="h-4 w-4 mr-2" /> Download vCard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
export default function Page() {
  const [copied, setCopied] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastKind, setToastKind] = useState<'success' | 'error'>('success')
  const [toastMsg, setToastMsg] = useState('')
  const [showResume, setShowResume] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') setRedirectUrl(`${window.location.origin}/thanks`)
  }, [])

  const downloadVCard = () => {
    const lines = [
      'BEGIN:VCARD','VERSION:3.0',`N:Mittal;Sarthak;;;`,`FN:${content.name}`,
      content.email ? `EMAIL;TYPE=INTERNET,PREF:${content.email}` : '',
      content.phone ? `TEL;TYPE=CELL:${content.phone}` : '',
      content.calendly ? `URL:${content.calendly}` : '',
      content.linkedin ? `X-SOCIALPROFILE;type=linkedin:${content.linkedin}` : '',
      `ADR;TYPE=WORK:;;${content.location};;;;`,'END:VCARD',
    ].filter(Boolean).join('\\n')
    const a = document.createElement('a')
    a.href = `data:text/vcard;charset=utf-8,${encodeURIComponent(lines)}`
    a.download = `${content.name.replace(/\\s+/g, '-')}.vcf`
    a.click()
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true); setToastKind('success'); setToastMsg('Contact copied!'); setToastOpen(true)
      setTimeout(() => { setCopied(false); setToastOpen(false) }, 2000)
    } catch {
      setToastKind('error'); setToastMsg('Failed to copy contact.'); setToastOpen(true)
      setTimeout(() => setToastOpen(false), 3000)
    }
  }

  // Contact form
  const Form = () => {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || ''
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!endpoint) { setToastKind('error'); setToastMsg('Form submission is not configured.'); setToastOpen(true); return }
      const form = e.currentTarget
      const data = new FormData(form)
      data.set('_subject', 'New message from sarthak-digital-card')
      data.set('_redirect', redirectUrl || '')
      setSubmitting(true); setToastOpen(false)
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        if (res.ok) {
          setToastKind('success'); setToastMsg('Sent! Redirecting…'); setToastOpen(true)
          form.reset(); setTimeout(() => { window.location.href = redirectUrl || '/' }, 800)
        } else { throw new Error(await res.text() || 'Submission failed') }
      } catch {
        setToastKind('error'); setToastMsg('Something went wrong. Please try again.'); setToastOpen(true)
      } finally {
        setSubmitting(false); setTimeout(() => setToastOpen(false), 3000)
      }
    }

    return (
      <form onSubmit={onSubmit} className="space-y-3">
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
        <div className="grid md:grid-cols-2 gap-3">
          <input required name="name" placeholder="Your name" className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]" />
          <input required type="email" name="email" placeholder="Email" className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]" />
        </div>
        <input name="company" placeholder="Company (optional)" className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]" />
        <textarea required name="message" placeholder="Message" rows={5} className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]" />
        <button className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed" aria-disabled={submitting} disabled={submitting}>
          {submitting ? 'Sending…' : 'Send'}
        </button>
      </form>
    )
  }

  // Section wrapper
  const Section = ({ id, title, children, action, icon }:
    { id: string, title: string, children: React.ReactNode, action?: React.ReactNode, icon: React.ReactNode }) => (
    <section id={id} className="scroll-mt-24">
      <SectionWithAnimation>
        <div className="card p-6 md:p-8 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {icon}
              <h2 className="text-2xl md:text-3xl font-semibold font-header">{title}</h2>
            </div>
            {action}
          </div>
          {children}
        </div>
      </SectionWithAnimation>
    </section>
  )

  // PDF Card
  const PdfCard = ({ title, url, expanded, onToggle }:
    { title: string; url: string; expanded: boolean; onToggle: () => void }) => (
    <div className="rounded-2xl border border-neutral-300 dark:border-neutral-700 p-4 md:p-5 bg-[var(--bg)] dark:bg-[var(--bg)] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="text-lg md:text-xl font-semibold font-header">{title}</h3>
        <div className="flex flex-wrap gap-2">
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <Download className="h-4 w-4 mr-2" />Open PDF
          </a>
          <button onClick={onToggle} className="btn btn-primary">
            {expanded ? (<><span className="hidden md:inline">Collapse</span><ChevronUp className="h-4 w-4 md:hidden" /></>)
                      : (<><span className="hidden md:inline">Expand</span><ChevronDown className="h-4 w-4 md:hidden" /></>)}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 pdf-frame">
          <object data={`${url}#page=1&zoom=page-width&toolbar=0&navpanes=0&statusbar=0`}
                  type="application/pdf" className="w-full h-full">
            <p className="p-3">Your browser can’t display the PDF here.
              <a className="link" href={url} target="_blank" rel="noopener noreferrer"> Open it in a new tab.</a>
            </p>
          </object>
        </div>
      )}
    </div>
  )

  // Skill pill
  const SkillPill = ({ name, description }: { name: string, description: string }) => {
    const [isHovered, setIsHovered] = useState(false)
    return (
      <div className="relative">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105
                     bg-neutral-800 text-white hover:bg-neutral-900
                     dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {name}
        </span>
        {isHovered && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-xs bg-gray-800 text-white rounded-lg whitespace-nowrap z-50 shadow-lg">
            {description}
          </div>
        )}
      </div>
    )
  }

  // Skills section
  const SkillsSection = ({ skillsData }:
    { skillsData: Record<string, { name: string; description: string }[]> }) => (
    <div className="space-y-6">
      {Object.keys(skillsData).map(category => (
        <div key={category}>
          <h3 className="text-lg font-bold font-header mb-2 text-[var(--muted)]">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {skillsData[category].map((skill, index) => (
              <SkillPill key={index} name={skill.name} description={skill.description} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg)] text-[var(--ink)]">
      <style>{`
        :root {
          --primary-orange: #f97316;
          --accent-blue: #3b82f6;
          --accent-green: #22c55e;
          --bg-light: #fdf2e9;
          --card-light: #ffffff;
          --ink-light: #1e293b;
          --muted-light: #64748b;
          --ring-light: #f97316;
          --bg-dark: #121212;
          --card-dark: #1f1f1f;
          --ink-dark: #f0f0f0;
          --muted-dark: #a1a1aa;
          --ring-dark: #f97316;
        }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        body { scroll-behavior: smooth; }
        .animated-background { background: linear-gradient(-45deg, var(--accent-blue), var(--accent-green), var(--primary-orange), var(--primary-orange)); background-size: 400% 400%; animation: gradient-shift 15s ease infinite; }
        .card { @apply bg-[var(--card)] shadow-sm; }
      `}</style>

      <Toast open={toastOpen} kind={toastKind} message={toastMsg} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200/70 dark:border-neutral-800/60 backdrop-blur bg-[var(--bg)]/80 dark:bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-bold font-header" style={{ color: 'var(--ink)' }}>{content.name}</div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="hover:text-[var(--accent)] transition-colors">About</a>
            <a href="#experience" className="hover:text-[var(--accent)] transition-colors">Experience</a>
            <a href="#files" className="hover:text-[var(--accent)] transition-colors">Files</a>
            <a href="#contact" className="hover:text-[var(--accent)] transition-colors">Contact</a>
            <a href="#card" className="hover:text-[var(--accent)] transition-colors">Card</a>
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => document.documentElement.classList.toggle('dark')} className="btn btn-ghost p-2">
              <Sun className="h-5 w-5 block dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </button>
            <button onClick={() => setNavOpen(v => !v)} className="md:hidden btn btn-ghost p-2" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {navOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-[var(--bg)]">
            <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-2 text-sm">
              <a href="#about" onClick={() => setNavOpen(false)} className="py-2">About</a>
              <a href="#experience" onClick={() => setNavOpen(false)} className="py-2">Experience</a>
              <a href="#files" onClick={() => setNavOpen(false)} className="py-2">Files</a>
              <a href="#contact" onClick={() => setNavOpen(false)} className="py-2">Contact</a>
              <a href="#card" onClick={() => setNavOpen(false)} className="py-2">Card</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-10 md:pt-14 pb-6 md:pb-10 relative z-10">
        <SectionWithAnimation>
          <div className="card p-6 md:p-8 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 order-2 md:order-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-header" style={{ color: 'var(--ink)' }}>{content.name}</h1>
                <p className="mt-1 font-subheader" style={{ color: 'var(--accent-blue)' }}>{content.title}</p>
                <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'var(--muted)' }}><MapPin className="h-4 w-4" />{content.location}</p>
                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  <a className="btn btn-secondary" href={`mailto:${content.email}`}><Mail className="h-4 w-4 mr-2" />Email</a>
                  <button onClick={() => copyText(`${content.name} – ${content.email}`)} className="btn btn-primary"><Copy className="h-4 w-4 mr-2" />{copied ? 'Copied!' : 'Copy Contact'}</button>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <img src={content.photo} alt={content.photoAlt} className="photo w-full max-w-[520px] h-auto rounded-2xl object-cover border-none" />
              </div>
            </div>
          </div>
        </SectionWithAnimation>
      </div>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 space-y-8 md:space-y-10 pb-16 relative z-10">
        <Section id="about" title="About" icon={<Briefcase className="h-6 w-6 text-[var(--primary-orange)]" />}>
          <p className="leading-relaxed copy">{content.aboutBio}</p>
          <div className="flex gap-2 mt-4">
            <a href={content.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><Linkedin className="h-4 w-4 mr-2" />LinkedIn</a>
            <a href={content.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><Calendar className="h-4 w-4 mr-2" />Schedule</a>
          </div>
        </Section>

        <Section id="quick-stats" title="Quick Stats" icon={<BarChart2 className="h-6 w-6 text-[var(--primary-orange)]" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.quickStats.map((stat, index) => (
              <div key={index} className="bg-neutral-50 dark:bg-[var(--bg)] p-5 rounded-xl shadow-sm hover:scale-[1.05] hover:shadow-lg transition-all duration-300">
                <h3 className="text-3xl font-bold text-[var(--primary-orange)] font-header">{stat.value}</h3>
                <p className="text-sm text-[var(--muted)] mt-1">{stat.title}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience" icon={<Briefcase className="h-6 w-6 text-[var(--primary-orange)]" />}>
          <ExperienceTimeline data={content.timeline} />
        </Section>

        <Section id="skills" title="Skills" icon={<Layers className="h-6 w-6 text-[var(--primary-orange)]" />}>
          <SkillsSection skillsData={content.skills} />
        </Section>

        <Section id="files" title="Files" icon={<FileText className="h-6 w-6 text-[var(--primary-orange)]" />}>
          <div className="space-y-6">
            <PdfCard title="Resume" url={content.resumePdfUrl} expanded={showResume} onToggle={() => setShowResume(v => !v)} />
            <PdfCard title="Cover Letter" url={content.coverLetterPdfUrl} expanded={showLetter} onToggle={() => setShowLetter(v => !v)} />
          </div>
        </Section>

        <Section id="contact" title="Contact" icon={<BookOpen className="h-6 w-6 text-[var(--primary-orange)]" />}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><span className="font-medium" style={{ color: 'var(--ink)' }}>Email:</span> <a className="link" href={`mailto:${content.email}`}>{content.email}</a></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span className="font-medium" style={{ color: 'var(--ink)' }}>Location:</span> {content.location}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-gray-400" /><span className="font-medium" style={{ color: 'var(--ink)' }}>LinkedIn:</span> <a className="link" href={content.linkedin}>View LinkedIn profile</a></div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><span className="font-medium" style={{ color: 'var(--ink)' }}>Calendly:</span> <a className="link" href={content.calendly}>Schedule a call</a></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 font-header" style={{ color: 'var(--ink)' }}>Message me</h3>
            <Form />
          </div>
        </Section>

        {/* Card (QR) */}
        <Section id="card" title="Card" icon={<QrCode className="h-6 w-6 text-[var(--primary-orange)]" />}>
          <QRCard />
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 text-sm flex items-center justify-between" style={{ color: 'var(--muted)' }}>
          <div>© {new Date().getFullYear()} {content.name}. All rights reserved.</div>
          <div className="opacity-80">Built for quick sharing • Print-ready</div>
        </div>
      </footer>
    </div>
  )
}
