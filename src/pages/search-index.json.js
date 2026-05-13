import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const projects = await getCollection('projects');

  const searchData = [
    ...posts.map((p) => ({
      title: p.data.title,
      slug: p.slug,
      path: `/blog/${p.slug}`,
      type: 'blog',
      tags: p.data.tags || [],
      date: p.data.date.getTime(),
    })),
    ...projects.map((p) => ({
      title: p.data.title,
      slug: p.slug,
      path: `/projects/${p.slug}`,
      type: 'projects',
      tags: p.data.tags || [],
      date: p.data.date.getTime(),
    })),
  ];

  return new Response(JSON.stringify(searchData), {
    headers: { 'Content-Type': 'application/json' },
  });
}
