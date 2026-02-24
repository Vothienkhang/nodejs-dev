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

let handleGetAllUsers = async (req, res) => {
    try {
        let id = req.query.id; // All, Id

        if (!id) {
            return res.status(200).json({
            errCode: 1,
            message: "Missing required parameter",
            users: []
        });
    }

        let users = await userService.getAllUsers(id);
        console.log(users);

        // id req ko phải số nguyên dương
        if (id !== 'ALL' && users === null) {
            return res.status(400).json({
                errCode: 2,
                message: "Invalid user ID",
                users: []
            });
        }
        return res.status(200).json({
            errCode: 0,
            message: "Get users successfully",
            users: users
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: "Error from server"
        });
    }
}

let handleCreateNewUser = async (req, res) => {
    try {
        let message = await userService.createNewUser(req.body);
        console.log(message);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: "Error from server"
        });
    }
}

let handleEditUser = async (req, res) => {
    try {
        let data = req.body;
        let message = await userService.updateUserData(data);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: "Error from server"
        });
    }
}

let handleDeleteUser = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({
                errCode: 1,
                message: "Missing required parameter"
            });
        }
        let message = await userService.deleteUser(id);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: "Error from server"
        });
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser
}