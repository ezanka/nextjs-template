"use client";

import { Flex } from "@chakra-ui/react";
import { LuLayoutDashboard, LuSettings } from "react-icons/lu";
import { useSession } from "@/src/lib/auth-client";
import { Sidebar } from "@/src/components/layout/sidebar";
import { OrgSwitcher } from "@/src/components/layout/org-switcher";

const sidebarItems = [
    { icon: <LuLayoutDashboard />, label: "Dashboard", href: "/dashboard" },
    { icon: <LuSettings />, label: "Settings", href: "/settings" },
];

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
        <Flex minH="100vh" w="full">
            <Sidebar
                items={sidebarItems}
                header={(collapsed) => <OrgSwitcher collapsed={collapsed} />}
            />
            <Flex flex={1} direction="column" align="center" justify="center">
                {children}
            </Flex>
        </Flex>
    );
}
