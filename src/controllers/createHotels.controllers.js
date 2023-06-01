import pool from "../configs/configDB";

let addHotels = (req, res) => {
    res.render('create-hotels/add-hotels.ejs', {
        userInfo: req.session.userInfo,
    });
}

let postAddHotels = async (req, res) => {
    // res.json(req.body);
    try {
        let idUser = req.session.userInfo.user.id;
        let hotelInfo = req.body;

        let [idKV, field1] = await pool.execute(`
            select idKV
            from KhuVuc as KV, tinh as T
            where T.tenTinh = '${hotelInfo.tenTinh.trim()}'
            and KV.tenKV = '${hotelInfo.tenKV.trim()}'
            and KV.idTinh = T.idTinh
        `)
        idKV = idKV[0].idKV;
        hotelInfo.hangSao = (hotelInfo.hangSao * 1.0).toFixed(0);
        let hotelData = await pool.execute(
            `
            insert into Khachsan
            values(null, '${hotelInfo.tenKS.trim()}', '${hotelInfo.loaiHinh.trim()}', ${idKV}, ${hotelInfo.hangSao}, '${hotelInfo.diaChiChiTiet}', '${hotelInfo.linkAnh}')
            `
        )
        let [newId, field3] = await pool.execute(
            `select max(idKS) as cnt from khachsan
            `
        )
        console.log(newId);
        newId = newId[0].cnt;
        await pool.execute(`
            insert into SoHuuKhachSan
            values(null, ${idUser}, ${newId})
        `)
        res.redirect('/create-hotels/all-hotels')
        // res.json({
        //     ...hotelInfo,
        //     message: "Success",
        // })
    } catch (error) {
        res.json({ message: error.message });
    }
}
let getAllHotels = async (req, res) => {
    let idUser = req.session.userInfo.user.id;
    let [data, field] = await pool.execute(
        `
        select * 
        from SoHuuKhachSan as SHKS, khachsan as KS
        where SHKS.idKS = KS.idKS
        and idUser = ${idUser}
        `
    )
    res.render('create-hotels/all-hotels.ejs', {
        userInfo: req.session.userInfo,
        hotelsData: data,
    })
}

let getHotelDetail = async (req, res) => {
    let idKS = req.params.id;
    let [hotelInfo, field1] = await pool.execute(`
        select * from khachsan
        where idKS = ${idKS}
    `)
    hotelInfo = hotelInfo[0];
    let [data, field] = await pool.execute(
        `
        select * 
            from loaiphong as LP, khachSan as KS
            where LP.idKS = KS.idKS
            and KS.idKS = ${idKS}
        `
    )
    res.render('create-hotels/hotel-detail.ejs', {
        userInfo: req.session.userInfo,
        hotelInfo,
        hotelData: data
    });
}

let addRoomType = async (req, res) => {
    let idKS = req.params.idKS;
    let [hotelInfo, field] = await pool.execute(`
        select * from khachsan
        where idKS = ${idKS}
    `)
    hotelInfo = hotelInfo[0];
    res.render('create-hotels/add-room-type.ejs', {
        userInfo: req.session.userInfo,
        idKS: req.params.idKS,
        hotelInfo,
    })
}

let postAddRoomType = async (req, res) => {
    try {
        let roomInfo = req.body;
        await pool.execute(`
        insert into loaiphong
        values(null, ${roomInfo.idKS}, ${roomInfo.giuongDon}, ${roomInfo.giuongDoi}, ${roomInfo.giuongDoiLon}, ${roomInfo.dienTich}, '${roomInfo.huongPhong}', '${roomInfo.tenLP}', ${roomInfo.soLuong}, null)
    `)
        res.redirect(`/create-hotels/hotel-detail/${roomInfo.idKS}`)
    } catch (error) {
        res.json({ messgae: error.message })
    }
}

let xulyTien = (s) => {
    s = "" + s;
    s = s.split(',').join('');
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

let getRoomTypeDetail = async (req, res) => {
    let idLP = req.params.idLP;
    try {
        let [roomTypeInfo, field] = await pool.execute(
            `
            select *
            from loaiPhong as LP, khachsan as KS
            where LP.idKS = KS.idKS
            and LP.idLP = ${idLP}
            `
        )
        roomTypeInfo = roomTypeInfo[0];
        let [roomOptionInfo, field2] = await pool.execute(
            `
            select *
            from luachonphong as LCP, loaiphong as LP, chinhsachhuyphong as CSHP, chinhsachthanhtoan as CSTT
            where LCP.idLP = LP.idLP
            and LP.idLP = ${idLP}
            and LCP.idCSHP = CSHP.idCSHP
            and LCP.idCSTT = CSTT.idCSTT
            `
        )
        for (let item of roomOptionInfo) {
            item.giaHienTai = xulyTien((item.giaGoc * (1 - item.uuDai / 100)).toFixed(0));
            item.giaGoc = xulyTien(item.giaGoc);
            let [optionPolicy, field] = await pool.execute(
                `
                select * 
                from luachonphong as LCP, loiichphongo as LIPO, lcp_loiich as LCP_LI
                where LCP.idLCP = LCP_LI.idLCP
                and LIPO.id = LCP_LI.idLIPO
                and LCP.idLCP = ${item.idLCP}
                `
            )
            item.loiIch = []
            console.log(optionPolicy);
            optionPolicy.forEach((policyItem) => {
                item.loiIch.push(policyItem.tenLI);
            })
        }
        // res.json({
        //     roomTypeInfo,
        //     roomOptionInfo
        // })
        let messageOption = req.session.addRoomOptionMessage;
        if (req.session.addRoomOptionMessage) req.session.addRoomOptionMessage = '';
        res.render('create-hotels/room-type-detail.ejs', {
            userInfo: req.session.userInfo,
            message: messageOption || '',
            roomTypeInfo,
            roomOptionInfo
        })

    } catch (error) {

    }
}
let postAddRoomOption = async (req, res) => {
    try {
        let optionInfo = req.body;
        await pool.execute(`
        insert into luachonphong
        values(null, ${optionInfo.idLP}, ${optionInfo.sucChuaNguoiLon}, ${optionInfo.sucChuaTreEm}, ${optionInfo.idCSHP}, ${optionInfo.idCSTT}, ${optionInfo.giaGoc.split(',').join('')}, ${optionInfo.uuDai});
        `)
        let [newIdLCP, field] = await pool.execute(`
            select max(idLCP) as cnt from luachonphong
        `)
        newIdLCP = newIdLCP[0].cnt;
        console.log(newIdLCP);
        for (let idLI of optionInfo.idLIPO) {
            await pool.execute(`
                insert into lcp_loiich
                values(${newIdLCP}, ${idLI})
            `)
        }
        req.session.addRoomOptionMessage = 'Thêm lựa chọn phòng thành công'
        res.redirect(`/create-hotels/room-type-detail/${optionInfo.idLP}`)
    } catch (error) {
        res.json({ messgae: error.message });
    }
}
module.exports = {
    addHotels,
    postAddHotels,
    getAllHotels,
    getHotelDetail,
    addRoomType,
    postAddRoomType,
    getRoomTypeDetail,
    postAddRoomOption
}