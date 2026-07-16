"use client"

import { Button } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center font-sans">
            <Button type="button" asChild>
                <Link href="/register">
                    Register
                </Link>
            </Button>
        </div>
    );
}
