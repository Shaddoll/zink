import siteMetadata from "./siteMetadata"

export default async function fetchTagCounts(): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${siteMetadata.apiUrl}/tags`, { cache: 'no-store' });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(`${response.status} ${response.statusText}: ${err.error}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

