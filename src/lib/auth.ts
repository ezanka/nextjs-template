import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
    plugins: [
        organization()
    ],
    secret: process.env.BETTER_AUTH_SECRET as string,
    baseUrl: process.env.BETTER_AUTH_URL as string,
});
