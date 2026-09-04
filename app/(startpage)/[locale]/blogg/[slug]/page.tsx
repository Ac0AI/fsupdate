import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, getPost } from '@/constants/blog'
import { OG_IMAGES } from '@/constants/seo'
import { BlogPost } from '@/templates/Blog'
import i18nConfig from '../../../../../i18nConfig'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return i18nConfig.locales.flatMap((locale) => BLOG_POSTS.map((post) => ({ locale, slug: post.slug })))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const post = getPost(slug)

  if (!post) return {}

  // Rubrikerna är långa i sig. Brand i title bara när den ryms under 60 tecken,
  // annars kapar Google mitt i rubriken.
  const title = post.title.length > 45 ? post.title : `${post.title} | Flyttsmart`

  return {
    title,
    description: post.excerpt,
    alternates: { canonical: `/blogg/${post.slug}` },
    openGraph: { title, description: post.excerpt, url: `/blogg/${post.slug}`, type: 'article', images: OG_IMAGES },
  }
}

export default async function BlogPostPage(props: Props) {
  const { slug } = await props.params
  const post = getPost(slug)

  if (!post) {
    notFound()
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        articleSection: post.category,
        author: { '@type': 'Organization', name: 'Flyttsmart' },
        publisher: { '@type': 'Organization', name: 'Flyttsmart Sverige AB' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Flyttguiden', item: '/blogg' },
          { '@type': 'ListItem', position: 2, name: post.title, item: `/blogg/${post.slug}` },
        ],
      },
    ],
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BlogPost post={post} />
    </main>
  )
}
