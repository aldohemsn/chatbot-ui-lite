// pages/api/passcode.ts
export default function handler(req, res) {
  res.status(200).json({ passcode: process.env.NEXT_PUBLIC_PASSCODE });
}
