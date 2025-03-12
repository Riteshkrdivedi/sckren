"use server";

import { currentUser } from "@clerk/nextjs/server";
// import prisma from "@/lib/prisma";

export const authenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }
    // const existingUser = await prisma.user.findUnique({
    //   where: {
    //     email: user.emailAddresses[0].emailAddress,
    //   },
    // });

    const existingUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });
    if (existingUser) {
      return { status: 200, user };
    }
    return { status: 403 };
  } catch (error) {
    console.log(error);
  }
};
