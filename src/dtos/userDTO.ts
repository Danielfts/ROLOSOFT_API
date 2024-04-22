import StudentDTO from "./studentDTO";

interface UserDTO {
    id?: string ;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    birthDate: Date ;
    gender: string;
    role: string;
    phone: string;
    student?: StudentDTO;
};

export default UserDTO;