"use client";

import { authClient, useSession } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    if (isPending) {
        return null;
    }

    async function handleSignOut() {
        await authClient.signOut()
        router.push("/login")
    }

    return (
        <>
            <div className="min-h-screen flex flex-col w-full items-center justify-center">
                <p>{session?.user?.name}</p>
                <Button onClick={handleSignOut}>
                    Sign Out
                </Button>
            </div>
        </>

    )
}