export interface UserModel {
    userId?: string,
    email: string,
    password: string,
    salt: string,
    phone: string,
    userType: "BUYER" | "SELLER"
}