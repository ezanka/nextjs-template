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
import { useRouter } from "next/navigation"

interface LoginFormValues {
    email: string
    password: string
}

export default function LoginForm() {
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
                        ? "Invalid credentials."
                        : error.message ?? "Unable to log in.",
            })
        } else {
            toaster.create({
                title: "Login successful",
                description: "You are now logged in to your account.",
                type: "success",
            })
            router.push("/dashboard")
        }
    })

    return (
        <form onSubmit={onSubmit}>
            <Fieldset.Root size="lg" maxW="md">
                <Stack>
                    <Fieldset.Legend>Login</Fieldset.Legend>
                    <Fieldset.HelperText>
                        Please log in to your account.
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    <Field.Root invalid={!!errors.email} required>
                        <Field.Label>
                            Email address
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email format",
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
                                    required: "Password is required",
                                    minLength: { value: 8, message: "8 characters minimum" },
                                })}
                            />
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Stack>
                    </Field.Root>
                </Fieldset.Content>

                <Button type="submit" w="full" loading={isSubmitting}>
                    Log in
                </Button>

                <Fieldset.HelperText textAlign="center">
                    Don&apos;t have an account? <Link href="/register">Register</Link>
                </Fieldset.HelperText>
            </Fieldset.Root>
        </form>
    )
}
