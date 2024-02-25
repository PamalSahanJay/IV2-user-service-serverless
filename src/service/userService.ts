import { APIGatewayProxyEventV2 } from "aws-lambda";

export class UserService {

    async VerifyUser(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }

    async UserLogin(event: APIGatewayProxyEventV2) {
        throw new Error("Method not implemented.");
    }

    async CreateUser(event: APIGatewayProxyEventV2) {
        // throw new Error("Method not implemented.");
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

    constructor() {

    }

}