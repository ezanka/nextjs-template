"use client"

import { Button, HStack } from "@chakra-ui/react"
import { useLocale, type Locale } from "@/src/i18n/context"

const locales: { value: Locale; label: string }[] = [
    { value: "fr", label: "FR" },
    { value: "en", label: "EN" },
]

export function LocaleSwitcher() {
    const { locale, setLocale } = useLocale()

    return (
        <HStack gap="1">
            {locales.map((l) => (
                <Button
                    key={l.value}
                    size="xs"
                    variant={locale === l.value ? "solid" : "ghost"}
                    onClick={() => setLocale(l.value)}
                >
                    {l.label}
                </Button>
            ))}
        </HStack>
    )
}
