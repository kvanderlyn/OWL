import { Button } from "@owl/lib/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@owl/lib/components/card"
import { Field, FieldGroup, FieldLabel } from "@owl/lib/components/field"
import { Input } from "@owl/lib/components/input"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute('/signin')({
    component: SignInComponent,
})

function SignInComponent() {

    function handleSubmit(formdata: FormData) {
        console.log(formdata)
    }
    return (
        <Card className="w-full max-w-sm my-8 mx-auto">
            <form action={handleSubmit}>
                <CardHeader className="mb-4">
                    <CardTitle>
                        Let's sign you in!
                    </CardTitle>
                    <CardDescription>
                        Enter your email and password below to sign into your account. Don't have an account? <Link to="/signup" className="ml-auto inline-block text-primary underline-offset-4 hover:underline">Click here to register.</Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="text" name="Email"></Input>
                        </Field>
                        <Field>
                            <div className="flex items-center"><FieldLabel htmlFor="password">Password</FieldLabel>
                                <a href="#" className="ml-auto text-primary inline-block underline-offset-4 hover:underline" >
                                    Forgot your password?
                                </a></div>
                            <Input id="password" type="password" name="password"></Input>
                        </Field>
                        <Button type="submit" className="w-full">Sign In</Button>
                    </FieldGroup>
                </CardContent>

            </form>
        </Card>
    )
}