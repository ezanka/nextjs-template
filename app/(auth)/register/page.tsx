
import RegisterForm from "@/src/components/forms/register-form";
import { Card } from "@chakra-ui/react"

export default function RegisterPage() {

    return (
        <Card.Root w="full" maxW="md">
            <Card.Body>
                <RegisterForm />
            </Card.Body>
        </Card.Root>
    )
}