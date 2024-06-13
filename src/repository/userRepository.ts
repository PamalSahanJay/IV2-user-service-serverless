import { databaseClient } from "../utility/databaseClient";
import { UserModel } from "../models/UserModel";

export class UserRepository {

    async CreateAccount({ email, password, salt, phone, userType }: UserModel) {
        const client = await databaseClient();
        await client.connect()

        const queryString = "INSERT INTO users (email, password, salt, phone, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *"
        const values = [email, password, salt, phone, userType]
        const result = await client.query(queryString, values)
        await client.end()
        if (result.rowCount > 0) {
            return result.rows[0] as UserModel
        }
    }
    constructor() {

    }

    async findAccount(email: string) {
        const client = await databaseClient();
        await client.connect()

        const queryString = "select user_id, email, password, phone, salt  from users where email = $1"
        const values = [email]
        const result = await client.query(queryString, values)
        await client.end()
        if (result.rowCount < 1) {
            throw new Error("Invalid user please Sign Up first");
        }
        console.log(result.rows[0] as UserModel)
        return result.rows[0] as UserModel;
    }
}