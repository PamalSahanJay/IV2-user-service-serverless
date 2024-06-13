import { Length } from "class-validator";
import { LoginInput } from "./Logininput";

export class SignupInput extends LoginInput {
    @Length(10)
    phone : string;
}