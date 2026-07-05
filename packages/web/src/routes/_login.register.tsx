import { authClient } from "@/lib/auth-client"
import { Button } from "@owl/lib/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@owl/lib/components/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@owl/lib/components/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@owl/lib/components/input-group"
import { Input } from "@owl/lib/components/input"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link, } from "@tanstack/react-router"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { faEye, faEyeSlash } from "@awesome.me/kit-25b3efc452/icons/utility/semibold"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export const Route = createFileRoute('/_login/register')({
    component: SignupComponent,
})


function SignupComponent() {


    return (
        <div className="w-full max-w-xs flex flex-col gap-3">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Let's get you signed up!</h2>
            <RegistrationForm />
            <p className="text-sm">Already have an account? <Link className="hover:underline text-primary" to="/login">Click here to log in!</Link></p>
        </div>
    )
}
function RegistrationForm() {
    const [showPw, setShowPw] = useState({ password: false, confirm: false })

    interface SignupFormInput {
        email: string
        name: string
        username: string
        password: string
        confirmPassword: string
    }
    // const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isValid }, watch, reset } = useForm<SignupFormInput>({ mode: "onBlur", defaultValues: { email: "jsnow@test.com", name: "Jon Snow", "username": "jsnow", "password": "password123", "confirmPassword": "password123" } })
    const onSubmit: SubmitHandler<SignupFormInput> = data => {
        if (isValid) {
            signupMutation(data);
            reset()
        } else {
            console.log(errors)
        }
    }

    // Handle username
    const { data: availableData, mutate: checkUsername, isSuccess: availableSuccess } = useMutation({
        mutationKey: ['usernameAvailable'],
        mutationFn: async () => await authClient.isUsernameAvailable({ username: watch('username') }),
    })

    // Handle sign up
    const { mutate: signupMutation } = useMutation({
        mutationKey: ['signup'],
        mutationFn: async (userdata: SignupFormInput) => await authClient.signUp.email(userdata),
        onError: () => console.log("had errors"),
        onSuccess: console.log
    })
    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input {...register("email", { required: "Email Address is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "A valid email is required" } })} type="email" aria-invalid={errors.email ? "true" : "false"}></Input>
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input {...register("name", { required: "Name is required" })} aria-invalid={errors.name ? "true" : "false"}></Input>
                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <div className="flex row space-x-1">
                        <Input {...register("username", { required: "Username is required" })} aria-invalid={errors.username ? "true" : "false"}></Input>
                        <Button variant={"outline"} type="button" disabled={watch("username") === ""} onClick={() => checkUsername()}>Check Username</Button>
                    </div>
                    {availableData?.data?.available && <FieldDescription className="text-green-700">{watch("username")} is available</FieldDescription>}
                    {availableSuccess && !availableData?.data?.available && <FieldDescription className="text-red-700">Username is not available</FieldDescription>}
                    {errors.username && <FieldError>{errors.username.message}</FieldError>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <FieldDescription>Passwords must be at least 8 characters long</FieldDescription>
                    <InputGroup>
                        <InputGroupInput {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters long" } })} autoCapitalize="off" type={showPw.password ? "text" : "password"} aria-invalid={errors.password ? "true" : "false"}></InputGroupInput>
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                onClick={() => setShowPw({ ...showPw, password: !showPw.password })}
                                size="icon-xs" aria-label={`${showPw.password ? "Show" : "Hide"} password`} title={`${showPw.password ? "Show" : "Hide"} password`}>
                                <FontAwesomeIcon icon={showPw.password ? faEyeSlash : faEye} />
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <InputGroup>
                        <InputGroupInput {...register("confirmPassword", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters long" } })} autoCapitalize="off" type={showPw.confirm ? "text" : "password"} aria-invalid={errors.confirmPassword ? "true" : "false"}></InputGroupInput>
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
                                size="icon-xs" aria-label={`${showPw.confirm ? "Show" : "Hide"} password`} title={`${showPw.confirm ? "Show" : "Hide"} password`}>
                                <FontAwesomeIcon icon={showPw.confirm ? faEyeSlash : faEye} />
                            </InputGroupButton>
                        </InputGroupAddon>

                    </InputGroup>                            {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
                </Field>
                <Button type="submit" className="w-full">Sign Up</Button>
            </FieldGroup>
        </form>
    )
}