'use client'

import { useEffect, useState } from 'react'

// Icon imports for a cleaner UI
import {
  Mail,
  MapPin,
  Linkedin,
  Calendar,
  Download,
  Copy,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Briefcase,
  Layers,
  BarChart2,
  FileText,
  BookOpen
} from 'lucide-react';

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
  photoAlt: 'Sarthak Mittal composite portrait',
  aboutBio: `I build value at the intersection of investing and execution. My background spans PwC Deals (transaction diligence), Nitya Capital (acquisitions & portfolio value creation), and a founder-operator stint at OurEarth BioPlastics. I like translating models into operating rhythms—clear KPIs, decision cadences, and accountability—so the plan actually happens. Sector experience includes real assets and consumer/industrial adjacencies; comfort with analytics (Python/SQL/BI) helps me pressure‑test assumptions and make performance visible.`,
  // New section data for quick stats and skills
  quickStats: [
    { title: 'Years of Experience', value: '7+' },
    { title: 'Deals Closed', value: '15+' },
    { title: 'Capital Deployed', value: '$200M+' },
  ],
  skills: [
    { name: 'Financial Modeling', proficiency: 'Expert' },
    { name: 'Transaction Diligence', proficiency: 'Expert' },
    { name: 'Portfolio Management', proficiency: 'Advanced' },
    { name: 'Python/SQL/BI', proficiency: 'Advanced' },
    { name: 'Value Creation', proficiency: 'Expert' },
    { name: 'Fundraising', proficiency: 'Intermediate' },
  ]
}

function Toast({ open, kind = 'success', message }: { open: boolean, kind?: 'success' | 'error', message: string }) {
  if (!open) return null
  const base = 'fixed left-1/2 -translate-x-1/2 bottom-6 z-50 rounded-full px-4 py-2 shadow-lg text-sm transition-opacity duration-300'
  const styles = kind === 'success' ? 'bg-emerald-600 text-white opacity-100' : 'bg-rose-600 text-white opacity-100'
  return <div role="status" aria-live="polite" className={`${base} ${styles}`}>{message}</div>
}

