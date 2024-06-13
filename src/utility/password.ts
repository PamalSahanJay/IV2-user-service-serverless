import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from 'src/models/UserModel'

const APP_SECRET = "our-secret-app"

export const getSalt = async () => {
    return await bcrypt.genSalt()
}

export const getHashedPassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const validatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
) => {
    return (await getHashedPassword(enteredPassword, salt)) === savedPassword;
}

export const generateToken = async ({ email, userId, phone, userType }: UserModel) => {
    return jwt.sign({ email, userId, phone, userType }, APP_SECRET, { expiresIn: '30d' })
}

export const verifyToken = async (token: string): Promise<UserModel | false> => {
    try {
        if (token !== "") {
            const payload = await jwt.verify(token.split(" ")[1], APP_SECRET) as UserModel
            return payload;
        }
        return false;
    } catch (error) {
        return false
    }
}