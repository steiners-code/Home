"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const ForgotPassword = () => {
    const router = useRouter()
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">Feature Coming Soon...</h1>
            <p className="text-muted-foreground">&#40;My university classes started and I am a bit busy trying to get some clients... ; &#41;&#41;</p>
            <Button
                variant="default"
                onClick={() => router.back()}
                className="rounded-xs! cursor-pointer"
            >
                <ArrowLeftIcon size={12} />
                <span>Go Back</span>
            </Button>
        </div>
    )
}

export default ForgotPassword
