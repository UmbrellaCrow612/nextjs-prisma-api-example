import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      error: {
        code: 405,
        message: `Method ${method} not allowed. Please use the POST method instead.`,
      },
    });
    console.error(
      `Method ${method} not allowed on this route /api/comment/create`
    );
    return;
  }

  const { content, postId, userId }: any = req.body;

  if (!content || !postId || !userId) {
    res.status(400).json({
      error: {
        code: 400,
        message:
          "Missing content, postId or userId required parameters in request body",
      },
    });
    return;
  }

  try {
    // Check if post exists
    const postExists = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!postExists) {
      res.status(404).json({
        error: {
          code: 404,
          message: `Post with id ${postId} not found`,
        },
      });
      return;
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userExists) {
      res.status(404).json({
        error: {
          code: 404,
          message: `User with id ${userId} not found`,
        },
      });
      return;
    }

    // Create comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        Post: {
          connect: {
            id: postId,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        User: true,
        Post: true,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: `An internal server error occurred while creating a comment`,
      },
    });
  }
}
