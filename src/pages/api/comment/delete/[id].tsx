import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    res.status(405).json({
      error: {
        code: 405,
        message: `Method ${method} not allowed. Please use the DELETE method instead.`,
      },
    });
    console.error(
      `Method ${method} not allowed on this route /api/comment/[id]`
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

    await prisma.comment.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      success: {
        code: 200,
        message: `Comment with id ${id} has been deleted successfully`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: `An internal server error occurred while deleting the comment with id ${id}`,
      },
    });
  }
}
