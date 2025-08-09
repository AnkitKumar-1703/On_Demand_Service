import jwt from "jsonwebtoken";
import 'dotenv/config';

export const getJwt = (id) =>{
    const token = jwt.sign(
        { id },
        process.env.JWT_SECRET
    );
    return token;
} 

