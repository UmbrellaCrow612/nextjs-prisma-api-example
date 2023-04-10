import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({
      error: {
        code: 405,
        message: `Method ${method} not allowed. Please use the GET method instead.`,
      },
    });
    console.error(
      `Method ${method} not allowed on this route /api/user/read/username/[username]`
    );
    return;
  }

  const { username }: any = req.query;

  if (!username) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Missing username in request url",
      },
    });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id:true,
        username: true,
        posts: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: {
          code: 404,
          message: `User with username "${username}" not found`,
        },
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: {
        code: 500,
        message: "Error fetching user",
      },
    });
  }
}
