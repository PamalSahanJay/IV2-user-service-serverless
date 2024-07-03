import { databaseClient } from "../utility/databaseClient";
import { UserModel } from "../models/UserModel";
import { BaseRepository } from "./BaseRepository";

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
        const queryString = "select user_id, email, password, phone, salt  from users where email = $1"
        const values = [email]
        // console.log("db---")
        const result = await this.executeQuery(queryString, values)
        // console.log("result---",result)
        if (result.rowCount < 1) {
            throw new Error("Invalid user please Sign Up first");
        }
        // console.log(result.rows[0] as UserModel)
        return result.rows[0] as UserModel;
    }

    async updateVerificationCode(email: string, code: number, expiry: Date) {
        const queryString = "UPDATE users SET verification_code = $1, expiry = $2 WHERE email = $3 RETURNING *"
        const values = [code, expiry, email]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount > 0) {
            return result.rows[0] as UserModel
        }
    }
}