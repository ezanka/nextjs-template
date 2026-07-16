"use client";

import { useSession } from "@/src/lib/auth-client";
import { useTranslations } from "@/src/i18n/context";

export default function LogedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, isPending } = useSession();
    const t = useTranslations("loged");

    if (isPending) {
        return null;
    }

    if (!session?.user?.id) {
        return (
            <div className="min-h-screen flex flex-col w-full items-center justify-center">
                <p>{t("notLoggedIn")}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col w-full items-center justify-center">
            {children}
        </div>
    );
}
