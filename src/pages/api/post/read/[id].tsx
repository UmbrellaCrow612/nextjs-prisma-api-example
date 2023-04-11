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
      `Method ${method} not allowed on this route /api/post/read/[id]`
    );
    return;
  }

  const { id }: any = req.query;

  if (!id) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Missing id in request url",
      },
    });
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      res.status(404).json({
        error: {
          code: 404,
          message: `Post with id ${id} not found`,
        },
      });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: `An internal server error occurred while fetching the post with id ${id}`,
      },
    });
  }
}
