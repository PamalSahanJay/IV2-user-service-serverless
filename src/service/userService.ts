import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";

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
        throw new Error("Method not implemented.");
    }

    async CreateUser(event: APIGatewayProxyEventV2) {
        // throw new Error("Method not implemented.");
        const body = event.body
        console.log(body)
        const res = await this.repository.CreateUserOperation(body);
        console.log('-----db')
        console.log(res)
        return "this is create user"
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