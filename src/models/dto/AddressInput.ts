import { Length } from "class-validator"

export class AddressInput {
    @Length(5, 50)
    address1: string
    address2: string

    @Length(5, 10)
    city: string
    
    @Length(2, 3) //SRI // IND // USA // UK
    country: string

    @Length(4, 6)
    postalCode: string
}

export class ProfileInput {
    firstName: string
    lastName: string
    userType: string
    address: AddressInput
}