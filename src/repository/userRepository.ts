import { databaseClient } from "../utility/databaseClient";
import { UserModel } from "../models/UserModel";
import { BaseRepository } from "./BaseRepository";
import { ProfileInput } from "src/models/dto/AddressInput";
import { AddressModel } from "src/models/AddressModel";

export class UserRepository extends BaseRepository {
    constructor() {
        super();
    }

    async CreateAccount({ email, password, salt, phone, userType, firstName, lastName }: UserModel) {
        const queryString = "INSERT INTO users (email, password, salt, phone, user_type, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
        const values = [email, password, salt, phone, userType, firstName, lastName]
        const result = await this.executeQuery(queryString, values)

        if (result.rowCount > 0) {
            return result.rows[0] as UserModel
        }
    }

    async findAccount(email: string) {
        const queryString = "SELECT user_id AS \"userId\", email, password, phone, salt, verification_code AS \"verificationCode\", expiry FROM users WHERE email = $1";
        const values = [email]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount < 1) {
            throw new Error("Invalid user please Sign Up first");
        }
        return result.rows[0] as UserModel;
    }

    async updateVerificationCode(email: string, code: number, expiry: Date) {
        const queryString = "UPDATE users SET verification_code = $1, expiry = $2 WHERE email = $3  AND verified=FALSE RETURNING *"
        const values = [code, expiry, email]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount > 0) {
            return result.rows[0] as UserModel
        }
        throw new Error("User already verified");
    }

    async updateVerifyUser(email: string) {
        const queryString = "UPDATE users SET verified=TRUE WHERE email = $1 and verified=FALSE RETURNING *"
        const values = [email]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount > 0) {
            return result.rows[0] as UserModel
        }
        throw new Error("User already verified");
    }

    async updateUser(userId: string, firstName: string, lastName: string, userType: string) {
        const queryString = "UPDATE users SET first_name = $1, last_name = $2, user_type = $3 WHERE user_id = $4 RETURNING *"
        const values = [firstName, lastName, userType, userId]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount > 0) {
            return result.rows[0] as UserModel
        }
        throw new Error("Error while updating the User!");
    }

    async createProfile(
        userId: string,
        { firstName,
            lastName,
            userType,
            address: {
                address1,
                address2,
                city,
                postalCode,
                country }
        }: ProfileInput) {
            console.log("create user repository ...")
        await this.updateUser(userId, firstName, lastName, userType)

        const queryString = "INSERT INTO address (user_id, address_line1, address_line2, city, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
        const values = [userId, address1, address2, city, postalCode, country]

        const result = await this.executeQuery(queryString, values)
        if (result.rowCount > 0) {
            return result.rows[0] as AddressModel
        }
        throw new Error("Error while creating User Profile!");
    }

    async getUserProfile(userId: string) {
        const userQuery = "SELECT * FROM users WHERE user_id = $1"
        const values = [userId]
        const result = await this.executeQuery(userQuery, values)
        if(result.rowCount < 0) {
            throw new Error("Error while fetching user details")
        }
        const userProfile = result.rows[0] as UserModel
        const addressQuery = "SELECT * FROM address WHERE user_id = $1"
        const addressResult = await this.executeQuery(addressQuery, values)
        if(addressResult.rowCount < 0) {
            throw new Error ("Error while fetching address details")
        }
        userProfile.address = addressResult.rows as AddressModel[]
        return userProfile;
    }

    async updateProfile(userId: string,
        { firstName,
            lastName,
            userType,
            address: {
                id,
                address1,
                address2,
                city,
                postalCode,
                country }
        }: ProfileInput) {
            console.log("update profile ..")
            await this.updateUser(userId, firstName, lastName, userType)

        const queryString = "UPDATE address SET address_line1=$1, address_line2=$2, city=$3, postal_code=$4, country=$5 WHERE id=$6"
        const values = [address1, address2, city, postalCode, country, id]

        const result = await this.executeQuery(queryString, values)
        if (result.rowCount > 0) {
            return result.rows[0] as AddressModel
        }

        throw new Error("Error while updating User Profile!");
    }
}