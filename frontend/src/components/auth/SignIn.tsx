"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { signInSchema, typeSignInSchema } from "@/lib/schema/auth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signin } from "@/actions/auth/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignIn = ({ redirectUrl }: { redirectUrl: string }) => {
    const router = useRouter();
    const form = useForm<typeSignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: typeSignInSchema) => signin(data),

        onSuccess: (result) => {
            if (!result.success) {
                if (result.field) {
                    form.setError(result.field, {
                        type: "server",
                        message: result.message,
                    });
                    return;
                }

                if (result.token) {
                    const params = new URLSearchParams({
                        from: "login",
                        redirectTo: redirectUrl,
                        token: result.token ?? "",
                    });

                    router.push(`/auth/verification?${params.toString()}`);
                    return;
                }

                toast.error(result.message, { description: result.details, id: "login" });
                return;
            };

            toast.success(result.message ?? "Login successful!", { id: "login" });

            router.push(redirectUrl ?? "/");
        },

        onError: (error: Error) => {
            toast.error(error.message ?? "Something went wrong. Please try again.", { id: "signup" });
        },
    });

    return (
        <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="flex flex-col items-center gap-1 pb-4">
                <CardTitle className="flex flex-row items-center gap-3">
                    <span className="text-2xl font-bold tracking-tight">Home</span>
                </CardTitle>
                <CardDescription className="text-center">
                    Log in to your account to continue
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={form.handleSubmit((values) => mutate(values))}
                    className="space-y-5"
                    noValidate
                >
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-email">
                                        Email <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="login-email"
                                        type="email"
                                        placeholder="jane@example.com"
                                        autoComplete="email"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="login-password">
                                            Password <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <a
                                            href="/forgot-password"
                                            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-primary"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <Input
                                        {...field}
                                        id="login-password"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full cursor-pointer!"
                            disabled={form.formState.isSubmitting || isPending}
                        >
                            {form.formState.isSubmitting || isPending ? "Logging in…" : "Log In"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <a
                        href="/auth/signup"
                        className="font-medium underline underline-offset-2 hover:text-primary"
                    >
                        Sign up
                    </a>
                </p>
            </CardFooter>
        </Card>
    )
}

export default SignIn