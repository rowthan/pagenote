import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type Post = {
  _id?: string;
  slug?: string;
  content?: MDXRemoteSerializeResult;
  title: string;
  date?: string;
  excerpt: string;
  coverImage?: string;
  readingTime?: string;
  tweets?: any[];
};
