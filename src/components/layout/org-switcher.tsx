"use client";

import { Flex, Text, Menu, Portal, Spinner, Image } from "@chakra-ui/react";
import { LuBuilding2, LuChevronDown } from "react-icons/lu";
import { authClient } from "@/src/lib/auth-client";
import Link from "next/link";

interface OrgSwitcherProps {
    collapsed?: boolean;
}

export function OrgSwitcher({ collapsed }: OrgSwitcherProps) {
    const { data: orgs, isPending: orgsLoading } =
        authClient.useListOrganizations();
    const { data: activeOrg, isPending: activeOrgLoading } =
        authClient.useActiveOrganization();

    const handleSelect = async (orgId: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (authClient.organization as any).setActiveOrganization({
            organizationId: orgId,
        });
    };

    if (orgsLoading || activeOrgLoading) {
        return (
            <Flex align="center" justify="center" py={2}>
                <Spinner size="sm" />
            </Flex>
        );
    }

    return (
        <Menu.Root positioning={{ sameWidth: true }}>
            <Menu.Trigger asChild>
                <Flex
                    as="button"
                    align="center"
                    gap={2}
                    w="full"
                    px={collapsed ? 0 : 2}
                    py={1.5}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "bg.emphasized" }}
                    transition="background 0.15s ease"
                    justify={collapsed ? "center" : "flex-start"}
                    overflow="hidden"
                >
                    <Flex
                        align="center"
                        justify="center"
                        flexShrink={0}
                        w={8}
                        h={8}
                        borderRadius="md"
                        bg="bg.emphasized"
                        color="fg.muted"
                        fontSize="md"
                    >
                        {activeOrg?.logo ? (
                            <Image
                                src={activeOrg.logo}
                                alt={activeOrg.name}
                                w="full"
                                h="full"
                                borderRadius="md"
                                objectFit="cover"
                            />
                        ) : (
                            <LuBuilding2 />
                        )}
                    </Flex>
                    {!collapsed && (
                        <>
                            <Text fontSize="sm" fontWeight="medium" truncate flex={1} textAlign="left">
                                {activeOrg?.name ?? "Select org"}
                            </Text>
                            <Flex flexShrink={0} color="fg.muted" fontSize="xs">
                                <LuChevronDown />
                            </Flex>
                        </>
                    )}
                </Flex>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        {orgs && orgs.length > 0 ? (
                            orgs.map((org) => (
                                <Menu.Item
                                    key={org.id}
                                    value={org.id}
                                    onClick={() => handleSelect(org.id)}
                                >
                                    <Flex align="center" gap={2}>
                                        <Flex
                                            align="center"
                                            justify="center"
                                            flexShrink={0}
                                            w={6}
                                            h={6}
                                            borderRadius="sm"
                                            bg="bg.emphasized"
                                            color="fg.muted"
                                            fontSize="xs"
                                        >
                                            {org.logo ? (
                                                <Image
                                                    src={org.logo}
                                                    alt={org.name}
                                                    w="full"
                                                    h="full"
                                                    borderRadius="sm"
                                                    objectFit="cover"
                                                />
                                            ) : (
                                                <LuBuilding2 />
                                            )}
                                        </Flex>
                                        <Text
                                            fontSize="sm"
                                            fontWeight={activeOrg?.id === org.id ? "semibold" : "normal"}
                                        >
                                            {org.name}
                                        </Text>
                                    </Flex>
                                </Menu.Item>
                            ))
                        ) : (
                            <Flex px={3} py={2} w="full" textAlign="center">
                                <Text fontSize="sm" color="fg.muted">
                                    No organizations
                                </Text>
                            </Flex>
                        )}
                        <Menu.Item value="new-org">
                            <Text fontSize="sm" color="fg.accent">
                                <Link href="/orgs/new">
                                    Create new organization
                                </Link>
                            </Text>
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
}
