// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { VercelRequest, VercelResponse } from '@vercel/node';

// 暂时没用
export default function handler(req:VercelRequest, res:VercelResponse) {
  res.status(200).json({ name: 'John Doe' })
}
