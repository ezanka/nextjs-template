"use client"

import { Button } from "@chakra-ui/react";
import { useTranslations } from "@/src/i18n/context";
import { LocaleSwitcher } from "@/src/components/ui/locale-switcher";
import Link from "next/link";

export default function Home() {
    const t = useTranslations("home")

    return (
        <div className="flex flex-col flex-1 items-center justify-center font-sans">
            <div className="absolute top-4 right-4">
                <LocaleSwitcher />
            </div>
            <Button type="button" asChild>
                <Link href="/register">
                    {t("register")}
                </Link>
            </Button>
        </div>
    );
}
