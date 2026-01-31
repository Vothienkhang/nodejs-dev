import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    // console.log('your email:', email);
    // console.log('your password:', password);

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Email and password are required !"
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    // check email existing
    // compare password
    // return userInfo
    // Access token: JWT json web token
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
        // errCode: 0,
        // message: "Login successful",
        // yourEmail: email,
        // test: 'test'
    });
}

module.exports = {
    handleLogin: handleLogin
}