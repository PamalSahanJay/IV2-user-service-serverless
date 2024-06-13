import { Client } from 'pg'

export const databaseClient = () => {
    return new Client({
        user: process.env.USER_SERVICE_DB_USER,
        host: process.env.USER_SERVICE_DB_HOST,
        database: process.env.USER_SERVICE_DB_NAME,
        password: process.env.USER_SERVICE_DB_PASSWORD,
        port: parseInt(process.env.USER_SERVICE_DB_PORT),
    })
}
