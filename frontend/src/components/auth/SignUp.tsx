"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { signUpSchema, typeSignUpSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { signup } from "@/actions/auth/sign-up";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUp({ redirectUrl }: { redirectUrl: string }) {
    const router = useRouter();
    const form = useForm<typeSignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            privacyPolicy: false,
            newsletterOptIn: false,
        },
        mode: "onTouched",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: typeSignUpSchema) => signup(data),

        onSuccess: (result) => {
            if (!result.success) {
                if (result.field) {
                    form.setError(result.field, {
                        type: "server",
                        message: result.message,
                    });
                    return;
                }

                toast.error(result.message, { id: "signup" });
                return;
            };

            toast.success(result.message ?? "Account created successfully!", { id: "signup" });

            const params = new URLSearchParams({
                from: "signup",
                redirectTo: redirectUrl,
                token: result?.token ?? "",
            });

            router.push(`/auth/verification?${params.toString()}`);
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
                    Create your account to get started
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={form.handleSubmit((values) => mutate(values))}
                    className="space-y-5"
                    noValidate
                >
                    <FieldGroup>
                        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4 sm:gap-2">
                            <Controller
                                name="firstName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="signup-firstName">
                                            First Name <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="signup-firstName"
                                            placeholder="Jane"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="lastName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="signup-lastName">
                                            Last Name{" "}
                                            <span className="text-muted-foreground text-xs font-normal">
                                                (optional)
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="signup-lastName"
                                            placeholder="Doe"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signup-email">
                                        Email <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="signup-email"
                                        type="email"
                                        placeholder="jane@example.com"
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
                                    <FieldLabel htmlFor="signup-password">
                                        Password <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="signup-password"
                                        type="password"
                                        placeholder="••••••••"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="signup-confirmPassword">
                                        Confirm Password{" "}
                                        <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="signup-confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <hr className="border-border" />

                        <Controller
                            name="privacyPolicy"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    orientation="horizontal"
                                    data-invalid={fieldState.invalid}
                                    className="items-center"
                                >
                                    <Checkbox
                                        id="signup-privacyPolicy"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <div className="space-y-1 leading-none">
                                        <FieldLabel
                                            htmlFor="signup-privacyPolicy"
                                            className="flex flex-wrap cursor-pointer items-center gap-1 font-normal"
                                        >
                                            I agree to the
                                            <Link target="_blank" href="/privacy" className="text-primary">
                                                privacy policies,
                                            </Link>
                                            <Link target="_blank" href="/data-usage" className="text-primary">
                                                usage,
                                            </Link>
                                            and
                                            <Link target="_blank" href="/guidelines" className="text-primary">
                                                guidelines
                                            </Link>
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </div>
                                </Field>
                            )}
                        />

                        <Controller
                            name="newsletterOptIn"
                            control={form.control}
                            render={({ field }) => (
                                <Field orientation="horizontal" className="items-center text-muted-foreground">
                                    <Checkbox
                                        id="signup-newsletterOptIn"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <FieldLabel
                                        htmlFor="signup-newsletterOptIn"
                                        className="cursor-pointer font-normal p-0!"
                                    >
                                        Receive notifications for newsletters, updates, and events
                                    </FieldLabel>
                                </Field>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full cursor-pointer!"
                            disabled={form.formState.isSubmitting || isPending}
                        >
                            {form.formState.isSubmitting || isPending ? "Creating account…" : "Create Account"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="font-medium text-primary">
                        Log in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}