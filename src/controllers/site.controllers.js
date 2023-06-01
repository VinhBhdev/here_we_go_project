import pool from "../configs/configDB";
var jwt = require('jsonwebtoken');
import authServices from '../services/auth.services'
const SECRET = 'shhhhhh';
// import multer from 'multer';

let showHomePage = (req, res) => {
    res.render('site/homepage.ejs', {
        userInfo: null || req.session.userInfo,
    })
}

let getSignup = (req, res) => {
    res.render('site/signup.ejs', { message: '' });
}

let postSignup = async (req, res) => {
    const user = req.body;
    try {
        const result = await authServices.signupServices(user);
        res.status(200).redirect('/signin');
    } catch (error) {
        res.render('site/signup.ejs', { message: 'Tên tài khoản đã tồn tại' });
    }
}
let getSignin = (req, res) => {
    res.render('site/signin.ejs', { message: '' });
}
let postSignin = async (req, res) => {
    const user = req.body;
    try {
        const result = await authServices.signinServices(user);
        req.session.userInfo = result;
        console.log(">>> CHECK USER");
        console.log(result);
        if (req.session.redirectTo && req.session.redirectTo !== '/') {
            let redirectTo = req.session.redirectTo;
            req.session.redirectTo = '/';
            res.redirect(redirectTo);
        }
        else res.status(200).render('site/homepage.ejs', { userInfo: result });
    } catch (error) {
        res.render('site/signin.ejs', { message: error.message });
    }

}

let getSignout = (req, res) => {
    req.session.userInfo = null;
    res.redirect('/');
}
let authBeforBookingHotels = async (req, res) => {
    req.session.bookingHotelInfo = req.body;
    if (req.session.userInfo) {
        res.redirect('/hotels/booking');
    }
    else {
        req.session.redirectTo = '/hotels/booking';
        res.redirect('/signin');
    }
}

let datePlusSevenHour = (date) => {
    let datePlus7Hours = new Date(date.valueOf() + 25200000);
    return datePlus7Hours.toUTCString().substring(0, 25);
}

let getUserInfo = async (req, res) => {
    try {

        let userInfo = req.session.userInfo;
        let [hotelBookedHistory, fields] = await pool.execute(
            `
        select * 
        from datluachonphong as DLCP, luachonphong as LCP, loaiphong as LP, khachsan as KS
        where idUser = ${userInfo.user.id}
        and DLCP.idLCP = LCP.idLCP
        and LP.idLP = LCP.idLP
        and KS.idKS = LP.idKS
        order by idDLCP DESC;
        `
        )
        // console.log(hotelBookedHistory);
        hotelBookedHistory.forEach((item) => {
            item.checkInDate = item.checkInDate.toUTCString().substring(0, 16);
            item.checkOutDate = item.checkOutDate.toUTCString().substring(0, 16);
            item.thoiGianDat = item.thoiGianDatLuaChonPhong;
            let thoiGianDatPlus7Hours = new Date(item.thoiGianDat.valueOf() + 25200000);
            item.thoiGianDat = thoiGianDatPlus7Hours.toUTCString().substring(0, 25);
        })
        console.log(hotelBookedHistory);

        let [ticketsBookedHistory, fields2] = await pool.execute(`
        select *, SB1.tenSB as tenSB1, SB2.tenSB as tenSB2, T1.tenTinh as tenTinh1, T2.tenTinh as tenTinh2
        from datvemaybay as DVMB, vemaybay as VMB, chuyenbay as CB, sanbay as SB1, sanbay as SB2, tinh as T1, tinh as T2, hanghangkhong as HHK
        where idUser = ${userInfo.user.id}
        and DVMB.idVMB = VMB.idVMB
        and VMB.idCB = CB.idCB
        and SB1.idSB = CB.idSanBayCatCanh
        and SB2.idSB = CB.idSanBayHaCanh
        and SB1.idTinh = T1.idTinh
        and SB2.idTinh = T2.idTinh
        and CB.idHHK = HHK.idHHK
        order by idDVMB DESC
        `)
        ticketsBookedHistory.forEach((item) => {
            item.thoiGianDat = datePlusSevenHour(item.thoiGianDat);
            item.thoiGianCatCanh = datePlusSevenHour(item.thoiGianCatCanh);
            item.thoiGianHaCanh = datePlusSevenHour(item.thoiGianHaCanh);
        })
        let xulyTien = (s) => {
            s = "" + s;
            s = s.split(',').join('')
            let res = '';
            let cnt = 0;
            for (let i = s.length - 1; i >= 0; i--) {
                cnt++;
                res += s[i];
                if (cnt % 3 == 0 && i != 0) res += ',';
            }
            res = res.split("").reverse().join("");
            return res;
        }
        let [userPrivateInfo, field4] = await pool.execute(`
            select * from users
            where id = ${userInfo.user.id}
        `)
        userPrivateInfo = userPrivateInfo[0];
        userInfo.user = userPrivateInfo;
        userInfo.user.soDuTaiKhoan = xulyTien(userInfo.user.soDuTaiKhoan)
        res.render('site/user-info.ejs', {
            userInfo,
            hotelBookedHistory,
            ticketsBookedHistory,
        })

    } catch (error) {
        res.render('error-handling/404.ejs')
    }
}

module.exports = {
    showHomePage,
    getSignup,
    postSignup,
    getSignin,
    postSignin,
    getSignout,
    getUserInfo,
    authBeforBookingHotels,
}

