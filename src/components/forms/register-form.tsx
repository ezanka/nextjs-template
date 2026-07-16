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
                        ? "An account with this email already exists."
                        : error.message ?? "Failed to create account.",
            })
        } else {
            toaster.create({
                title: "Account created",
                description: "Your account has been created successfully. Please check your email to confirm your account.",
                type: "success",
            })
        }
    })

    return (
        <form onSubmit={onSubmit}>
            <Fieldset.Root size="lg" maxW="md">
                <Stack>
                    <Fieldset.Legend>Register</Fieldset.Legend>
                    <Fieldset.HelperText>
                        Please fill in the fields below to create an account.
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    <Field.Root invalid={!!errors.username} required>
                        <Field.Label>
                            Name
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            {...register("username", {
                                required: "Le nom est requis",
                                minLength: { value: 2, message: "2 caractères minimum" },
                            })}
                        />
                        <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.email} required>
                        <Field.Label>
                            Email address
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            type="email"
                            {...register("email", {
                                required: "L'email est requis",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Format d'email invalide",
                                },
                            })}
                        />
                        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password} required>
                        <Stack w="full">
                            <Field.Label>
                                Password
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <PasswordInput
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Le mot de passe est requis",
                                    minLength: { value: 8, message: "8 caractères minimum" },
                                })}
                            />
                            <PasswordStrengthMeter value={strength} />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Stack>
                    </Field.Root>
                </Fieldset.Content>

                <Button type="submit" w="full" loading={isSubmitting}>
                    Register
                </Button>

                <Fieldset.HelperText textAlign="center">
                    Already have an account? <Link href="/login">Login</Link>
                </Fieldset.HelperText>
            </Fieldset.Root>
        </form>
    )
}