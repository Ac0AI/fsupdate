import NextLink from 'next/link'

/**
 * Not-found-vyn för /flytta-utomlands och /blogg.
 *
 * Roten har redan en app/not-found.tsx, men den renderar inget synligt inne i
 * [locale]-gruppen. Samma sak gäller /coordinator sedan tidigare. Tills det är
 * löst på riktigt får de nya segmenten en egen vy, så en felstavad adress
 * landar på något läsbart i stället för en tom sida.
 *
 * Statuskoden blir fortfarande 200 eftersom middleware rewritar till /sv innan
 * Next hinner sätta 404. Det är ett befintligt fel i appen, inte i de här
 * sidorna, och ska fixas i middleware.ts.
 */

interface Props {
  title: string
  body: string
  backHref: string
  backLabel: string
}

const SegmentNotFound = ({ title, body, backHref, backLabel }: Props) => (
  <main className="bg-white">
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[818px] flex-col justify-center px-6 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">404</p>
      <h1 className="mt-5 text-[32px] md:text-[42px] font-bold leading-tight tracking-[-0.02em] text-[var(--color-secondary-dark)]">{title}</h1>
      <p className="mt-4 max-w-[520px] text-[17px] leading-relaxed text-[var(--color-secondary-main)]/75">{body}</p>
      <NextLink
        href={backHref}
        className="mt-8 inline-flex min-h-12 w-fit items-center rounded-[var(--radius-border-radius-main)] bg-[var(--color-secondary-main)]! px-7 text-[15px] font-bold text-white transition-colors hover:bg-[var(--color-secondary-dark)]!"
      >
        {backLabel}
      </NextLink>
    </div>
  </main>
)

export default SegmentNotFound
