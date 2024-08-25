import { Post } from './blog'
import siteMetadata from "./siteMetadata"

export default async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${siteMetadata.apiUrl}/posts`, { cache: 'no-store' });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(`${response.status} ${response.statusText}: ${err.error}`);
    }
    const data = await response.json();
    const posts = data?.map((post) => ({
        slug: post.id,
        date: post.created_at,
        title: post.title,
        tags: post.tags,
        summary: post.summary,
        lastmod: post.updated_at,
    })) || [];
    return posts;
  } catch (error) {
    throw error;
  }
}
