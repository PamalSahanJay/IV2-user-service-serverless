const returnCode = (statusCode: Number, message: String, data: any) => {
    if (data) {
        return {
            statusCode,
            headers: {
                "Access-Control_ALLow-Origin": "*",
            },
            body: JSON.stringify({
                message,
                data
            })
        }
    } else {
        return {
            statusCode,
            headers: {
                "Access-Control_ALLow-Origin": "*",
            },
            body: JSON.stringify({
                message
            })
        }
    }
}

export const SuccessResponse = (data: any) => {
   return returnCode (200, "Success", data);
}

export const ErrorResponse = (data: any) => {
    return returnCode (400, "Failure", data);
 }
