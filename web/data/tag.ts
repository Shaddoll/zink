import { Post } from './blog'
import siteMetadata from "./siteMetadata"

export default async function fetchPostsByTag(tag: string): Promise<Post[]> {
  try {
    const response = await fetch(`${siteMetadata.apiUrl}/tags/${tag}`, { cache: 'no-store' });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(`${response.status} ${response.statusText}: ${err.error}`);
    }
    const data = await response.json();
    const posts = data?.map((post) => ({
        slug: post.slug,
        date: post.created_at,
        title: post.title,
        tags: post.tags,
        summary: post.summary,
    })) || [];
    return posts;
  } catch (error) {
    throw error;
  }
}
