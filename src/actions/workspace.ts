"use server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const workspaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: true,
        members: {
          include: {
            WorkSpace: true,
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (workspaces) {
      return { status: 200, workspace: workspaces };
    }
    return { status: 404 };
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return { status: 500 };
  }
};

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    // Get the workspace
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
      },
    });

    if (!workspace) {
      return { status: 404 };
    }

    // Check if user is the owner
    const isOwner = await client.user.findFirst({
      where: {
        clerkid: user.id,
        workspace: {
          some: {
            id: workspaceId,
          },
        },
      },
    });

    if (isOwner) {
      return { status: 200, data: { workspace } };
    }

    // Check if user is a member
    const isMember = await client.member.findFirst({
      where: {
        User: {
          clerkid: user.id,
        },
        workSpaceId: workspaceId,
      },
    });

    if (isMember) {
      return { status: 200, data: { workspace } };
    }

    return { status: 403 };
  } catch (error) {
    console.error("Error verifying workspace access:", error);
    return { status: 500 };
  }
};

export const getWorkspaceFolders = async (workspaceId: string) => {
  try {
    const folders = await client.folder.findMany({
      where: {
        workSpaceId: workspaceId,
      },
    });

    return { status: 200, folders };
  } catch (error) {
    console.error("Error fetching workspace folders:", error);
    return { status: 500 };
  }
};

export const getAllUserVideos = async (workspaceId: string) => {
  try {
    const videos = await client.video.findMany({
      where: {
        workSpaceId: workspaceId,
      },
    });

    return { status: 200, videos };
  } catch (error) {
    console.error("Error fetching user videos:", error);
    return { status: 500 };
  }
};
