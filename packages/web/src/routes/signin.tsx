import { authClient } from "@/lib/auth-client"
import { faEye, faEyeSlash } from "@awesome.me/kit-25b3efc452/icons/utility/semibold"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@owl/lib/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@owl/lib/components/card"
import { Field, FieldGroup, FieldLabel } from "@owl/lib/components/field"
import { Input } from "@owl/lib/components/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@owl/lib/components/input-group"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

export const Route = createFileRoute('/signin')({
    component: SignInComponent,
})

function SignInComponent() {
    interface SigninFormInterface {
        username: string,
        password: string
    }
    const [showPw, setShowPw] = useState(false)
    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<SigninFormInterface>({ mode: "onBlur", defaultValues: { "username": "jsnow", "password": "password123" } })
    const onSubmit: SubmitHandler<SigninFormInterface> = data => {
        if (isValid) {
            signInMutation(data)
            reset()
        } else {
            console.log(errors)
        }
    }

    const { mutate: signInMutation } = useMutation({
        mutationKey: ['signup'],
        mutationFn: async (userdata: SigninFormInterface) => await authClient.signIn.username(userdata),
        onError: () => console.log("had errors"),
        onSuccess: console.log
    })
    return (
        <Card className="w-full max-w-sm my-8 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input {...register("username")}></Input>
                        </Field>
                        <Field>
                            <div className="flex items-center"><FieldLabel htmlFor="password">Password</FieldLabel>
                                <a href="#" className="ml-auto text-primary inline-block underline-offset-4 hover:underline" >
                                    Forgot your password?
                                </a></div>
                            <InputGroup>
                                <InputGroupInput {...register("password")} autoCapitalize="off" type={showPw ? "text" : "password"} aria-invalid={errors.password ? "true" : "false"}></InputGroupInput>
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        onClick={() => setShowPw(!showPw)}
                                        size="icon-xs" aria-label={`${showPw ? "Show" : "Hide"} password`} title={`${showPw ? "Show" : "Hide"} password`}>
                                        <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Button type="submit" className="w-full">Sign In</Button>
                    </FieldGroup>
                </CardContent>

            </form>
        </Card>
    )
}