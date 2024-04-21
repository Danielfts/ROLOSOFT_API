interface UserDTO {
    id: string | null;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: Date ;
    gender: string;
    phone: string | null;
};

export default UserDTO;