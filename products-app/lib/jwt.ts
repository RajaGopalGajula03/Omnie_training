import jwt from "jsonwebtoken";

const SECRET = "secretkey";

export function signToken(payload:object){
    return jwt.sign(payload,SECRET,{expiresIn: '1h'});
}

export function verifyToken(token:string){
    try{
        return jwt.verify(token,SECRET);
    }
    catch
    {
        return null;
    }
}