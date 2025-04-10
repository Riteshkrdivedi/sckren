"use server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
  try {
    console.log("Starting authentication process");
    const user = await currentUser();
    console.log(
      "Current user from Clerk:",
      user ? "User found" : "No user found"
    );

    if (!user) {
      console.log("No user found, returning 403");
      return { status: 403 };
    }

    console.log("Looking for existing user in database");
    const existingUser = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    });

    if (existingUser) {
      console.log("Existing user found, returning 200");
      return { status: 200, user: existingUser };
    }

    console.log("Creating new user in database");
    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (newUser) {
      console.log("New user created, returning 201");
      return { status: 201, user: newUser };
    }

    console.log("Failed to create user, returning 400");
    return { status: 400 };
  } catch (error) {
    console.error("Error in authentication:", error);
    return { status: 500 };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const notifications: any = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });
    if (notifications && notifications?.length > 0)
      return { status: 200, data: notifications };
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 403, data: error };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { lastname: { contains: query } },
          { email: { contains: query } },
        ],
        NOT: [{ clerkid: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    });

    if (users.length > 0 && users) return { status: 200, data: users };
    return { status: 404, data: undefined };
  } catch (error) {
    return { status: 403, error: error };
  }
};

export const getMySolutionNotifications = async (userId?: string) => {
  try {
    const notifications = await client.notification.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        content: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            id: true,
          },
        },
        userId: true,
      },
    });
  } catch (error) {
    return { status: 403, data: error };
  }
};
