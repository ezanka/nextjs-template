"use client"

import {
    Button,
    Field,
    Fieldset,
    Input,
    Link,
    Stack,
} from "@chakra-ui/react"
import { PasswordInput, PasswordStrengthMeter } from "../ui/password-input"
import { type Options, passwordStrength } from "check-password-strength"
import { useForm } from "react-hook-form"
import { useMemo } from "react"
import { authClient } from "@/src/lib/auth-client"
import { toaster } from "@/src/components/ui/toaster"
import { useTranslations } from "@/src/i18n/context"

interface RegisterFormValues {
    username: string
    email: string
    password: string
}

const strengthOptions: Options<string> = [
    { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
    { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
    { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
    { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
]

export default function RegisterForm() {
    const t = useTranslations("register")
    const tPassword = useTranslations("passwordStrength")

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({ mode: "onBlur" })

    const password = watch("password")

    const strength = useMemo(() => {
        if (!password) return 0
        return passwordStrength(password, strengthOptions).id
    }, [password])

    const onSubmit = handleSubmit(async (data) => {
        const { error } = await authClient.signUp.email({
            name: data.username,
            email: data.email,
            password: data.password,
        })

        if (error) {
            setError("email", {
                type: "manual",
                message:
                    error.code === "USER_ALREADY_EXISTS"
                        ? t("errors.userAlreadyExists")
                        : error.message ?? t("errors.generic"),
            })
        } else {
            toaster.create({
                title: t("success.title"),
                description: t("success.description"),
                type: "success",
            })
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
                    <Field.Root invalid={!!errors.username} required>
                        <Field.Label>
                            {t("name")}
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            {...register("username", {
                                required: t("errors.nameRequired"),
                                minLength: { value: 2, message: t("errors.nameMinLength") },
                            })}
                        />
                        <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                    </Field.Root>

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
                            <PasswordStrengthMeter
                                value={strength}
                                strengthLabels={{
                                    low: tPassword("low"),
                                    medium: tPassword("medium"),
                                    high: tPassword("high"),
                                }}
                            />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Stack>
                    </Field.Root>
                </Fieldset.Content>

                <Button type="submit" w="full" loading={isSubmitting}>
                    {t("submit")}
                </Button>

                <Fieldset.HelperText textAlign="center">
                    {t("alreadyHaveAccount")} <Link href="/login">{t("login")}</Link>
                </Fieldset.HelperText>
            </Fieldset.Root>
        </form>
    )
}
