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
      `Method ${method} not allowed on this route /api/post/create`
    );
    return;
  }

  const { title, thumbNail, content, userId }: any = body;

  if (!title || !thumbNail || !content || !userId) {
    res.status(400).json({
      error: {
        code: 400,
        message: `Missing one or more of the following fields in request body: title, thumbNail, content, userId`,
      },
    });
    return;
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      res.status(400).json({
        error: {
          code: 400,
          message: `User with id ${userId} does not exist`,
        },
      });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        title: title,
        thumbNail: thumbNail,
        content: content,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json({
      message: `Post with id ${newPost.id} has been created successfully`,
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Error creating post",
      },
    });
  }
}
