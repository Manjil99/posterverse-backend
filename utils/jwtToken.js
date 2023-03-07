const sendToken = (user,statusCode,res) => {

    const token = user.getJWTToken();

    // options for cookie we are sending
    // token resides in our server or backend while cookie we sent over to client browser
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // in ms
        ),
        httpOnly: true,

    };
    
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        token,
        user
    });
}

export default sendToken;