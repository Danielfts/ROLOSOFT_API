import UserService from "../service/userService";

class UserController {
    public static async logIn(req: any, res: any): Promise<void> {
        const email: string = req.body.email;
        const password: string = req.body.password;
        const success: boolean = await UserService.logIn(email, password);
        
        if (success) {
            res.status(200).send("User logged in successfully");
        }
    }

    public static async deleteUser(req:any, res:any): Promise<void> {
      const id:string = req.params.id;
      const success:boolean = await UserService.deleteUser(id);
        if (success) {
            res.status(200).send("User deleted successfully");
        } else {
            res.status(404).send("User not found");
        }
    }

    public static async getAllUsers(req:any, res:any) :Promise<void> { 
        const users = await UserService.getAllUsers();
        res.status(200).send(users);
    }

    public static async createUser(req:any, res:any) : Promise<void>{
        const user = req.body;
        const createdUser = await UserService.createUser(user);
        res.status(201).send(createdUser);
    }

}

export default UserController;