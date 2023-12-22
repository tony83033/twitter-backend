import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const JWT_SECRET = "$3RE1"
class jwtService {
     public static getJwtToken(user:User){
        const payload = {
            id : user?.id,
            email: user?.email

        }

        const token = jwt.sign(payload,JWT_SECRET);
        return token;
     }
}

export default jwtService;