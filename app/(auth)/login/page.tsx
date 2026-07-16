
import LoginForm from "@/src/components/forms/login-form";
import { Card } from "@chakra-ui/react"

export default function Loginpage() {

    return (
        <Card.Root w="full" maxW="md">
            <Card.Body>
                <LoginForm />
            </Card.Body>
        </Card.Root>
    )
}