// A more robust and reliable Dynamic Image component with fallback
const DynamicImage = ({ altText, className }: { altText: string; className: string; }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateImage = async () => {
      const prompt = "A professional and friendly-looking man with a warm smile, similar in appearance to the man in the provided images. The background should be inviting, clean, and modern, with a touch of warmth. The image should be suitable for a contact page, designed to catch the user's eye.";
      
      const payload = {
        instances: { prompt: prompt },
        parameters: { "sampleCount": 1 }
      };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
      let retries = 0;
      const maxRetries = 5;
      const baseDelay = 1000;

      while (retries < maxRetries) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.status === 429) {
            retries++;
            const delay = baseDelay * Math.pow(2, retries);
            console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
            continue;
          }

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result?.predictions?.[0]?.bytesBase64Encoded) {
            const generatedUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
            setImageUrl(generatedUrl);
            break;
          } else {
            throw new Error('Failed to generate image or invalid response structure.');
          }
        } catch (e) {
          console.error('Fetch error:', e);
          setError(true); // Set error state on failure
          retries++;
          const delay = baseDelay * Math.pow(2, retries);
          console.log(`Fetch failed. Retrying in ${delay}ms...`);
          await new Promise(res => setTimeout(res, delay));
        }
      }
      setLoading(false); // Always set loading to false after the loop finishes
    };

    generateImage();
  }, []);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200 dark:bg-gray-800`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !imageUrl) {
    // Fallback image in case of failure
    return (
      <img
        src="https://placehold.co/520x520/e2e8f0/64748b?text=Image+Unavailable"
        alt="Image could not be generated"
        className={className}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={altText}
      className={`${className} transition-opacity duration-500 ease-in-out opacity-100`}
    />
  );
};

export default function Page() {
  const [copied, setCopied] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastKind, setToastKind] = useState<'success' | 'error'>('success')
  const [toastMsg, setToastMsg] = useState('')
  const [showResume, setShowResume] = useState(false)
  const [showLetter, setShowLetter] = useState(false)

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
    ].filter(Boolean).join('\n')
    const a = document.createElement('a')
    a.href = `data:text/vcard;charset=utf-8,${encodeURIComponent(lines)}`
    a.download = `${content.name.replace(/\s+/g, '-')}.vcf`
    a.click()
  }

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
  }

  const Form = () => {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || ''
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      if (!endpoint) {
        e.preventDefault();
        setToastKind('error');
        setToastMsg('Form submission is not configured.');
        setToastOpen(true);
        return
      }
      e.preventDefault()
      const form = e.currentTarget
      const data = new FormData(form)
      data.set('_subject', 'New message from sarthak-digital-card')
      data.set('_redirect', redirectUrl || '')
      setSubmitting(true); setToastOpen(false)
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        if (res.ok) {
          setToastKind('success');
          setToastMsg('Sent! Redirecting…');
          setToastOpen(true);
          form.reset();
          setTimeout(() => { window.location.href = redirectUrl || '/' }, 800)
        }
        else {
          throw new Error(await res.text() || 'Submission failed')
        }
      } catch {
        setToastKind('error');
        setToastMsg('Something went wrong. Please try again.');
        setToastOpen(true)
      } finally {
        setSubmitting(false);
        setTimeout(() => setToastOpen(false), 3000)
      }
    }

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
    )
  }

  const Section = ({ id, title, children, action, icon }: { id: string, title: string, children: React.ReactNode, action?: React.ReactNode, icon: React.ReactNode }) => (
    <section id={id} className="scroll-mt-24">
      <div className="card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  )

  const pdfParams = '#page=1&zoom=page-width&toolbar=0&navpanes=0&statusbar=0'

  const PdfCard = ({ title, url, expanded, onToggle }: { title: string; url: string; expanded: boolean; onToggle: () => void }) => (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 md:p-5 bg-white dark:bg-[color:var(--card)] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
        <div className="flex flex-wrap gap-2">
          <a href={url} target="_blank" rel="noreferrer" className="btn btn-ghost">Open PDF</a>
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
        <div className="mt-4 pdf-frame">
          <object data={`${url}${pdfParams}`} type="application/pdf" className="w-full h-full">
            <p className="p-3">Your browser can’t display the PDF here. <a className="link" href={url} target="_blank" rel="noreferrer">Open it in a new tab.</a></p>
          </object>
        </div>
      )}
    </div>
  )

  const SkillPill = ({ name, proficiency }: { name: string, proficiency: string }) => (
    <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200">
      {name}
    </span>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[color:var(--bg)] text-[color:var(--ink)]">
      {/* Background gradient for a more dynamic feel */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <style>
        {`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        `}
      </style>
      <Toast open={toastOpen} kind={toastKind} message={toastMsg} />
      <header className="sticky top-0 z-30 border-b border-neutral-200/70 dark:border-neutral-800/60 backdrop-blur bg-[color:var(--bg)]/80 dark:bg-[color:var(--bg)]/70">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-bold" style={{color: 'var(--ink)'}}>{content.name}</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
            <a href="#experience" className="hover:text-blue-500 transition-colors">Experience</a>
            <a href="#files" className="hover:text-blue-500 transition-colors">Files</a>
            <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => document.documentElement.classList.toggle('dark')} className="btn btn-ghost p-2">
              <Sun className="h-5 w-5 block dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </button>
            <button onClick={downloadVCard} className="btn btn-primary hidden md:inline-flex">Download vCard</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-10 md:pt-14 pb-6 md:pb-10 relative z-10">
        <div className="card p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{color: 'var(--ink)'}}>{content.name}</h1>
              <p className="mt-1" style={{color: 'var(--muted)'}}>{content.title}</p>
              <p className="text-sm mt-1 flex items-center gap-1" style={{color: 'var(--muted)'}}><MapPin className="h-4 w-4" />{content.location}</p>
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                <a className="btn btn-ghost" href={`mailto:${content.email}`}><Mail className="h-4 w-4 mr-2" />Email</a>
                <button onClick={() => copyText(`${content.name} – ${content.email}`)} className="btn btn-primary"><Copy className="h-4 w-4 mr-2" />{copied ? 'Copied!' : 'Copy Contact'}</button>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <DynamicImage altText={content.photoAlt} className="photo w-full max-w-[520px] h-auto rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 space-y-8 md:space-y-10 pb-16 relative z-10">
        <Section id="about" title="About" icon={<Briefcase className="h-6 w-6 text-blue-500" />}>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 order-2 md:order-1">
              <p className="leading-relaxed copy">{content.aboutBio}</p>
              <div className="flex gap-2 mt-4">
                <a href={content.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost"><Linkedin className="h-4 w-4 mr-2" />LinkedIn</a>
                <a href={content.calendly} target="_blank" rel="noreferrer" className="btn btn-primary"><Calendar className="h-4 w-4 mr-2" />Schedule</a>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <DynamicImage altText="Portrait" className="photo w-40 h-40 md:w-56 md:h-56 object-cover rounded-2xl" />
            </div>
          </div>
        </Section>

        <Section id="quick-stats" title="Quick Stats" icon={<BarChart2 className="h-6 w-6 text-purple-500" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.quickStats.map((stat, index) => (
              <div key={index} className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-3xl font-bold text-blue-500">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
              </div>
            ))}
          </div>
        </Section>
        
        <Section id="skills" title="Skills" icon={<Layers className="h-6 w-6 text-green-500" />}>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, index) => (
              <SkillPill key={index} name={skill.name} proficiency={skill.proficiency} />
            ))}
          </div>
        </Section>

        <Section id="files" title="Files" icon={<FileText className="h-6 w-6 text-orange-500" />}>
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

        <Section id="contact" title="Contact" icon={<BookOpen className="h-6 w-6 text-red-500" />}>
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
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--ink)'}}>Message me</h3>
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
  )
}
