import NextLink from 'next/link'
import { BLOG_INTRO, featuredPost, otherPosts, type BlogPost } from '@/constants/blog'

/**
 * /blogg. Ett utvalt inlägg högst upp, resten i rutnät under.
 *
 * Bildplatserna är tomma tills vi har riktiga bilder. En tonad yta i rätt
 * proportion är ärligare än en stockbild som inte hör hemma i texten.
 */

const Meta = ({ post }: { post: BlogPost }) => (
  <div className="flex flex-wrap items-center gap-3">
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-dark)]">{post.category}</span>
    <span className="text-[13px] text-[var(--color-inactive-dark)]">{post.readingMinutes} min läsning</span>
  </div>
)

const BlogIndex = () => (
  <>
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 pt-14 md:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">{BLOG_INTRO.eyebrow}</p>
        <h1 className="mt-5 max-w-[760px] text-[38px] md:text-[52px] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--color-secondary-dark)]">
          {BLOG_INTRO.headline}
        </h1>
        <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-[var(--color-secondary-main)]/75">{BLOG_INTRO.body}</p>
      </div>
    </section>

    {/* Utvalt inlägg */}
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-12 md:py-16">
        <NextLink href={`/blogg/${featuredPost.slug}`} className="group grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div
            aria-hidden
            className="aspect-[16/10] w-full rounded-[var(--radius-border-radius-main)] bg-[var(--color-secondary-extra-extra-light)] transition-transform duration-300 ease-[var(--ease-standard)] group-hover:scale-[1.01]"
          />
          <div>
            <Meta post={featuredPost} />
            <h2 className="mt-4 text-[28px] md:text-[32px] font-bold leading-tight text-[var(--color-secondary-dark)]">{featuredPost.title}</h2>
            <p className="mt-4 text-[15px] leading-[26px] text-[var(--color-inactive-dark)]">{featuredPost.excerpt}</p>
            <span className="mt-6 inline-block text-[15px] font-bold text-[var(--color-secondary-main)] transition-colors group-hover:text-[var(--color-primary-main)]">
              Läs artikeln →
            </span>
          </div>
        </NextLink>
      </div>
    </section>

    {/* Övriga inlägg */}
    <section className="bg-[var(--color-background-default)]">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-20">
        <h2 className="border-b border-[var(--color-secondary-main)]/20 pb-4 text-xl font-bold text-[var(--color-secondary-dark)]">Fler artiklar</h2>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <li key={post.slug}>
              <NextLink
                href={`/blogg/${post.slug}`}
                className="group flex h-full flex-col rounded-[var(--radius-border-radius-main)] bg-white! p-5 transition-shadow duration-200 ease-[var(--ease-standard)] hover:shadow-[var(--shadow-regular)]"
              >
                <div aria-hidden className="aspect-[16/10] w-full rounded-[var(--radius-border-radius-small)] bg-[var(--color-secondary-extra-extra-light)]" />
                <div className="mt-5">
                  <Meta post={post} />
                  <h3 className="mt-3 text-[17px] font-bold leading-snug text-[var(--color-secondary-dark)] transition-colors group-hover:text-[var(--color-primary-dark)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[24px] text-[var(--color-inactive-dark)]">{post.excerpt}</p>
                </div>
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
)

export default BlogIndex
