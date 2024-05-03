import { UUID } from "crypto";

interface addressDTO {
    id? : UUID;
    address1 : string;
    address2? : string | null;
    city : string;
    state : string;
    postalCode : string;
    country : string;
    userId? : UUID
}

export default addressDTO;