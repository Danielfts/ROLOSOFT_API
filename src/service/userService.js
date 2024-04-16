import { User } from "../model/user.js";

export async function createUser(request, response) {
    
    try {
        const userCreated = await User.create({
            email: "Mondoso",
            password_token: "1234",
        });
        return response.status(201).send(userCreated);
    } catch (error) {
        return response.status(500).send(error.message);
    }
    
}