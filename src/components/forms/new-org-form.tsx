"use client"

import {
    Button,
    Field,
    Fieldset,
    Input,
    Stack,
} from "@chakra-ui/react"
import { useForm, useWatch } from "react-hook-form"
import { useEffect } from "react"
import { authClient } from "@/src/lib/auth-client"
import { toaster } from "@/src/components/ui/toaster"
import { useRouter } from "next/navigation"
import { useSession } from "@/src/lib/auth-client"

interface NewOrgFormValues {
    name: string,
    slug: string,
    userId: string
}

function generateSlug(name: string): string {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
}

export default function NewOrgForm() {
    const router = useRouter()
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

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<NewOrgFormValues>({ mode: "onBlur" })

    const name = useWatch({ control, name: "name" })

    useEffect(() => {
        if (name) {
            setValue("slug", generateSlug(name))
        }
    }, [name, setValue])

    const onSubmit = handleSubmit(async (formData) => {
        const { data, error } = await authClient.organization.create({
            name: formData.name,
            slug: formData.slug,
            userId: session.user.id,
        })

        if (error) {
            setError("name", {
                message: error.message ?? "Unable to create organization.",
            })
        } else if (data) {
            toaster.create({
                title: "Organization created",
                description: "Your organization has been created.",

                type: "success",
            })
            router.push("/dashboard")
        }
    })

    return (
        <form onSubmit={onSubmit}>
            <Fieldset.Root size="lg" maxW="md">
                <Stack>
                    <Fieldset.Legend>Create Organization</Fieldset.Legend>
                    <Fieldset.HelperText>
                        Please fill in the details for your new organization.
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    <Field.Root invalid={!!errors.name} required>
                        <Field.Label>
                            Organization Name
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            type="text"
                            {...register("name", {
                                required: "Organization name is required",
                            })}
                        />
                        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.slug} required>
                        <Stack w="full">
                            <Field.Label>
                                Organization Slug
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                                type="text"
                                {...register("slug", {
                                    required: "Organization slug is required",
                                })}
                            />
                            <Field.ErrorText>{errors.slug?.message}</Field.ErrorText>
                        </Stack>
                    </Field.Root>
                </Fieldset.Content>

                <Button type="submit" w="full" loading={isSubmitting}>
                    Create Organization
                </Button>
            </Fieldset.Root>
        </form>
    )
}