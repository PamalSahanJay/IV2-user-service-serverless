import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/errors";
import { getHashedPassword, getSalt, validatePassword, generateToken, verifyToken } from "../utility/password";
import { LoginInput } from "../models/dto/Logininput";
import { generateAccessToken, sendVeirficationCode } from "../utility/notification";
import { VerificationInput } from "../models/dto/VerificationInput";
import { TimeDifference } from "../utility/dataHelper";
import { ProfileInput } from "../models/dto/AddressInput";

@autoInjectable()
export class UserService {
    repository: UserRepository
    constructor(repository: UserRepository) {
        this.repository = repository
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        try {
            const payload = await this.verifyAuthorizationToken(event);
            const input = await this.validateEventInput(event, VerificationInput);
            const { verificationCode, expiry } = await this.repository.findAccount(payload.email);
            if (verificationCode == parseInt(input.code)) {
                const currentTime = new Date();
                const diff = TimeDifference(expiry.toISOString(), currentTime.toISOString(), "m")
                if (diff > 0) {
                    await this.repository.updateVerifyUser(payload.email);
                    return { "message": "Account verified successfully!" }

                } else {
                    throw new Error("Verification code expired! Please try again.");
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
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
                userType: "BUYER", // hard coded
                salt: salt,
                firstName: input.firstName,
                lastName: input.lastName
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
            const { code, expiration } = await generateAccessToken()
            await this.repository.updateVerificationCode(payload.email, code, expiration);
            return { "message": "Verification code sent successfully", "code": code };
        } catch (error) {
            console.log("error", error.message)
            throw new Error(error.message);
        }
    }

    //profile section
    async CreateProfile(event: APIGatewayProxyEventV2) {
        const payload = await this.verifyAuthorizationToken(event);
        console.log("Create profile ..")
        const input = plainToClass(ProfileInput, event.body);
        //DB trasaction 
        const result = await this.repository.createProfile(payload.userId, input);
        console.log("result", result)
        return {
            "message": "Profile created successfully",
            "data": result
        }
    }

    async GetProfile(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await verifyToken(token);
        if (!payload) {
            throw new Error("Invalid Token");
        }
        const getUserProfile = await this.repository.getUserProfile(payload.userId)
        return getUserProfile;
    }

    async EditProfile(event: APIGatewayProxyEventV2) {
        const payload = await this.verifyAuthorizationToken(event);
        console.log("Edit profile..")
        const input = plainToClass(ProfileInput, event.body);
        const result = await this.repository.updateProfile(payload.userId, input);
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

    private async verifyAuthorizationToken(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await verifyToken(token);
        if (!payload) {
            throw new Error("Invalid Token");
        }
        return payload;
    }

    private async validateEventInput(event: APIGatewayProxyEventV2, InputClass: any): Promise<any> {
        const input = plainToClass(InputClass, event.body);
        const error = await AppValidationError(input);
        if (error) {
            throw new Error(error[0].constraints[Object.keys(error[0].constraints)[0]]);
        }
        return input;
    }
}