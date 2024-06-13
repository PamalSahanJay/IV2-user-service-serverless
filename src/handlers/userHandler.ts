import { APIGatewayProxyEventV2 } from "aws-lambda";
import {container} from 'tsyringe'
const dotenv = require('dotenv');
import { SuccessResponse, ErrorResponse } from '../utility/response'
import { UserService } from '../service/userService'
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

const userService = container.resolve(UserService); // dependancy injection

export const signup = middy(async (event: APIGatewayProxyEventV2) => {
    // console.log(event);
    try {
        const response = await userService.CreateUser(event);
        return SuccessResponse(response)
    } catch (error) {
        return ErrorResponse(error.message)
    }
}).use(jsonBodyParser())

// export const signup = async (event: APIGatewayProxyEventV2) => {
//     console.log(event);
//     try {
//         const response = await userService.CreateUser(event);
//         return SuccessResponse(response)
//     } catch (error) {
//         return ErrorResponse(error.message)
//     }
// }

// export const signup = middy().use(jsonBodyParser()).handler(signuph)

export const login = middy(async (event: APIGatewayProxyEventV2) => {
    console.log(event);
    try {
        const response = await userService.UserLogin(event);
        return SuccessResponse(response)
    } catch (error) {
        return ErrorResponse(error.message)
    }
}).use(jsonBodyParser())

export const verify = async (event: APIGatewayProxyEventV2) => {
    const handlerFunctions = {
        'get': userService.GetVerificationToken,
        'put': userService.EditProfile,
        'post': userService.CreateProfile
    };

    return getSuitableMethod(event, handlerFunctions);
}

export const profile = async (event: APIGatewayProxyEventV2) => {
    const handlerFunctions = {
        'get': userService.GetProfile,
        'put': userService.EditProfile,
        'post': userService.CreateProfile
    };

    return getSuitableMethod(event, handlerFunctions);
}

export const cart = async (event: APIGatewayProxyEventV2) => {
    const handlerFunctions = {
        'get': userService.GetCart,
        'put': userService.UpdateCart,
        'post': userService.CreateCart
    };

    return getSuitableMethod(event, handlerFunctions);
}

export const payment = async (event: APIGatewayProxyEventV2) => {
    const handlerFunctions = {
        'get': userService.GetPaymentMethod,
        'put': userService.UpdatePaymentMethod,
        'post': userService.CreatePaymentMethod
    };

    return getSuitableMethod(event, handlerFunctions);
}

const getSuitableMethod = async (event: APIGatewayProxyEventV2, functions: Record<string, Function>) => {
    try {
        const httpMethod = event.requestContext.http.method.toLowerCase();
        const handler = functions[httpMethod];

        if (!handler) {
            return ErrorResponse("Request method is not supported");
        }

        const res = await handler(event);
        return SuccessResponse(res);
    } catch (error) {
        console.log("--error-get suitable method--", error.message)
        return ErrorResponse(error.message);
    }
}
