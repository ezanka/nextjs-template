
import { Card } from "@chakra-ui/react"
import NewOrgForm from "@/src/components/forms/new-org-form"

export default function NewOrgPage() {

    return (
        <Card.Root w="full" maxW="md">
            <Card.Body>
                <NewOrgForm />
            </Card.Body>
        </Card.Root>
    )
}