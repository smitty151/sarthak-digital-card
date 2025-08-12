'use client'

/**
 * Main page component for Sarthak's digital contacts & resume site.
 * This file assembles all of the UI elements, including data definitions,
 * reusable components, and the top-level page component.
 */

import { useEffect, useState, useRef } from 'react'
import {
  Mail, MapPin, Linkedin, Calendar, Copy, ChevronDown, ChevronUp, Sun, Moon, Briefcase, Layers, BarChart2, FileText, BookOpen, Download
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Custom content data
//
// This `content` object centralizes all of the editable data used on the page.
// Update these values to change your name, title, contact details, biography,
// quick stats, skills and experience timeline. Keeping this data separate
// makes the rest of the component definitions purely presentational.
const content = {
  name: 'Sarthak Mittal',
  title: 'Strategy, Investments & Transformation | PE / IB / Consulting',
  location: 'Bengaluru, India',
  email: 'mittal.sart@gmail.com',
  phone: '+91 8073877696',
  linkedin: 'https://www.linkedin.com/in/sarthakmittal115/',
  calendly: 'https://calendly.com/mittal-sart/30min',
  resumePdfUrl: '/resume.pdf',
  coverLetterPdfUrl: '/cover-letter.pdf',
  photo: '/images/portrait_pro.webp', // Reverting to a static image
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
      description: 'Translate strategy into execution via pilot playbooks, KPI trees, TOM/RACI, and cadence/RAID governance.'
    },
    {
      company: 'PwC',
      role: 'Deals Transformation',
      duration: '2022-2024',
      description: 'Delivered and instituted playbooks for due diligence, integration management offices (IMO), and separation management offices (SMO).'
    },
    {
      company: 'Nitya Capital',
      role: 'Acquisitions & Value Creation',
      duration: '2017-2022',
      description: 'Sourced, underwrote, and onboarded real estate acquisitions; led value creation initiatives across the portfolio through targeted KPIs and risk-based sampling.'
    }
  ]
};

// ---------------------------------------------------------------------------
// Reusable components
//
// The following components encapsulate common UI patterns used across
// the page. They are defined within the same file for simplicity, but could
// easily be extracted to their own files. Each component is documented
// so you can quickly see what it does and how it contributes to the layout.
/**
 * Toast component
 *
 * A small floating notification used to inform the user of transient
 * status messages (e.g. copy success, form submission errors). When
 * `open` is false the component returns null and renders nothing.
 * The `kind` prop controls the background colour (success or error).
 */
function Toast({ open, kind = 'success', message }: { open: boolean, kind?: 'success' | 'error', message: string }) {
  if (!open) return null;
  const base = 'fixed left-1/2 -translate-x-1/2 bottom-6 z-50 rounded-full px-4 py-2 shadow-lg text-sm transition-opacity duration-300';
  const styles = kind === 'success' ? 'bg-emerald-600 text-white opacity-100' : 'bg-rose-600 text-white opacity-100';
  return <div role="status" aria-live="polite" className={`${base} ${styles}`}>{message}</div>;
}

/**
 * SectionWithAnimation component
 *
 * Wraps any content in an intersection observer that fades the content in
 * and slides it upward as it scrolls into view. This subtle animation helps
 * draw the eye to each section of the page as the user scrolls.
 */
const SectionWithAnimation = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </div>
  );
};

/**
 * Page component
 *
 * This is the top-level component for the digital contact page. It wires
 * together the stateful behaviours (copying, form submission, PDF toggles)
 * and composes the various reusable sections defined below. Most of the
 * layout is defined via Tailwind utility classes.
 */
