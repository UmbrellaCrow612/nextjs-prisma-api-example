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
      `Method ${method} not allowed on this route /api/comment/update`
    );
    return;
  }

  const { id, content }: any = body;

  if (!id || !content) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Missing id or content in request body",
      },
    });
    return;
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: id,
      },
    });

    if (!comment) {
      res.status(404).json({
        error: {
          code: 404,
          message: `Comment with id ${id} not found`,
        },
      });
      return;
    }

    await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        content: content,
      },
    });

    res.status(200).json({
      success: {
        code: 200,
        message: `Comment with id ${id} has been updated successfully`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: `An internal server error occurred while updating the comment with id ${id}`,
      },
    });
  }
}
