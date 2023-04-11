import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    res.status(405).json({
      error: {
        code: 405,
        message: `Method ${method} not allowed. Please use the PATCH method instead.`,
      },
    });
    console.error(
      `Method ${method} not allowed on this route /api/post/update`
    );
    return;
  }

  const { id, title, thumbNail, content } = body;

  if (!id || !title || !thumbNail || !content) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Missing id, title, thumbNail or content in request body",
      },
    });
    return;
  }

  try {
    const postExists = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!postExists) {
      res.status(404).json({
        error: {
          code: 404,
          message: `Post with id ${id} not found`,
        },
      });
      return;
    }

    const updatedPost = await prisma.post.update({
      data: {
        title: title,
        thumbNail: thumbNail,
        content: content,
      },
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: `Post with id ${id} has been updated successfully`,
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Error updating post",
      },
    });
  }
}
