import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session;
}

export const getUser = async () => {
    const session = await getSession();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    return user;
};