export default function Page() {
  const [copied, setCopied] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastKind, setToastKind] = useState<'success' | 'error'>('success');
  const [toastMsg, setToastMsg] = useState('');
  const [showResume, setShowResume] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setRedirectUrl(`${window.location.origin}/thanks`);
  }, []);

  /**
   * downloadVCard
   *
   * Builds and triggers a download of a VCard (.vcf) file containing your
   * contact information. This allows visitors to save your details directly
   * to their address book from the site.
   */
  const downloadVCard = () => {
    const lines = [
      'BEGIN:VCARD','VERSION:3.0',`N:Mittal;Sarthak;;;`,`FN:${content.name}`,
      content.email ? `EMAIL;TYPE=INTERNET,PREF:${content.email}` : '',
      content.phone ? `TEL;TYPE=CELL:${content.phone}` : '',
      content.calendly ? `URL:${content.calendly}` : '',
      content.linkedin ? `X-SOCIALPROFILE;type=linkedin:${content.linkedin}` : '',
      `ADR;TYPE=WORK:;;${content.location};;;;`,'END:VCARD',
    ].filter(Boolean).join('\n');
    const a = document.createElement('a');
    a.href = `data:text/vcard;charset=utf-8,${encodeURIComponent(lines)}`;
    a.download = `${content.name.replace(/\s+/g, '-')}.vcf`;
    a.click();
  };

  /**
   * copyText
   *
   * Copies the provided string to the clipboard and shows a toast. If the
   * operation fails, an error toast is shown instead.
   */
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setToastKind('success');
      setToastMsg('Contact copied!');
      setToastOpen(true);
      setTimeout(() => {
        setCopied(false);
        setToastOpen(false);
      }, 2000);
    } catch {
      setToastKind('error');
      setToastMsg('Failed to copy contact.');
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 3000);
    }
  };

  /**
   * Form component
   *
   * Renders the contact form. On submit, posts data to a Formspree endpoint
   * defined in the NEXT_PUBLIC_FORMSPREE_ENDPOINT environment variable.
   * Includes spam prevention (hidden `_gotcha` field) and shows toast
   * notifications on success or failure. Redirects to the /thanks page after
   * a brief delay on successful submission.
   */
  const Form = () => {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '';
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      if (!endpoint) {
        e.preventDefault();
        setToastKind('error');
        setToastMsg('Form submission is not configured.');
        setToastOpen(true);
        return;
      }
      e.preventDefault();
      const form = e.currentTarget;
      const data = new FormData(form);
      data.set('_subject', 'New message from sarthak-digital-card');
      data.set('_redirect', redirectUrl || '');
      setSubmitting(true); setToastOpen(false);
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          setToastKind('success');
          setToastMsg('Sent! Redirecting…');
          setToastOpen(true);
          form.reset();
          setTimeout(() => { window.location.href = redirectUrl || '/' }, 800);
        } else {
          throw new Error(await res.text() || 'Submission failed');
        }
      } catch {
        setToastKind('error');
        setToastMsg('Something went wrong. Please try again.');
        setToastOpen(true);
      } finally {
        setSubmitting(false);
        setTimeout(() => setToastOpen(false), 3000);
      }
    };

    return (
      <form onSubmit={onSubmit} className="space-y-3">
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
        <div className="grid md:grid-cols-2 gap-3">
          <input required name="name" placeholder="Your name" className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring))]" />
          <input required type="email" name="email" placeholder="Email" className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring))]" />
        </div>
        <input name="company" placeholder="Company (optional)" className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring))]" />
        <textarea required name="message" placeholder="Message" rows={5} className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring))]" />
        <button className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed" aria-disabled={submitting} disabled={submitting}>
          {submitting ? 'Sending…' : 'Send'}
        </button>
      </form>
    );
  };

  /**
   * Section component
   *
   * Generic wrapper used to delineate different sections of the page (About,
   * Quick Stats, Experience, Skills, Files, Contact). Accepts an id for
   * linking, a title, optional actions (e.g. header buttons) and an icon.
   * Wraps its content in SectionWithAnimation for fade-in on scroll.
   */
  const Section = ({ id, title, children, action, icon }: { id: string, title: string, children: React.ReactNode, action?: React.ReactNode, icon: React.ReactNode }) => (
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
  );

  /**
   * PdfCard component
   *
   * Displays a card for a PDF document (e.g. Resume or Cover Letter) with
   * actions to open the PDF in a new tab or expand an inline preview. When
   * `expanded` is true, a Tailwind-styled <object> element is shown with the
   * PDF embedded; otherwise only the header and buttons are visible.
   * Tinted background and subtle border/shadow to distinguish the card from its section */
  const PdfCard = ({ title, url, expanded, onToggle }: { title: string; url: string; expanded: boolean; onToggle: () => void }) => (
    <div className="rounded-2xl border border-neutral-300 dark:border-neutral-700 p-4 md:p-5 bg-[var(--bg)] dark:bg-neutral-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="text-lg md:text-xl font-semibold font-header">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {/* Use secondary styling for better contrast against the section background */}
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><Download className="h-4 w-4 mr-2" />Open PDF</a>
          <button onClick={onToggle} className="btn btn-primary">
            {expanded ? (
              <><span className="hidden md:inline">Collapse</span><ChevronUp className="h-4 w-4 md:hidden" /></>
            ) : (
              <><span className="hidden md:inline">Expand</span><ChevronDown className="h-4 w-4 md:hidden" /></>
            )}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 h-[72vh] min-h-[420px] rounded-xl overflow-hidden">
          <object data={`${url}#page=1&zoom=page-width&toolbar=0&navpanes=0&statusbar=0`} type="application/pdf" className="w-full h-full rounded-xl">
            <p className="p-3">Your browser can’t display the PDF here. <a className="link" href={url} target="_blank" rel="noopener noreferrer">Open it in a new tab.</a></p>
          </object>
        </div>
      )}
    </div>
  );

  /**
   * SkillPill component
   *
   * Renders a pill-shaped badge for a skill. On hover, shows a tooltip
   * containing the description of the skill. Uses state to track hover.
   */
  const SkillPill = ({ name, description }: { name: string, description: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div className="relative">
        <span
          className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-blue-200 dark:hover:bg-blue-800"
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
    );
  };

  /**
   * ExperienceTimeline component
   *
   * Displays a vertical timeline of job experiences. Each timeline entry
   * includes the company name, role, duration and a description of the work.
   * A coloured dot and connecting line visually join the entries.
   */
  const ExperienceTimeline = ({ data }: { data: { company: string, role: string, duration: string, description: string }[] }) => (
    <div className="relative border-l-2 border-orange-300 dark:border-orange-500 pl-4">
      {data.map((item, index) => (
        <div key={index} className="mb-8 last:mb-0 relative">
          <h3 className="text-xl font-semibold font-header text-orange-600 dark:text-orange-400">{item.company}</h3>
          <p className="text-lg font-medium mt-1">{item.role}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.duration}</p>
          <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  );

  /**
   * SkillsSection component
   *
   * Iterates over the categories in the skills data and renders a header
   * followed by a set of SkillPill components for each skill in that category.
   */
  const SkillsSection = ({ skillsData }: { skillsData: Record<string, { name: string; description: string }[]> }) => (
    <div className="space-y-6">
      {Object.keys(skillsData).map(category => (
        <div key={category}>
          <h3 className="text-lg font-bold font-header mb-2 text-blue-600 dark:text-blue-400">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {skillsData[category].map((skill, index) => (
              <SkillPill key={index} name={skill.name} description={skill.description} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg)] text-[color:var(--ink)]">
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

        /* Map tokens to working CSS vars used by components */
        :root {
          --bg: var(--bg-light);
          --card: var(--card-light);
          --ink: var(--ink-light);
          --muted: var(--muted-light);
          --ring: var(--ring-light);
        }
        .dark {
          --bg: var(--bg-dark);
          --card: var(--card-dark);
          --ink: var(--ink-dark);
          --muted: var(--muted-dark);
          --ring: var(--ring-dark);
        }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        body {
          scroll-behavior: smooth;
        }

        .animated-background {
          background: linear-gradient(-45deg, var(--accent-blue), var(--accent-green), var(--primary-orange), var(--primary-orange));
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }

        .card {
          @apply bg-[color:var(--card)] shadow-sm;
        }
      `}</style>
      <Toast open={toastOpen} kind={toastKind} message={toastMsg} />
      <header className="sticky top-0 z-30 border-b border-neutral-200/70 dark:border-neutral-800/60 backdrop-blur bg-[var(--bg)]/80 dark:bg-[var(--bg)]/70">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-bold font-header" style={{color: 'var(--ink)'}}>{content.name}</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="hover:text-[color:var(--accent-blue)] transition-colors">About</a>
            <a href="#experience" className="hover:text-[color:var(--accent-blue)] transition-colors">Experience</a>
            <a href="#files" className="hover:text-[color:var(--accent-blue)] transition-colors">Files</a>
            <a href="#contact" className="hover:text-[color:var(--accent-blue)] transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => document.documentElement.classList.toggle('dark')} className="btn btn-ghost p-2" aria-label="Toggle dark mode">
              <Sun className="h-5 w-5 block dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </button>
            <button onClick={downloadVCard} className="btn btn-primary hidden md:inline-flex">Download vCard</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-10 md:pt-14 pb-6 md:pb-10 relative z-10">
        <SectionWithAnimation>
          <div className="card p-6 md:p-8 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 order-2 md:order-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-header" style={{color: 'var(--ink)'}}>{content.name}</h1>
                <p className="mt-1 font-subheader" style={{color: 'var(--accent-blue)'}}>{content.title}</p>
                <p className="text-sm mt-1 flex items-center gap-1" style={{color: 'var(--muted)'}}><MapPin className="h-4 w-4" />{content.location}</p>
                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  <a className="btn btn-ghost" href={`mailto:${content.email}`}><Mail className="h-4 w-4 mr-2" />Email</a>
                  <button onClick={() => copyText(`${content.name} – ${content.email}`)} className="btn btn-primary"><Copy className="h-4 w-4 mr-2" />{copied ? 'Copied!' : 'Copy Contact'}</button>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <img src={content.photo} alt={content.photoAlt} width={520} height={520} className="photo w-full max-w-[520px] h-auto rounded-2xl object-cover border-none" />
              </div>
            </div>
          </div>
        </SectionWithAnimation>
      </div>

      <main className="max-w-5xl mx-auto px-4 space-y-8 md:space-y-10 pb-16 relative z-10">
        <Section id="about" title="About" icon={<Briefcase className="h-6 w-6 text-[color:var(--accent-blue)]" />}>
          <p className="leading-relaxed copy">{content.aboutBio}</p>
          <div className="flex gap-2 mt-4">
            {/* Use secondary button for LinkedIn to create contrast */}
            <a href={content.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><Linkedin className="h-4 w-4 mr-2" />LinkedIn</a>
            <a href={content.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><Calendar className="h-4 w-4 mr-2" />Schedule</a>
          </div>
        </Section>
        
        <Section id="quick-stats" title="Quick Stats" icon={<BarChart2 className="h-6 w-6 text-[color:var(--accent-green)]" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.quickStats.map((stat, index) => (
              <div key={index} className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-xl shadow-sm hover:scale-[1.05] hover:shadow-lg transition-all duration-300">
                <h3 className="text-3xl font-bold text-[color:var(--primary-orange)] font-header">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
              </div>
            ))}
          </div>
        </Section>
        
        <Section id="experience" title="Experience" icon={<Briefcase className="h-6 w-6 text-[color:var(--primary-orange)]" />}>
          <ExperienceTimeline data={content.timeline} />
        </Section>
        
        <Section id="skills" title="Skills" icon={<Layers className="h-6 w-6 text-[color:var(--accent-blue)]" />}>
          <SkillsSection skillsData={content.skills} />
        </Section>

        <Section id="files" title="Files" icon={<FileText className="h-6 w-6 text-[color:var(--accent-green)]" />}>
          <div className="space-y-6">
            <PdfCard
              title="Resume"
              url={content.resumePdfUrl}
              expanded={showResume}
              onToggle={() => setShowResume(v => !v)}
            />
            <PdfCard
              title="Cover Letter"
              url={content.coverLetterPdfUrl}
              expanded={showLetter}
              onToggle={() => setShowLetter(v => !v)}
            />
          </div>
        </Section>

        <Section id="contact" title="Contact" icon={<BookOpen className="h-6 w-6 text-[color:var(--primary-orange)]" />}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><span className="font-medium" style={{color: 'var(--ink)'}}>Email:</span> <a className="link" href={`mailto:${content.email}`}>{content.email}</a></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span className="font-medium" style={{color: 'var(--ink)'}}>Location:</span> {content.location}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-gray-400" /><span className="font-medium" style={{color: 'var(--ink)'}}>LinkedIn:</span> <a className="link" href={content.linkedin}>{content.linkedin}</a></div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><span className="font-medium" style={{color: 'var(--ink)'}}>Calendly:</span> <a className="link" href={content.calendly}>{content.calendly}</a></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 font-header" style={{color: 'var(--ink)'}}>Message me</h3>
            <Form />
          </div>
        </Section>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 text-sm flex items-center justify-between" style={{color: 'var(--muted)'}}>
          <div>© {new Date().getFullYear()} {content.name}. All rights reserved.</div>
          <div className="opacity-80">Built for quick sharing • Print-ready</div>
        </div>
      </footer>
    </div>
  );
}
