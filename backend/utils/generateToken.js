import jwt from "jsonwebtoken";

const generateToken = (_id, email, role) =>{
    return jwt.sign({ id: _id, email: email, role: role }, process.env.SECRET_JWT , { expiresIn: '1d' });
}

export default generateToken;