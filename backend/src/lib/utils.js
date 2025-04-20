import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign( {userId}, process.env.JWT_SECRET, {
        expiresIn: '2d',
    });

    res.cookie("jwt_token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //ms
        httpOnly: true, // only accessible by the web server and prevents xsscript attacks
        sameSite: "strict", // prevents CSRF attacks
        secure: process.env.NODE_ENV !== "development", // only send the cookie over HTTPS in production
    });

    return token;
}