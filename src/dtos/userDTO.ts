interface UserDTO {
    id: string | null;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: Date ;
    gender: string;
    role: string;
    phone: string | null;
};

export default UserDTO;