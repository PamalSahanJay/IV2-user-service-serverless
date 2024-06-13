import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/errors";
import { getHashedPassword, getSalt, validatePassword, generateToken, verifyToken } from "../utility/password";
import { LoginInput } from "../models/dto/Logininput";
import { generateAccessToken, sendVeirficationCode } from "../utility/notification";

@autoInjectable()
export class UserService {
    repository: UserRepository
    constructor(repository: UserRepository) {
        this.repository = repository
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }

    async UserLogin(event: APIGatewayProxyEventV2) {
        try {
            const body = event.body
            const input = plainToClass(LoginInput, event.body);
            const error = await AppValidationError(input)
            if (error) {
                throw new Error(error[0].constraints[Object.keys(error[0].constraints)[0]]);
                // error eka throw karanna 
            }
            // const salt = await getSalt();
            // const hashedPassword = await getHashedPassword(input.password, salt);
            const data = await this.repository.findAccount(input.email);
            const verified = await validatePassword(input.password, data.password, data.salt);

            if (!verified) {
                throw new Error("Invalid Password! Please try again.");
            }
            const token = await generateToken(data);
            return token;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async CreateUser(event: APIGatewayProxyEventV2) {
        try {
            const body = event.body
            const input = plainToClass(SignupInput, event.body);
            const error = await AppValidationError(input)
            if (error) {
                console.log(error)
                // need to change this 
                throw new Error(error[0].constraints[Object.keys(error[0].constraints)[0]]);
                // error eka throw karanna 
            }
            const salt = await getSalt();
            const hashedPassword = await getHashedPassword(input.password, salt);
            const data = await this.repository.CreateAccount({
                email: input.email,
                password: hashedPassword,
                phone: input.phone,
                userType: "BUYER",
                salt: salt
            });
            return data;
        } catch (error) {
            console.log('-error-userserivce', error.message)
            throw new Error(error.message);
        }
    }

    async GetVerificationToken(event: APIGatewayProxyEventV2) {

        try {
            const token = event.headers.authorization;
            const payload = await verifyToken(token);
            if (!payload) {
                throw new Error("Invalid Token");
            }

            const { code, expiration } = generateAccessToken()
            // save on db to confirm verification
            const response = await sendVeirficationCode(payload.phone, code);
            if (response) {
                return "Verification code sent successfully"
            }
        } catch (error) {
            throw new Error(error.message);
        }

    }

    //profile section
    async CreateProfile(event: APIGatewayProxyEventV2) {
        // throw new Error("Method not implemented.");
        return "create profile";
    }

    async GetProfile(event: APIGatewayProxyEventV2) {
        // throw new Error("Method not implemented.");
        return "get profile";
    }

    async EditProfile(event: APIGatewayProxyEventV2) {
        // throw new Error("Method not implemented.");
        return "edit profile"
    }

    //cart section
    async CreateCart(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }

    async GetCart(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }

    async UpdateCart(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }

    //payment section
    async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }

    async GetPaymentMethod(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }

    async UpdatePaymentMethod(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }
}