import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  if (method === "POST") {
    // Handle the POST request
  } else {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Allow", "POST");
    res.status(405).json({
      error: {
        code: 405,
        message: `Method ${method} not allowed`,
      },
    });
  }
}
