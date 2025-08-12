'use client'

import { useEffect, useState } from 'react'

const content = {
  name: 'Sarthak Mittal',
  title: 'Strategy, Investments & Transformation | PE / IB / Consulting',
  location: 'Bengaluru, India',
  email: 'mittal.sart@gmail.com',
  phone: '+91 8073877696', // kept for vCard only; not rendered on UI
  linkedin: 'https://www.linkedin.com/in/sarthakmittal115/',
  calendly: 'https://calendly.com/mittal-sart/30min',
  resumePdfUrl: '/resume.pdf',
  coverLetterPdfUrl: '/cover-letter.pdf',
  photo: '/images/headshot_suit.webp',
  photoAlt: 'Sarthak Mittal headshot',
  thumbs: {
    resume: '/images/thumb_resume.png',
    letter: '/images/thumb_letter.png',
  }
}

function Anchor({ href, children }: { href: string, children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="link">{children}</a>
}

function Toast({ open, kind = 'success', message }: { open: boolean, kind?: 'success' | 'error', message: string }) {
  if (!open) return null
  const base = 'fixed left-1/2 -translate-x-1/2 bottom-6 z-50 rounded-full px-4 py-2 shadow-lg text-sm'
  const styles = kind === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
  return <div role="status" aria-live="polite" className={`${base} ${styles}`}>{message}</div>
}

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
    if (typeof window !== 'undefined') {
      setRedirectUrl(`${window.location.origin}/thanks`)
    }
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
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200) } catch {}

  }

  const Form = () => {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || ''
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      if (!endpoint) { e.preventDefault(); alert('Add NEXT_PUBLIC_FORMSPREE_ENDPOINT in Vercel to enable submissions.'); return }
      e.preventDefault()
      const form = e.currentTarget
      const data = new FormData(form)
      data.set('_subject', 'New message from sarthak-digital-card')
      data.set('_redirect', redirectUrl || '')
      setSubmitting(true); setToastOpen(false)
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        if (res.ok) { setToastKind('success'); setToastMsg('Sent! Redirecting…'); setToastOpen(true); form.reset(); setTimeout(() => { window.location.href = redirectUrl || '/' }, 800) }
        else { throw new Error(await res.text() || 'Submission failed') }
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
          <input required name="name" placeholder="Your name" className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring))]" />
          <input required type="email" name="email" placeholder="Email" className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring))]" />
        </div>
        <input name="company" placeholder="Company (optional)" className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring))]" />
        <textarea required name="message" placeholder="Message" rows={5} className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring))]" />
        <button className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed" aria-disabled={submitting} disabled={submitting}>
          {submitting ? 'Sending…' : 'Send'}
        </button>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">Or schedule directly: <a className="link" href={content.calendly} target="_blank" rel="noreferrer">Calendly</a></p>
      </form>
    )
  }

  const Section = ({ id, title, children, action }: { id: string, title: string, children: React.ReactNode, action?: React.ReactNode }) => (
    <section id={id} className="scroll-mt-24">
      <div className="card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
          {action}
        </div>
        {children}
      </div>
    </section>
  )

  const pdfParams = '#page=1&zoom=page-width&toolbar=0&navpanes=0&statusbar=0'

  const PdfCard = ({ kind, title, thumb, url, expanded, onToggle }: { kind:'resume'|'letter'; title: string; thumb: string; url: string; expanded: boolean; onToggle: () => void }) => (
    <div className="ticket p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <img src={thumb} alt={`${title} thumbnail`} className="w-full md:w-56 h-40 object-cover rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white" />
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Compact card view keeps things tidy. Expand to preview inline, or open in a new tab for full controls.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a href={url} target="_blank" rel="noreferrer" className="btn btn-ghost">Open PDF</a>
            <button onClick={onToggle} className="btn btn-primary">{expanded ? 'Collapse' : 'Expand'}</button>
          </div>
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

  return (
    <div className="min-h-screen">
      <Toast open={toastOpen} kind={toastKind} message={toastMsg} />
      <header className="sticky top-0 z-30 border-b border-neutral-200/70 dark:border-neutral-800/60 backdrop-blur bg-[color:var(--bg)]/80 dark:bg-[color:var(--bg)]/70">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-neutral-600 dark:text-neutral-300">Digital Contacts</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#contact" className="hover:opacity-80">Contact</a>
            <a href="#resume" className="hover:opacity-80">Resume</a>
            <a href="#cover-letter" className="hover:opacity-80">Cover Letter</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => document.documentElement.classList.toggle('dark')} className="btn btn-ghost">Theme</button>
            <button onClick={downloadVCard} className="btn btn-primary">Download vCard</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-10 md:pt-14 pb-6 md:pb-10">
        <div className="card p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{content.name}</h1>
              <p className="text-neutral-700 dark:text-neutral-300 mt-1">{content.title}</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">{content.location}</p>
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                <a className="btn btn-ghost" href={`mailto:${content.email}`}>Email</a>
                <a className="btn btn-ghost" href={content.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="btn btn-ghost" href={content.calendly} target="_blank" rel="noreferrer">Schedule</a>
                <button onClick={() => copyText(`${content.name} – ${content.email}`)} className="btn btn-primary">{copied ? 'Copied!' : 'Copy Contact'}</button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img src={content.photo} alt={content.photoAlt} className="photo w-40 h-40 md:w-56 md:h-56 object-cover mx-auto" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 space-y-8 md:space-y-10 pb-16">
        <Section id="contact" title="Contact & Social">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div><span className="font-medium">Email:</span> <a className="link" href={`mailto:${content.email}`}>{content.email}</a></div>
              <div><span className="font-medium">Location:</span> {content.location}</div>
            </div>
            <div className="space-y-2">
              <div><span className="font-medium">LinkedIn:</span> <a className="link" href={content.linkedin}>{content.linkedin}</a></div>
              <div><span className="font-medium">Calendly:</span> <a className="link" href={content.calendly}>{content.calendly}</a></div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Message me</h3>
            <Form />
          </div>
        </Section>

        <Section id="resume" title="Resume">
          <PdfCard
            kind="resume"
            title="Resume — Sarthak Mittal"
            thumb={content.thumbs.resume}
            url={content.resumePdfUrl}
            expanded={showResume}
            onToggle={() => setShowResume(v => !v)}
          />
        </Section>

        <Section id="cover-letter" title="Cover Letter">
          <PdfCard
            kind="letter"
            title="Cover Letter — Sarthak Mittal"
            thumb={content.thumbs.letter}
            url={content.coverLetterPdfUrl}
            expanded={showLetter}
            onToggle={() => setShowLetter(v => !v)}
          />
        </Section>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 text-sm text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
          <div>© {new Date().getFullYear()} {content.name}. All rights reserved.</div>
          <div className="opacity-80">Built for quick sharing • Print-ready</div>
        </div>
      </footer>
    </div>
  )
}
