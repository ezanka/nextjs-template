"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { Tooltip } from "@/src/components/ui/tooltip";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";

export interface SidebarItem {
    icon: React.ReactElement;
    label: string;
    href: string;
}

export interface SidebarProps {
    items: SidebarItem[];
    collapsed: boolean;
    header?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
    footer?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
}

export function Sidebar({ items, collapsed, header, footer }: SidebarProps) {
    const pathname = usePathname();

    const headerContent = typeof header === "function" ? header(collapsed) : header;
    const footerContent = typeof footer === "function" ? footer(collapsed) : footer;

    return (
        <Flex
            as="nav"
            direction="column"
            h="100vh"
            position="sticky"
            top={0}
            w={collapsed ? "64px" : "240px"}
            minW={collapsed ? "64px" : "240px"}
            bg="bg.subtle"
            borderRightWidth="1px"
            borderColor="border"
            transition="width 0.2s ease, min-width 0.2s ease"
            overflow="hidden"
        >
            {headerContent && (
                <Box px={2} py={3} h="64px" borderBottomWidth="1px" borderColor="border">
                    {headerContent}
                </Box>
            )}

            <Flex direction="column" flex={1} gap={1} p={2} overflowY="auto">
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                    const linkContent = (
                        <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                            <Flex
                                align="center"
                                gap={3}
                                px={3}
                                py={2}
                                borderRadius="md"
                                fontWeight={isActive ? "semibold" : "normal"}
                                bg={isActive ? "bg.emphasized" : "transparent"}
                                color={isActive ? "fg" : "fg.muted"}
                                _hover={{ bg: "bg.emphasized", color: "fg" }}
                                transition="background 0.15s ease, color 0.15s ease"
                                overflow="hidden"
                                whiteSpace="nowrap"
                            >
                                <Box flexShrink={0} fontSize="lg">
                                    {item.icon}
                                </Box>
                                {!collapsed && <Text fontSize="sm">{item.label}</Text>}
                            </Flex>
                        </Link>
                    );

                    if (collapsed) {
                        return (
                            <Tooltip key={item.href} content={item.label} positioning={{ placement: "right" }}>
                                {linkContent}
                            </Tooltip>
                        );
                    }

                    return linkContent;
                })}
            </Flex>

            {footerContent && (
                <Box px={2} py={3} h="64px" borderTopWidth="1px" borderColor="border">
                    {footerContent}
                </Box>
            )}

        </Flex>
    );
}

export function SidebarTrigger({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (collapsed: boolean) => void }) {
    return (
        <IconButton
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
        >
            {collapsed ? <LuChevronsRight /> : <LuChevronsLeft />}
        </IconButton>
    );
}