import { APIGatewayProxyEventV2 } from "aws-lambda";
const dotenv = require('dotenv');

const signup = async (event: APIGatewayProxyEventV2) => {
    console.log(event);
    return {
        statusCode: 200,
        headers: {
            "Access-Control_ALLow-Origin": "*",
        },
        body: JSON.stringify({
            message: "this is sign up",
            data: {
                name: process.env.name,
                year: process.env.year
            }
        })
    }
}

export {
    signup
}