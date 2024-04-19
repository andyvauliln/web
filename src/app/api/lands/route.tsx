import { getLands } from '~/server/lands'; import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: NextApiRequest, res: NextApiResponse) { console.log("Request method api/lands:", req.method); if (req.method !== 'GET') { res.setHeader('Allow', ['GET']); return res.status(405).end(Method ${req.method} Not Allowed); }

try {
  const lands = await getLands();
  res.status(200).json(lands);
} catch (error) {
  res.status(500).json({ error: "Error fetching lands data" });
}
}