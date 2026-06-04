import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://pg-finder-ruddy.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://pg-finder-ruddy.vercel.app/about',
      lastModified: new Date(),
    },
    {
      url: 'https://pg-finder-ruddy.vercel.app/search',
      lastModified: new Date(),
    },
    {
      url: 'https://pg-finder-ruddy.vercel.app/reviews',
      lastModified: new Date(),
    },
  ]
}