"use client";

import { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { LuLayoutDashboard, LuSettings } from "react-icons/lu";
import { useSession } from "@/src/lib/auth-client";
import { Sidebar, SidebarTrigger } from "@/src/components/layout/sidebar";
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
    const [collapsed, setCollapsed] = useState(false);

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
                collapsed={collapsed}
                header={(collapsed) => <OrgSwitcher collapsed={collapsed} />}
            />
            <Flex flex={1} direction="column">
                <Flex px={4} py={2} h="64px" borderBottomWidth="1px" borderColor="border" align="center">
                    <SidebarTrigger collapsed={collapsed} setCollapsed={setCollapsed} />
                </Flex>
                <Flex flex={1} direction="column" align="center" justify="center">
                    {children}
                </Flex>
            </Flex>
        </Flex>
    );
}
