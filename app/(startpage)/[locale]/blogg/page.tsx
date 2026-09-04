import type { Metadata } from 'next'
import { BLOG_INTRO, BLOG_POSTS } from '@/constants/blog'
import { OG_IMAGES } from '@/constants/seo'
import { BlogIndex } from '@/templates/Blog'

export const metadata: Metadata = {
  title: 'Flyttguiden | Flyttsmart',
  description: BLOG_INTRO.body,
  alternates: { canonical: '/blogg' },
  openGraph: { title: 'Flyttguiden | Flyttsmart', description: BLOG_INTRO.body, url: '/blogg', images: OG_IMAGES },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Flyttguiden',
  description: BLOG_INTRO.body,
  blogPost: BLOG_POSTS.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `/blogg/${post.slug}`,
    author: { '@type': 'Organization', name: 'Flyttsmart' },
  })),
}

export default function BloggPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BlogIndex />
    </main>
  )
}
