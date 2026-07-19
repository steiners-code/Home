import z from "zod/v3";

export const signUpSchema = z
    .object({
        firstName: z
            .string()
            .min(1, "First name is required")
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must be at most 50 characters"),

        lastName: z
            .string()
            .max(50, "Last name must be at most 50 characters")
            .optional(),
        // .or(z.literal("")),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),

        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),

        confirmPassword: z.string().min(1, "Please confirm your password"),

        privacyPolicy: z
            .boolean()
            .refine((val) => val === true, {
                message: "You must accept the privacy policy to continue",
            }),

        newsletterOptIn: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type typeSignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z.string().min(1, "Password is required"),
});

export type typeLoginSchema = z.infer<typeof loginSchema>;