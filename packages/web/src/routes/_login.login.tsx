import { faEye, faEyeSlash } from "@awesome.me/kit-25b3efc452/icons/utility/semibold";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@owl/lib/components/button";
import { Field, FieldGroup, FieldLabel } from "@owl/lib/components/field";
import { Input } from "@owl/lib/components/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@owl/lib/components/input-group";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { router } from "../router";

const fallback = "/dashboard";

export const Route = createFileRoute("/_login/login")({
      component: LogInComponent,
      validateSearch: z.object({
            redirect: z.string().optional().catch(""),
      }),
      beforeLoad: ({ context, search }) => {
            const isLoggedIn = context.auth.token ? true : false;

            if (isLoggedIn) {
                  console.log("redirecting");
                  throw redirect({ to: search.redirect || fallback });
            }
      },
});

function LogInComponent() {
      return (
            <div className="w-full max-w-xs flex flex-col gap-3">
                  <title>OWL - Log In</title>

                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Let's get you logged in!</h2>
                  <LoginForm />
                  <p className="text-sm">
                        Don't have an account?{" "}
                        <Link className="hover:underline text-primary" to="/register">
                              Click here to make one!
                        </Link>
                  </p>
            </div>
      );
}

function LoginForm() {
      interface SigninFormInterface {
            username: string;
            password: string;
      }
      const [showPw, setShowPw] = useState(false);
      const navigate = Route.useNavigate();
      const search = Route.useSearch();

      const {
            register,
            handleSubmit,
            formState: { errors, isValid },
            reset,
      } = useForm<SigninFormInterface>({
            mode: "onBlur",
            defaultValues: { username: "snoman", password: "password123" },
      });
      const onSubmit: SubmitHandler<SigninFormInterface> = (data) => {
            if (isValid) {
                  signInMutation(data);
                  reset();
            } else {
                  console.log(errors);
            }
      };

      const { login } = useAuthStore();

      const { mutate: signInMutation } = useMutation({
            mutationKey: ["signup"],
            mutationFn: async (userdata: SigninFormInterface) => login(userdata),
            onSuccess: () => {
                  router.invalidate();
                  navigate({ to: search.redirect || fallback });
            },
      });
      return (
            <form onSubmit={handleSubmit(onSubmit)}>
                  <FieldGroup>
                        <Field>
                              <FieldLabel htmlFor="username">Username</FieldLabel>
                              <Input {...register("username")}></Input>
                        </Field>
                        <Field>
                              <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    {/* <a href="#" className="ml-auto text-primary inline-block underline-offset-4 hover:underline" >
                                        Forgot your password?
                                    </a> */}
                              </div>
                              <InputGroup>
                                    <InputGroupInput
                                          {...register("password")}
                                          autoCapitalize="off"
                                          type={showPw ? "text" : "password"}
                                          aria-invalid={errors.password ? "true" : "false"}
                                    ></InputGroupInput>
                                    <InputGroupAddon align="inline-end">
                                          <InputGroupButton
                                                onClick={() => setShowPw(!showPw)}
                                                size="icon-xs"
                                                aria-label={`${showPw ? "Show" : "Hide"} password`}
                                                title={`${showPw ? "Show" : "Hide"} password`}
                                          >
                                                <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} />
                                          </InputGroupButton>
                                    </InputGroupAddon>
                              </InputGroup>
                        </Field>
                        <Button type="submit" className="w-full">
                              Log In
                        </Button>
                  </FieldGroup>
            </form>
      );
}
