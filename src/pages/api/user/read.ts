import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== "GET") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      error: {
        code: 405,
        message: `Method ${method} not allowed. Please use the POST method instead.`,
      },
    });
    console.error(
      `Method ${method} not allowed on this route /api/user/create`
    );
    return;
  }
}
