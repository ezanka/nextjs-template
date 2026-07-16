"use client";

import { useSession } from "@/src/lib/auth-client";

export default function LogedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return null;
    }

    if (!session?.user?.id) {
        return (
            <div className="min-h-screen flex flex-col w-full items-center justify-center">
                <p>You are not logged in.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col w-full items-center justify-center">
            {children}
        </div>
    );
}
