// src/routes/sitemap.xml/+server.ts
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const hostname = 'https://collegepredictor.in';

  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
    { url: '/ai-counsellor', changefreq: 'monthly', priority: 0.8 },
    { url: '/college-list', changefreq: 'weekly', priority: 0.8 },
    { url: '/discussion-forum', changefreq: 'weekly', priority: 0.8 },
    { url: '/study-material', changefreq: 'weekly', priority: 0.8 },
    { url: '/rank-converter', changefreq: 'weekly', priority: 0.8 },
    { url: '/answer-sheet-results', changefreq: 'weekly', priority: 0.8 }
  ];

  const stream = new SitemapStream({ hostname });

  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  );

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};
