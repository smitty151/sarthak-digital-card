export const metadata = {
  title: 'Thanks — Message received',
}

export default function ThanksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-8 mx-4 max-w-lg text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Thanks — your message is on its way!</h1>
        <p className="text-neutral-600 dark:text-neutral-300">I’ll get back to you shortly. If it’s urgent, feel free to book time directly.</p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <a href="/" className="px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">Back to Home</a>
          <a href="https://calendly.com/mittal-sart/30min" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-neutral-900 text-white hover:opacity-90">Schedule</a>
        </div>
      </div>
    </div>
  )
}
