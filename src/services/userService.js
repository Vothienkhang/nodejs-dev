import db from "../models/index";
import bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hash(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    }
    )
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // User already existed

                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],  // define which columns can be shown
                    // exclude: ['password']          // // define which columns can not be shown  
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    // Compare password 
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "Login successful";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 3;
                    userData.errMessage = "User not found";
                }

                resolve(userData);

            } else {
                // User does not existed
                userData.errCode = 1;
                userData.errMessage = "Your email does not exist in the system. Please try another email.";
            }
            resolve(userData);

        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        // Simulate checking if email exists
        try {
            let user = await db.User.findOne({
                where: { email: email }
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = [];

            // 1) Nếu ko truyền userID hoặc userID === 'ALL' => get all user
            if (!userId || userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            }

            // 2) 
            else {
                const id = Number(userId);

                if (!Number.isInteger(id) || id <= 0) {
                    return resolve(null); // Return null if userId is not a valid integer or is less than or equal to 0
                }

                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }

            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            // check email is exist 
            let check = await checkUserEmail(data.email);
            if (check === true) {
                return resolve({
                    errCode: 1,
                    errMessage: "The email is already in use. Please try another email."
                });
                // return;
            }
            let hashUserPasswordfromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashUserPasswordfromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                image: data.image,
                roleID: data.roleID,
                positionID: data.positionID,
            })

            return resolve({
                errCode: 0,
                message: "Create new user successfully"
            });
        } catch (e) {
            reject(e);
        }
    });
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (!user) {
                resolve({
                    errCode: 1,
                    message: "The user does not exist"
                });
            } else {
                await db.User.destroy({
                    where: { id: userId }
                });
                resolve({
                    errCode: 0,
                    message: "Delete user successfully"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2, 
                    message: "Missing required parameters"
                }); 
            }

            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.email = data.email;
                user.phonenumber = data.phonenumber;   
                user.gender = data.gender === '1' ? true : false;
                user.roleID = data.roleID;
                user.positionID = data.positionID;
                if (data.image) {
                    user.image = data.image;
                }
                await user.save();

                resolve({
                    errCode: 0,
                    message: "Update user successfully"
                });
            } else {
                resolve({
                    errCode: 1,
                    message: "User not found"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}