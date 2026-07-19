"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { loginSchema, typeLoginSchema } from "@/lib/schema/auth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/actions/auth/log-in";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const SignIn = ({ redirectUrl }: { redirectUrl: string }) => {
    const router = useRouter();
    const form = useForm<typeLoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: typeLoginSchema) => login(data),

        onSuccess: (result) => {
            if (!result.success) {
                if (result.field) {
                    form.setError(result.field, {
                        type: "server",
                        message: result.message,
                    });
                    return;
                }

                toast.error(result.message, { id: "login" });
                return;
            };

            toast.success(result.message ?? "Login successful!", { id: "login" });

            const params = new URLSearchParams({
                from: "login",
                redirectTo: redirectUrl,
                userId: result.data?.userId ?? "",
                email: result.data?.email ?? ""
            });

            router.push(`/verification?${params.toString()}`);
        },

        onError: (error: Error) => {
            console.error("Sign-up error:", error);
            toast.error(error.message ?? "Something went wrong. Please try again.", { id: "signup" });
        },
    });

    return (
        <Card className="w-full max-w-lg shadow-lg">
            {/* ── Header ── */}
            <CardHeader className="flex flex-col items-center gap-1 pb-4">
                <CardTitle className="flex flex-row items-center gap-3">
                    <Image src="/favicon.ico" alt="Vendly Logo" width={32} height={32} />
                    <span className="text-2xl font-bold tracking-tight">Vendly</span>
                </CardTitle>
                <CardDescription className="text-center">
                    Log in to your account to continue
                </CardDescription>
            </CardHeader>

            {/* ── Form ── */}
            <CardContent>
                <form
                    onSubmit={form.handleSubmit((values) => mutate(values))}
                    className="space-y-5"
                    noValidate
                >
                    <FieldGroup>
                        {/* Email */}
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

                        {/* Password */}
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

                        {/* Submit */}
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

            {/* ── Footer ── */}
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