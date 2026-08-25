import { MetadataRoute } from 'next'
import { getAllCoordinatorUrlsWithAlternatives } from '@/common/utils/phone'
import { COUNTRIES } from '@/constants/abroad'
import { BLOG_POSTS } from '@/constants/blog'

const BASE = 'https://flyttsmart.se'

export default function sitemap(): MetadataRoute.Sitemap {
  // Landssidorna är hela poängen med utlandshubben: en sida per köpord. Läggs de
  // inte in här hittar Google dem bara via interna länkar, och det tar veckor.
  const abroadUrls = COUNTRIES.map((country) => ({
    url: `${BASE}/flytta-utomlands/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const blogUrls = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blogg/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const coordinatorUrls = getAllCoordinatorUrlsWithAlternatives().map((phone) => ({
    url: `https://flyttsmart.se/coordinator/${phone}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        sv: `https://flyttsmart.se/sv/coordinator/${phone}`,
        en: `https://flyttsmart.se/en/coordinator/${phone}`,
      },
    },
  }))

  return [
    {
      url: 'https://flyttsmart.se',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE}/flytta-utomlands`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...abroadUrls,
    {
      url: `${BASE}/blogg`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...blogUrls,
    {
      url: 'https://flyttsmart.se/terms',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://flyttsmart.se/privacy_policy',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://flyttsmart.se/cookie',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://help.flyttsmart.se',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    ...coordinatorUrls,
  ]
}
