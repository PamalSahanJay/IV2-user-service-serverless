import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


export const generateAccessToken = () => {
    const code = Math.floor(10000 + Math.random() * 90000); // 5 digit code
    let expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 300);
    return { code, expiration };
}

export const sendVeirficationCode = async (phone: string, code: number) => {
    try {
        const client = twilio(accountSid, authToken);
        const response = await client.messages.create({
            body: `Your verification code is ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone.trim()
        })
        return response;
    } catch (error) {
        // console.log("--errer-notification--", error.message)
        throw new Error("Error in sending verification code");
    }
}
