'use client'

import { useEffect, useState } from 'react'

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
}

function Anchor({ href, children }: { href: string, children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-4 hover:decoration-solid">{children}</a>
}

export default function Page() {
  const [copied, setCopied] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(`${window.location.origin}/thanks`)
    }
  }, [])

  const downloadVCard = () => {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:Mittal;Sarthak;;;`,
      `FN:${content.name}`,
      content.email ? `EMAIL;TYPE=INTERNET,PREF:${content.email}` : '',
      content.phone ? `TEL;TYPE=CELL:${content.phone}` : '',
      content.calendly ? `URL:${content.calendly}` : '',
      content.linkedin ? `X-SOCIALPROFILE;type=linkedin:${content.linkedin}` : '',
      `ADR;TYPE=WORK:;;${content.location};;;;`,
      'END:VCARD',
    ].filter(Boolean).join('\n')
    const a = document.createElement('a')
    a.href = `data:text/vcard;charset=utf-8,${encodeURIComponent(lines)}`
    a.download = `${content.name.replace(/\s+/g, '-')}.vcf`
    a.click()
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const Form = () => {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || ''
    return (
      <form
        action={endpoint || '#'}
        method="POST"
        className="space-y-3"
        onSubmit={(e) => {
          if (!endpoint) { e.preventDefault(); alert('Add NEXT_PUBLIC_FORMSPREE_ENDPOINT in Vercel to enable submissions.'); }
        }}
      >
        {/* Hidden fields for Formspree behavior */}
        <input type="hidden" name="_subject" value="New message from sarthak-digital-card" />
        <input type="hidden" name="_redirect" value={redirectUrl || ''} />
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid md:grid-cols-2 gap-3">
          <input required name="name" placeholder="Your name" className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
          <input required type="email" name="email" placeholder="Email" className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
        </div>
        <input name="company" placeholder="Company (optional)" className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
        <textarea required name="message" placeholder="Message" rows={5} className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" />
        <button className="px-4 py-2 rounded-full bg-neutral-900 text-white hover:opacity-90">Send</button>
        <p className="text-xs text-neutral-500">Or schedule directly: <Anchor href={content.calendly}>Calendly</Anchor></p>
      </form>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200/70 dark:border-neutral-800/60 backdrop-blur bg-white/70 dark:bg-neutral-950/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-neutral-600 dark:text-neutral-300">Digital Contacts</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#contact" className="hover:opacity-80">Contact</a>
            <a href="#resume" className="hover:opacity-80">Resume</a>
            <a href="#cover-letter" className="hover:opacity-80">Cover Letter</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => document.documentElement.classList.toggle('dark')} className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">Theme</button>
            <button onClick={downloadVCard} className="px-3 py-1.5 rounded-full bg-black text-white text-sm hover:opacity-90">Download vCard</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-10 md:pt-14 pb-6 md:pb-10">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{content.name}</h1>
              <p className="text-neutral-600 dark:text-neutral-300 mt-1">{content.title}</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">{content.location}</p>
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                <a className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800" href={`mailto:${content.email}`}>Email</a>
                <a className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800" href={content.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800" href={content.calendly} target="_blank" rel="noreferrer">Schedule</a>
                <button onClick={() => copyText(`${content.name} – ${content.email} | ${content.phone}`)} className="px-3 py-1.5 rounded-full bg-neutral-900 text-white hover:opacity-90">{copied ? 'Copied!' : 'Copy Contact'}</button>
              </div>
            </div>
            <div className="md:text-right text-sm text-neutral-600 dark:text-neutral-300">
              <p className="font-medium">Quick Links</p>
              <ul className="space-y-1 mt-1">
                <li><a className="underline decoration-dotted" href="#resume">Resume</a></li>
                <li><a className="underline decoration-dotted" href="#cover-letter">Cover Letter</a></li>
                <li><a className="underline decoration-dotted" href="#contact">Contact & Social</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 space-y-8 md:space-y-10 pb-16">
        <section id="contact" className="scroll-mt-24">
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl md:text-3xl font-semibold">Contact & Social</h2></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div><span className="font-medium">Email:</span> <Anchor href={`mailto:${content.email}`}>{content.email}</Anchor></div>
                <div><span className="font-medium">Phone:</span> {content.phone}</div>
                <div><span className="font-medium">Location:</span> {content.location}</div>
              </div>
              <div className="space-y-2">
                <div><span className="font-medium">LinkedIn:</span> <Anchor href={content.linkedin}>{content.linkedin}</Anchor></div>
                <div><span className="font-medium">Calendly:</span> <Anchor href={content.calendly}>{content.calendly}</Anchor></div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Message me</h3>
              <Form />
            </div>
          </div>
        </section>

        <section id="resume" className="scroll-mt-24">
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold">Resume</h2>
              <a href={content.resumePdfUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">Open PDF</a>
            </div>
            <div className="h-[70vh] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              <iframe src={content.resumePdfUrl} title="Resume" className="w-full h-full" />
            </div>
          </div>
        </section>

        <section id="cover-letter" className="scroll-mt-24">
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold">Cover Letter</h2>
              <a href={content.coverLetterPdfUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">Open PDF</a>
            </div>
            <div className="h-[70vh] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              <iframe src={content.coverLetterPdfUrl} title="Cover Letter" className="w-full h-full" />
            </div>
          </div>
        </section>
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
