import Link from 'next/link'

export default function DemoIndexPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background-default)] px-6 py-16 text-[var(--color-secondary-main)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-main)]">Flyttsmart Demo</p>
          <h1 className="text-4xl font-bold">Snabb visuell preview</h1>
          <p className="max-w-2xl text-base text-slate-600">De här vyerna kör utan auth, BankID och resten av appens tunga flöden. Använd dem när du bara vill granska designen.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" href="/demo/start">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-main)]">Start</p>
            <h2 className="mb-3 text-2xl font-bold">Startsidan</h2>
            <p className="text-slate-600">Öppna landningssidan i ett lätt demo-läge med header, sektioner och footer.</p>
          </Link>
          <Link className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" href="/demo/login">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-main)]">Login</p>
            <h2 className="mb-3 text-2xl font-bold">Login-preview</h2>
            <p className="text-slate-600">Öppna BankID-vyn som en ren visuell preview utan riktiga requests eller redirects.</p>
          </Link>
          <Link className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" href="/demo/movepage">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-main)]">Checklista</p>
            <h2 className="mb-3 text-2xl font-bold">Flyttsidan</h2>
            <p className="text-slate-600">Öppna checklistesidan med en påhittad flytt. Ingen backend, ingen inloggning.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
