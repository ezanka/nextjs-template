"use client"

import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react"
import { LocaleProvider as ChakraLocaleProvider } from "@chakra-ui/react"
import fr from "./locales/fr.json"
import en from "./locales/en.json"

export type Locale = "fr" | "en"

const dictionaries: Record<Locale, Record<string, unknown>> = { fr, en }

interface I18nContextValue {
    locale: Locale
    setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : undefined
}

function setCookie(name: string, value: string, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
}

const chakraLocales: Record<Locale, string> = {
    fr: "fr-FR",
    en: "en-US",
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const cookie = getCookie("locale")
        return cookie === "en" ? "en" : "fr"
    })

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale)
        setCookie("locale", newLocale)
        document.documentElement.lang = newLocale
    }, [])

    return (
        <I18nContext.Provider value={{ locale, setLocale }}>
            <ChakraLocaleProvider locale={chakraLocales[locale]}>
                {children}
            </ChakraLocaleProvider>
        </I18nContext.Provider>
    )
}

export function useLocale() {
    const ctx = useContext(I18nContext)
    if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
    return ctx
}

function resolve(obj: Record<string, unknown>, path: string): string {
    const keys = path.split(".")
    let current: unknown = obj
    for (const key of keys) {
        if (current == null || typeof current !== "object") return path
        current = (current as Record<string, unknown>)[key]
    }
    return typeof current === "string" ? current : path
}

export function useTranslations(namespace?: string) {
    const { locale } = useLocale()
    const dictionary = dictionaries[locale]

    const t = useCallback(
        (key: string) => {
            const fullKey = namespace ? `${namespace}.${key}` : key
            return resolve(dictionary, fullKey)
        },
        [dictionary, namespace],
    )

    return t
}
