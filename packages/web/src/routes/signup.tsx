import { Button } from "@owl/lib/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@owl/lib/components/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@owl/lib/components/field"
import { Input } from "@owl/lib/components/input"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute('/signup')({
    component: SignupComponent,
})


function SignupComponent() {

    function handleSubmit(formdata: FormData) {
        console.log(formdata)
    }
    return (
        <Card className="w-full max-w-sm my-8 mx-auto">
            <form action={handleSubmit}>
                <CardHeader className="mb-4">
                    <CardTitle>
                        Let's sign you up!
                    </CardTitle>
                    <CardDescription>
                        Enter your email and a password below to make a new account. Already have an account? <Link to="/signin" className="ml-auto inline-block text-primary underline-offset-4 hover:underline">Click here to sign in.</Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="text" name="email"></Input>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <FieldDescription>Passwords must be at least 8 characters long and contain both letters and numbers</FieldDescription>
                            <Input id="password" type="password" name="password"></Input>
                        </Field>
                        <Button type="submit" className="w-full">Sign Up</Button>
                    </FieldGroup>
                </CardContent>

            </form>
        </Card>
    )
}