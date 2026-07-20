"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail, RotateCcw, ShieldCheck } from "lucide-react";
import { verifyEmail, resendOtp } from "@/actions/auth/verify-email";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

interface EmailVerificationProps {
    from: string;
    redirectTo: string;
    token: string;
    email: string;
}

export default function EmailVerification({
    from,
    redirectTo,
    token,
    email,
}: EmailVerificationProps) {
    const router = useRouter();

    const [otp, setOtp] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    if (!token) {
        router.push("/auth/signin");
    };

    // Cooldown Timer to Resend OTP
    function startCooldown() {
        setCooldown(RESEND_COOLDOWN);
        intervalRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    useEffect(() => () => clearInterval(intervalRef.current!), []);

    // Verify OTP mutation
    const { mutate: verify, isPending: isVerifying } = useMutation({
        mutationFn: () => verifyEmail({ token, otp }),
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.message);
                setOtp(""); // clear OTP on failure
                return;
            }
            toast.success(result.message ?? "Email verified successfully!");
            router.push(redirectTo);
        },
        onError: () => {
            toast.error("Something went wrong. Please try again.");
            setOtp("");
        },
    });

    // Resend OTP mutation
    const { mutate: resend, isPending: isResending } = useMutation({
        mutationFn: () => resendOtp({ token }),
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success("A new OTP has been sent to your email.");
            startCooldown();
        },
        onError: () => {
            toast.error("Failed to resend OTP. Please try again.");
        },
    });

    // Auto-verify when OTP is fully entered
    useEffect(() => {
        if (otp.length === OTP_LENGTH) {
            verify();
        }
    }, [otp]);

    // Handle "Back to Login/Sign Up" navigation
    function handleBack() {
        router.push(from === "signin" ? "/auth/signin" : "/auth/signup");
    }

    // Utility to mask email for privacy
    function maskEmail(email: string) {
        const [user, domain] = email.split("@");
        if (!user || !domain) return email;
        const visible = user.slice(0, 2);
        const masked = "*".repeat(Math.max(user.length - 2, 3));
        return `${visible}${masked}@${domain}`;
    }

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="flex flex-col items-center gap-3 pb-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-7 w-7" />
                </div>

                <div className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Verify your email
                    </CardTitle>
                    <CardDescription className="text-sm">
                        We sent a {OTP_LENGTH}-digit code to{" "}
                        <span className="font-medium text-foreground">
                            {email ? maskEmail(email) : "your email"}
                        </span>
                        . Enter it below to continue.
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-6 pt-6">
                <InputOTP
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={setOtp}
                    disabled={isVerifying}
                >
                    <InputOTPGroup className="gap-2">
                        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                            <InputOTPSlot
                                key={i}
                                index={i}
                                className="h-12 w-12 rounded-md border text-center text-lg font-semibold transition-all focus:ring-2 focus:ring-primary"
                            />
                        ))}
                    </InputOTPGroup>
                </InputOTP>

                {otp.length > 0 && otp.length < OTP_LENGTH && (
                    <Button
                        className="w-full"
                        onClick={() => verify()}
                        disabled={otp.length < OTP_LENGTH || isVerifying}
                    >
                        {isVerifying ? "Verifying…" : "Verify Email"}
                    </Button>
                )}

                {isVerifying && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Verifying your code…
                    </p>
                )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-6">
                <div className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Didn&apos;t receive the code?</span>
                    <button
                        onClick={() => resend()}
                        disabled={cooldown > 0 || isResending}
                        className="flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RotateCcw className="h-3 w-3" />
                        {isResending
                            ? "Sending…"
                            : cooldown > 0
                                ? `Resend in ${cooldown}s`
                                : "Resend"}
                    </button>
                </div>

                <Separator />

                <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to {from === "login" ? "Login" : "Sign Up"}
                </button>
            </CardFooter>
        </Card>
    );
}