import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://playtechdle.com';
  
  const routes = [
    '',
    '/archive',
    '/dictionary',
    '/modes',
    '/practice',
    '/stats',
    '/changelog',
    '/about',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
    '/accessibility'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/archive' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/archive' ? 0.8 : 0.5,
  }));
}
