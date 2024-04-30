interface addressDTO {
    id? : string;
    address1 : string;
    address2? : string | null;
    city : string;
    state : string;
    postalCode : string;
    country : string;
}

export default addressDTO;