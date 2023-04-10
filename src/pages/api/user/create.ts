import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { username, password } = req.body;

  if (method === "POST") {
    if (!username || !password) {
      res.status(400).json({
        error: {
          code: 400,
          message: "Missing username and or password in request body",
        },
      });
    } else {
      res.status(200).json({ created: `${username} + ${password}` });
    }
  } else {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Allow", "POST");
    res.status(405).json({
      error: {
        code: 405,
        message: `Method ${method} not allowed. Please use the POST method instead.`,
      },
    });
    console.error(
      `Method ${method} not allowed on this route /api/user/create `
    );
  }
}
