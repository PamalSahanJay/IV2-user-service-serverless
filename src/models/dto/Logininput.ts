import { IsEmail, Length } from "class-validator";

export class LoginInput {
    @IsEmail()
    email: string

    @Length(8,15)
    password: string
}