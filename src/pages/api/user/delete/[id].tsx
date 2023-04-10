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
      `Method ${method} not allowed on this route /api/user/delete`
    );
    return;
  }

  const { id }: any = req.query;

  if (!id) {
    res.status(400).json({
      error: {
        code: 400,
        message: "Missing user id in request url",
      },
    });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        error: {
          code: 404,
          message: `User with id ${id} not found`,
        },
      });
      return;
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: `User with id ${id} has been deleted successfully`,
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Error deleting user",
      },
    });
  }
}
