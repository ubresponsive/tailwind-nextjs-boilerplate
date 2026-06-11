import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { cacheLife, cacheTag } from "next/cache";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

/** Frontmatter contract. A malformed post fails the build rather than rendering broken. */
const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.iso.date(), // YYYY-MM-DD
  updated: z.iso.date().optional(),
  author: z.object({
    name: z.string().min(1),
    profileUrl: z.string().optional(),
  }),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTimeMinutes: number;
}

export interface Post extends PostMeta {
  /** Raw MDX body (frontmatter stripped), compiled by the page with next-mdx-remote. */
  content: string;
}

async function readPostFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(POSTS_DIR);
    return entries.filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
}

function parsePost(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  const fm = frontmatterSchema.parse(data);
  return {
    ...fm,
    slug,
    content,
    readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

/** All published posts, newest first. Cached and tagged so a publish can revalidate. */
export async function getAllPosts(): Promise<PostMeta[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const files = await readPostFiles();
  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
      const { content: _content, ...meta } = parsePost(slug, raw);
      void _content;
      return meta;
    }),
  );

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** A single post by slug, or null if missing/draft. */
export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
    const post = parsePost(slug, raw);
    return post.draft ? null : post;
  } catch {
    return null;
  }
}
