"use client"

import {
    Button,
    Field,
    Fieldset,
    Input,
    Link,
    Stack,
} from "@chakra-ui/react"
import { PasswordInput } from "../ui/password-input"
import { useForm } from "react-hook-form"
import { authClient } from "@/src/lib/auth-client"
import { toaster } from "@/src/components/ui/toaster"
import { useTranslations } from "@/src/i18n/context"
import { useRouter } from "next/navigation"

interface LoginFormValues {
    email: string
    password: string
}

export default function LoginForm() {
    const t = useTranslations("login")
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({ mode: "onBlur" })

    const onSubmit = handleSubmit(async (data) => {
        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        })

        if (error) {
            setError("email", {
                type: "manual",
                message:
                    error.code === "InvalidCredentials"
                        ? t("errors.invalidCredentials")
                        : error.message ?? t("errors.generic"),
            })
        } else {
            toaster.create({
                title: t("success.title"),
                description: t("success.description"),
                type: "success",
            })
            router.push("/dashboard")
        }
    })

    return (
        <form onSubmit={onSubmit}>
            <Fieldset.Root size="lg" maxW="md">
                <Stack>
                    <Fieldset.Legend>{t("title")}</Fieldset.Legend>
                    <Fieldset.HelperText>
                        {t("subtitle")}
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    <Field.Root invalid={!!errors.email} required>
                        <Field.Label>
                            {t("email")}
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            type="email"
                            {...register("email", {
                                required: t("errors.emailRequired"),
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: t("errors.emailInvalid"),
                                },
                            })}
                        />
                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password} required>
                        <Stack w="full">
                            <Field.Label>
                                {t("password")}
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <PasswordInput
                                placeholder={t("passwordPlaceholder")}
                                {...register("password", {
                                    required: t("errors.passwordRequired"),
                                    minLength: { value: 8, message: t("errors.passwordMinLength") },
                                })}
                            />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Stack>
                    </Field.Root>
                </Fieldset.Content>

                <Button type="submit" w="full" loading={isSubmitting}>
                    {t("submit")}
                </Button>

                <Fieldset.HelperText textAlign="center">
                    {t("dontHaveAccount")} <Link href="/register">{t("register")}</Link>
                </Fieldset.HelperText>
            </Fieldset.Root>
        </form>
    )
}
