import jwt from "jsonwebtoken";

const SECRET = "secret123";

export type AuthTokenPayload = {
    id: number;
    role: string;
    email: string;
    name: string;
};

export function signToken(payload: AuthTokenPayload){
    return jwt.sign(payload,SECRET,{expiresIn: "1d"});
}

export function verifyToken(token:string){
    try{
        return jwt.verify(token,SECRET) as AuthTokenPayload | null;
    }
    catch{
        return null;
    }
}
