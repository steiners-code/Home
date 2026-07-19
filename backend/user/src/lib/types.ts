// All typescript types that can be used, or are being used.

export type TypeUserData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,

    gender?: Gender,
    age?: number,
    image?: string,
    bio?: string,

    privacyPolicy: boolean,
    newsletter: boolean,
}

export type TypeSignInData = {
    email: string,
    password: string
}

export enum Gender {
    MALE,
    FEMALE,
    CUSTOM
}