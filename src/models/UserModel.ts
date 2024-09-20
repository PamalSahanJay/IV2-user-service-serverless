import { AddressModel } from "./AddressModel"

export interface UserModel {
    userId?: string,
    email: string,
    password: string,
    salt: string,
    phone: string,
    userType: "BUYER" | "SELLER",
    firstName: string,
    lastName: string
    verificationCode?: number,
    expiry?: Date
    address?: AddressModel[]
}