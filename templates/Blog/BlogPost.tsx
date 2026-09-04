import NextImage from 'next/image'
import NextLink from 'next/link'
import { BLOG_CTA, BLOG_POSTS, type BlogPost as Post } from '@/constants/blog'

/**
 * En guide i Flyttguiden (/blogg/[slug]). Centrerad artikel, mörkt CTA-band sist.
 *
 * Textbredden är låst till 818px enligt --container-content i Paper. Bredare
 * än så blir raderna för långa att läsa i ett svep.
 */

const BlogPost = ({ post }: { post: Post }) => {
  const more = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <>
      <article>
        <header className="bg-white">
          <div className="mx-auto w-full max-w-[818px] px-6 pt-14 md:pt-20 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-[var(--radius-button)] bg-[var(--color-primary-light)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-dark)]">
                {post.category}
              </span>
              {/* Datumet står här för att uppsägningstider och tullregler
                  ändras. Är texten avstämd mot källan igen visas det datumet,
                  annars publiceringsdagen. */}
              <span className="text-[13px] text-[var(--color-inactive-dark)]">
                {post.readingMinutes} min läsning · {post.updated ? `Uppdaterad ${post.updated}` : `Publicerad ${post.published}`}
              </span>
            </div>

            <h1 className="mt-6 text-[34px] md:text-[46px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-secondary-dark)]">{post.title}</h1>
            <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-relaxed text-[var(--color-secondary-main)]/75">{post.lead}</p>
          </div>
        </header>

        <div className="bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 pt-10 md:pt-14">
            {/* 16:9 för att matcha bildernas format. En 21:9-ruta hade beskurit
                illustrationerna uppe och nere där motivet sitter. */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-border-radius-main)] bg-[var(--color-secondary-extra-extra-light)]">
              <NextImage src={post.image} alt="" fill priority sizes="(max-width: 1200px) 100vw, 1136px" className="object-cover" />
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="mx-auto w-full max-w-[818px] px-6 py-12 md:py-16">
            {post.body.map((block, index) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={index} className="mt-12 first:mt-0 text-[24px] md:text-[26px] font-bold text-[var(--color-secondary-dark)]">
                    {block.text}
                  </h2>
                )
              }

              if (block.type === 'callout') {
                return (
                  <aside key={index} className="mt-8 rounded-[var(--radius-border-radius-main)] bg-[var(--color-accent-lighter)] p-6 md:p-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-warning-text)]">{block.label}</p>
                    <p className="mt-3 text-[16px] leading-[26px] text-[var(--color-secondary-dark)]">{block.text}</p>
                  </aside>
                )
              }

              if (block.type === 'steps') {
                return (
                  <ol key={index} className="mt-8 space-y-5">
                    {block.items.map((item, itemIndex) => (
                      <li key={item} className="flex gap-5">
                        <span className="w-4 shrink-0 text-[15px] font-bold text-[var(--color-primary-dark)]">{itemIndex + 1}</span>
                        <span className="text-[16px] leading-[27px] text-[var(--color-secondary-main)]">{item}</span>
                      </li>
                    ))}
                  </ol>
                )
              }

              return (
                <p key={index} className="mt-6 first:mt-0 text-[16px] leading-[28px] text-[var(--color-secondary-main)]">
                  {block.text}
                </p>
              )
            })}
          </div>
        </div>
      </article>

      {/* Tjänsten artikeln gränsar till. Utan den läser hon om tullhandlingar
          och får sedan leta rätt på sidan som gör jobbet. */}
      {post.serviceLink && (
        <section className="bg-white">
          <div className="mx-auto w-full max-w-[818px] px-6 pb-4">
            <NextLink
              href={post.serviceLink.href}
              className="group flex flex-col gap-2 rounded-[var(--radius-border-radius-main)] border border-[var(--color-inactive-main)] p-6 transition-colors hover:border-[var(--color-secondary-main)]"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">Tjänsten</span>
              <span className="text-[19px] font-bold text-[var(--color-secondary-dark)] transition-colors group-hover:text-[var(--color-primary-dark)]">
                {post.serviceLink.label}
              </span>
              <span className="text-[15px] leading-[24px] text-[var(--color-inactive-dark)]">{post.serviceLink.body}</span>
            </NextLink>
          </div>
        </section>
      )}

      {/* CTA-bandet. bg-...! med utropstecken eftersom styles/_reset.css sätter
          background-color: transparent på a utan cascade layer och därmed slår
          Tailwinds utilities. Utan important försvinner den orange knappen. */}
      <section className="bg-[var(--color-secondary-dark)]">
        <div className="mx-auto w-full max-w-[818px] px-6 py-16 md:py-20 text-center">
          <h2 className="text-[28px] md:text-[32px] font-bold text-white">{BLOG_CTA.headline}</h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-relaxed text-white/70">{BLOG_CTA.body}</p>
          <NextLink
            href="/i/testmode"
            className="mt-8 inline-flex min-h-12 items-center rounded-[var(--radius-border-radius-main)] bg-[var(--color-accent-main)]! px-8 text-[15px] font-bold text-[var(--color-inactive-super-dark)] transition-transform duration-200 ease-[var(--ease-standard)] hover:brightness-105 active:scale-[0.99]"
          >
            {BLOG_CTA.action}
          </NextLink>
        </div>
      </section>

      {/* Vidare läsning */}
      <section className="bg-[var(--color-background-default)]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-14 md:py-20">
          <h2 className="text-xl font-bold text-[var(--color-secondary-dark)]">Mer i Flyttguiden</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {more.map((item) => (
              <li key={item.slug}>
                <NextLink
                  href={`/blogg/${item.slug}`}
                  className="group flex h-full flex-col rounded-[var(--radius-border-radius-main)] bg-white! p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-regular)]"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-dark)]">{item.category}</span>
                  <span className="mt-2 text-[16px] font-bold leading-snug text-[var(--color-secondary-dark)] transition-colors group-hover:text-[var(--color-primary-dark)]">
                    {item.title}
                  </span>
                </NextLink>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px]">
            <NextLink href="/blogg" className="font-semibold text-[var(--color-secondary-main)] underline underline-offset-4 hover:text-[var(--color-primary-main)]">
              Hela Flyttguiden
            </NextLink>
          </p>
        </div>
      </section>
    </>
  )
}

export default BlogPost
