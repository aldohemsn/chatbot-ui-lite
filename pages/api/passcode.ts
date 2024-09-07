// pages/api/passcode.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ passcode: process.env.NEXT_PUBLIC_PASSCODE });
}
