import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== "PATCH") {
    res.status(405).json({
      error: {
        code: 405,
        message: `Method ${method} not allowed. Please use the PATCH method instead.`,
      },
    });
    console.error(
      `Method ${method} not allowed on this route /api/user/update`
    );
    return;
  }

  const { id, username } = body;

  if (!username || !id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Missing username or id in request body",
      },
    });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userExists) {
      res.status(404).json({
        error: {
          code: 404,
          message: `User with id ${id} not found`,
        },
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
      },
      select: {
        username: true,
      },
    });

    res.status(200).json({
      message: `User with id ${id} has been updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Error updating user",
      },
    });
  }
}
