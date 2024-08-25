import siteMetadata from "./siteMetadata"

export type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
  lastmod: string;
};

export default async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${siteMetadata.apiUrl}/post/${slug}`, { cache: 'no-store' });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const err = await response.json();
      throw new Error(`${response.status} ${response.statusText}: ${err.error}`);
    }
    const data = await response.json();
    return {
      slug: slug,
      date: data.created_at,
      title: data.title,
      content: data.content,
      tags: data.tags,
      summary: data.summary,
      lastmod: data.updated_at,
    }
  } catch (error) {
    throw error;
  }
}