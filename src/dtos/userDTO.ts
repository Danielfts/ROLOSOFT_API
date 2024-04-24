import adminDTO from "./adminDTO";
import StudentDTO from "./studentDTO";

interface UserDTO {
    id?: string ;
    CURP: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    birthDate: Date ;
    gender: string;
    role: string;
    phone: string;
    student?: StudentDTO;
    admin?: adminDTO
};

export default UserDTO;