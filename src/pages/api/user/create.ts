import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== "POST") {
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

  const { username, password } = body;

  if (!username || !password) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Missing username and/or password in request body",
      },
    });
    return;
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      res.status(409).json({
        error: {
          code: 409,
          message: `Username "${username}" already exists`,
        },
      });
      return;
    }

    const user = await prisma.user.create({ data: { username, password } });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Error creating user",
      },
    });
  }
}
