import db from "../models/index";
import bcrypt from 'bcrypt';

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


module.exports = {
    handleUserLogin: handleUserLogin,
}