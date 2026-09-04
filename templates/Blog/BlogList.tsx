'use client'

import { useMemo, useState } from 'react'
import NextImage from 'next/image'
import NextLink from 'next/link'
import Chip from '@/components/atoms/Chip'
import { BLOG_CATEGORIES, type BlogPost } from '@/constants/blog'

/**
 * Listan i Flyttguiden, med kategorierna som filter.
 *
 * Etiketterna på korten fanns redan men gick inte att klicka på. Sex artiklar
 * klarar sig utan filter, tjugo gör det inte, och filtret ska finnas innan
 * biblioteket växer (kritik 2026-09-04).
 *
 * Allt filtreras i klienten och ingen artikel lämnar DOM:en av SEO-skäl: både
 * sökmotorer och läsare ska se hela guiden på en gång.
 */

const ALL = 'Alla'

const Meta = ({ post }: { post: BlogPost }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-dark)]">{post.category}</span>
    <span className="text-[13px] text-[var(--color-inactive-dark)]">{post.readingMinutes} min läsning</span>
    <span className="text-[13px] text-[var(--color-inactive-dark)]">{post.updated ? `Uppdaterad ${post.updated}` : post.published}</span>
  </div>
)

const BlogList = ({ posts }: { posts: BlogPost[] }) => {
  const [active, setActive] = useState<string>(ALL)

  const visible = useMemo(() => (active === ALL ? posts : posts.filter((post) => post.category === active)), [active, posts])

  return (
    <section className="bg-[var(--color-background-default)]">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-20">
        <h2 className="text-xl font-bold text-[var(--color-secondary-dark)]">Guider för hela flytten</h2>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--color-secondary-main)]/20 pb-6">
          {[ALL, ...BLOG_CATEGORIES].map((category) => (
            <Chip key={category} active={active === category} onClick={() => setActive(category)}>
              {category}
            </Chip>
          ))}
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <li key={post.slug}>
              <NextLink
                href={`/blogg/${post.slug}`}
                className="group flex h-full flex-col rounded-[var(--radius-border-radius-main)] bg-white! p-5 transition-shadow duration-200 ease-[var(--ease-standard)] hover:shadow-[var(--shadow-regular)]"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-border-radius-small)] bg-[var(--color-secondary-extra-extra-light)]">
                  <NextImage src={post.image} alt="" fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" />
                </div>
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
  )
}

export default BlogList
