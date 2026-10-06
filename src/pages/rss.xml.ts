import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const briefings = await getCollection('briefings');
  const sortedBriefings = briefings.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'AI Intelligence Radar',
    description: 'Daily automated operator synthesis, velocity tracking, and verified primary citations.',
    site: context.site,
    items: sortedBriefings.map((briefing) => ({
      title: briefing.data.title,
      pubDate: briefing.data.date,
      description: briefing.data.summary || briefing.data.title,
      link: `/briefings/${briefing.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
