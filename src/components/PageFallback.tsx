export default function PageFallback() {
  return (
    <div className="min-h-[calc(100dvh-56px)] bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-3/5 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4">
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  )
}
