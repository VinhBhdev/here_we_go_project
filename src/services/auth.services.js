import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import pool from "../configs/configDB";


const saltRounds = 10;
const SECRET = 'shhhhhh';
let signinServices = async (user) => {
    const [data, fields] = await pool.execute(`select * from users where username = '${user.username}'`);
    const findUser = data[0];
    if (findUser) {
        console.log(findUser);
        const match = await bcrypt.compare(user.password, findUser.password);
        if (match) {

            let token = jwt.sign({ id: findUser.id }, SECRET, {
                expiresIn: '1h',
            });
            delete findUser.password;
            return ({
                token: token,
                message: "OK",
                user: findUser
            });
        }

        else throw new Error('Sai mật khẩu');
    }
    else throw new Error('Không tìm thấy username');

}

let signupServices = async (user) => {
    const [data, fields] = await pool.execute(`select * from users where username = '${user.username}'`);
    const findUser = data[0];
    if (findUser) {
        throw new Error('Tài khoản này đã tồn tại');
    }
    else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;

        user.first_name = user.fullname.split(' ')[0];
        user.last_name = user.fullname.split(' ').slice(1).join(' ');
        await pool.execute(`insert into users(username, last_name, first_name, email, password, soDuTaiKhoan)
        values('${user.username}', '${user.last_name}', '${user.first_name}', '${user.email}', '${user.password}', 0)`);

        return ({
            token: "OK",
            message: "OK",
            user: user
        });
    }
}

module.exports = {
    signinServices,
    signupServices,
}