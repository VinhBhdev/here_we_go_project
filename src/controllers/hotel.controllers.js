import pool from "../configs/configDB";
import session from "express-session";
// import multer from 'multer';

let showAllHotels = (req, res) => {
    pool.execute(`select * from KhachSan`)
        .then(([data, fields]) => {
            res.render('hotels/hotel-search.ejs')
        })
}

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

let tinhNgay = (checkIn, days) => {
    const checkInDate = new Date(checkIn);
    const millis = Math.abs(checkInDate.getTime() - days * (1000 * 60 * 60 * 24));
    const res = new Date(millis);
    return res.toLocaleDateString();
}

let getHotelsSearch = (req, res) => {
    try {
        let searchInformation = req.query;

        // đếm số ngày nghỉ
        const checkInDate = new Date(searchInformation.checkIn);
        const checkOutDate = new Date(searchInformation.checkOut);
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        searchInformation.nights = diffDays;
        req.session.searchInformation = searchInformation;

        res.render('hotels/hotel-search-2.ejs', {
            userInfo: req.session.userInfo,
            searchInformation: req.session.searchInformation,
            xulyTien: xulyTien
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

let handleHotelsSearch = (req, res) => {
    try {

        let searchInformation = req.query.searchInformation;
        // đếm số ngày nghỉ
        const checkInDate = new Date(searchInformation.checkIn);
        const checkOutDate = new Date(searchInformation.checkOut);
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        searchInformation.nights = diffDays;
        req.session.searchInformation = searchInformation;
        // let hotelsData = {}


        pool.execute(`
    select TMP_KS.idKS, tenKS, loaiHinh, hangSao, tenKV, tenTinh, TMP_KS.idKV, TMP_KS.idTinh, ROUND(MIN(giaGoc - giaGoc*uuDai/100), 0) AS giaReNhatSauUuDai, ROUND(MIN(giaGoc), 0) AS giaGocReNhat, MAX(uuDai) AS uuDaiLon, linkAnh
    from(
    select idKS, tenKS, loaiHinh, hangSao, tenKV, tenTinh, KV.idKV, KV.idTinh, linkAnh
    from KhachSan AS KS, KhuVuc AS KV, Tinh AS T
    where KS.idKV = KV.idKV
    and KV.idTinh = T.idTinh  
    and T.tenTinh = '${searchInformation.city}') AS TMP_KS,  LoaiPhong AS LP, LuaChonPhong AS LCP
    WHERE TMP_KS.idKS = LP.idKS
    AND LP.idLP = LCP.idLP    
    group by TMP_KS.idKS`)
            .then(([data, fields]) => {
                // đưa data vào session để thuận tiện cho sắp xếp và lọc
                req.session.hotelSearch = data;
                if (req.query.filterData) {
                    let filterData = req.query.filterData;
                    // lọc theo từ khóa tìm kiếm
                    if (filterData.searchKeyword) {
                        data = data.filter((item) => {
                            let key = filterData.searchKeyword;
                            return item.tenKS.includes(key) || item.tenKV.includes(key) || item.tenTinh.includes(key);
                        })
                    }
                    // lọc theo loại hình nhà ở
                    if (filterData.type) {
                        data = data.filter((item) => {
                            let idx = filterData.type.indexOf(item.loaiHinh);
                            return idx >= 0;
                        })
                    }
                    // lọc theo rank
                    if (filterData.rank) {
                        data = data.filter((item) => {
                            let idx = filterData.rank.indexOf('' + item.hangSao);
                            return idx >= 0;
                        })
                    }
                    // lọc theo giá
                    data = data.filter((item) => {
                        return + item.giaReNhatSauUuDai >= +filterData.minPrice && +item.giaReNhatSauUuDai <= +filterData.maxPrice
                    })
                }
                if (req.query.sortData) {
                    if (req.query.sortData == "2") {
                        data.sort((a, b) => +a.giaReNhatSauUuDai - +b.giaReNhatSauUuDai);
                    }
                    else if (req.query.sortData == "5") {
                        data.sort((a, b) => +b.uuDaiLon - +a.uuDaiLon);
                    }
                }
                res.json({
                    userInfo: req.session.userInfo,
                    hotelsData: data, searchInformation: req.session.searchInformation, xulyTien: xulyTien
                });
            })

    } catch (error) {
        res.json(error.message);
    }
}

let dateConvertISO = (date) => {
    let arr = date.split('/');
    return arr[2] + '-' + arr[0] + '-' + arr[1];
}

let showHotelDetail = (req, res) => {
    let idKS = req.params.idKS;

    let obj = {};
    pool.execute(`select * from KhachSan where idKS = ${idKS}`)
        .then(([data, fields]) => {
            obj.hotelInformation = data[0];
        })
        .then(() => {
            return pool.execute(`select * 
        from KhachSan AS KS, LoaiPhong AS LP, LuaChonPhong AS LCP
        where KS.idKS = ${idKS}
        and KS.idKS = LP.idKS
        and LP.idLP = LCP.idLP`)
        })
        .then(([data, fields]) => {
            let loaiPhong = {};
            for (let i = 0; i < data.length; i++) {
                let { idLP, tenLP } = data[i];
                let maLP = 'LP' + idLP;
                let maLCP = 'LCP' + data[i].idLCP;
                if (!loaiPhong[maLP]) {
                    loaiPhong[maLP] = {};
                    loaiPhong[maLP][maLCP] = data[i];
                }
                else {
                    loaiPhong[maLP][maLCP] = data[i];
                }
            }
            obj.roomsInformation = loaiPhong;
            obj.searchInformation = req.session.searchInformation;

            // return res.render('hotels/hotel-detail2.ejs', obj);
            // res.json(obj);
        })
        .then(() => {
            return pool.execute(`select LP.idLP, LCP.idLCP, idLIPO, tenLI, CSHP.tenCSHP, CSTT.tenCSTT
        from KhachSan AS KS, LoaiPhong AS LP, LuaChonPhong AS LCP, lcp_loiich AS LCP_LI, loiichphongo AS LIPO, chinhsachhuyphong AS CSHP, chinhsachthanhtoan AS CSTT
        where KS.idKS = ${idKS}
        and KS.idKS = LP.idKS
        and LP.idLP = LCP.idLP
        and LCP.idLCP = LCP_LI.idLCP
        and LCP_LI.idLIPO = LIPO.id
        and LCP.idCSHP = CSHP.idCSHP
        and LCP.idCSTT = CSTT.idCSTT`)
        })
        .then(([data, fields]) => {
            // xu ly Loi Ich Phong O
            for (let i = 0; i < data.length; i++) {
                let maLP = 'LP' + data[i].idLP;
                let maLCP = 'LCP' + data[i].idLCP;
                let maLIPO = 'LIPO' + data[i].idLIPO;
                if (!obj.roomsInformation[maLP][maLCP].loiIchPhongO) {
                    // obj.roomsInformation[maLP][maLCP].loiIchPhongO = [];
                    obj.roomsInformation[maLP][maLCP].loiIchPhongO = [data[i].tenLI];
                }
                else {
                    obj.roomsInformation[maLP][maLCP].loiIchPhongO.push(data[i].tenLI);
                }

                // xu ly Chinh sach Huy Phong, Thanh Toan
                // let checkInDay = new Date(obj.searchInformation.checkIn);
                let cancelDate = (data[i].tenCSHP)[(data[i].tenCSHP).lastIndexOf('ngày') - 2]
                if (cancelDate)
                    obj.roomsInformation[maLP][maLCP].chinhSachHuyPhong = data[i].tenCSHP + ` (${tinhNgay(obj.searchInformation.checkIn, cancelDate)})`;
                else obj.roomsInformation[maLP][maLCP].chinhSachHuyPhong = data[i].tenCSHP;

                let payDate = (data[i].tenCSTT)[(data[i].tenCSTT).lastIndexOf('ngày') - 2]
                if (payDate)
                    obj.roomsInformation[maLP][maLCP].chinhSachThanhToan = data[i].tenCSTT + ` (${tinhNgay(obj.searchInformation.checkIn, payDate)})`;
                else obj.roomsInformation[maLP][maLCP].chinhSachThanhToan = data[i].tenCSTT;
            }

            req.session.searchResult = obj;
            // res.json(obj);
            // return res.render('hotels/hotel-detail2.ejs', obj);
            // res.json(sorted);
        })
        .then(() => {
            // xử lý số phòng còn trống của mỗi loại phòng
            return pool.execute(`select LP.idLP, LP.soLuong-sum(DLCP.soLuongPhongDat) as conLai
                                from datluachonphong as DLCP, luachonphong as LCP, loaiphong as LP, khachsan as ks
                                where ks.idKS = LP.idKS
                                and ks.idKS = ${idKS}
                                and DLCP.idLCP = LCP.idLCP 
                                and LCP.idLP = LP.idLP
                                and DLCP.checkOutDate > "${dateConvertISO(obj.searchInformation.checkIn)}"
                                and DLCP.checkInDate <= "${dateConvertISO(obj.searchInformation.checkOut)}"
                                group by LP.idLP
            `)
        })
        .then(([data, fields]) => {
            let soLuongConLai = {};
            data.forEach(item => {
                soLuongConLai["LP" + item.idLP] = +item.conLai;
            })
            for (let maLP in obj.roomsInformation) {
                if (!soLuongConLai[maLP] && soLuongConLai[maLP] !== 0)
                    soLuongConLai[maLP] = Object.values(obj.roomsInformation[maLP])[0]["soLuong"];
            }
            obj.soLuongConLai = soLuongConLai;
            // res.json(obj);
            return res.render('hotels/hotel-detail2.ejs', {
                userInfo: req.session.userInfo,
                ...obj
            });
        })
        .catch((err) => res.render("error-handling/404.ejs"));

}



let sortByPrice = (req, res) => {
    let tmp = req.session.searchResult.roomsInformation;
    const sorted = Object.keys(tmp)
        .sort(function (a, b) {
            // console.log('>>>check:')
            // console.log(Object.values(tmp[a])[0].giaGoc);
            // let minPriceA = 1000000000, minPriceB = 1000000000;
            let minPriceA = Object.values(tmp[a]).reduce((res, item) => {
                return Math.min(res, item.giaGoc);
            }, 1000000000);

            let minPriceB = Object.values(tmp[b]).reduce((res, item) => {
                return Math.min(res, item.giaGoc);
            }, 1000000000);
            return minPriceB - minPriceA;
        })
        .reduce((accumulator, key) => {
            accumulator[key] = tmp[key];
            return accumulator;
        }, {});
    req.session.searchResult.roomsInformation = sorted;
    return res.render('hotels/hotel-detail2.ejs', req.session.searchResult);
}

let booking = async (req, res) => {
    // return res.render('hotels/hotel-booking.ejs')
    let bookingInfo = req.session.bookingHotelInfo;
    // return res.json(bookingInfo);
    bookingInfo.userPay = (+bookingInfo.totalPrice.split(',').join('') + +bookingInfo.totalPrice.split(',').join('') * 0.15)
    bookingInfo.totalPrice = xulyTien(bookingInfo.totalPrice);
    bookingInfo.userPay = xulyTien(bookingInfo.userPay);
    let optionRoomList = [];
    for (let key in bookingInfo) {
        if (key.includes("LCP")) optionRoomList.push(key.slice(3));
    }
    let result = [];
    for (let optionId of optionRoomList) {
        let [data, fields] = await pool.execute(`
            select *, round(giaGoc - giaGoc * uuDai / 100) as giaHienTai 
            from luachonphong as LCP, loaiphong as LP
            where idLCP = ${optionId}
            and LCP.idLP = LP.idLP
        `)
        data[0].tongGiaHienTai = data[0].giaHienTai * bookingInfo["LCP" + optionId];
        data[0].tongGiaHienTai = xulyTien(data[0].tongGiaHienTai);
        data[0].giaGoc = xulyTien(data[0].giaGoc)
        data[0].giaHienTai = xulyTien(data[0].giaHienTai)

        result.push({
            ...await data[0],
            soLuongDat: bookingInfo["LCP" + optionId]
        });
    }
    // return res.json({
    //     bookingInformation: bookingInfo,
    //     roomOptionInformation: result,
    //     searchInformation: { ...req.session.searchInformation },
    //     hotelInformation: { ...req.session.searchResult.hotelInformation },
    // });

    return res.render('hotels/hotel-booking.ejs', {
        userInfo: req.session.userInfo,
        bookingInformation: bookingInfo,
        roomOptionInformation: result,
        searchInformation: { ...req.session.searchInformation },
        hotelInformation: { ...req.session.searchResult.hotelInformation },
    });
}

let bookingProcess = async (req, res) => {
    try {

        console.log(">>> CHECK USER PAY")
        console.log(req.body);
        let HotelBookingInfo = req.body;
        let LCPList = [];
        for (let key in HotelBookingInfo) {
            if (key.slice(0, 3) === "LCP") {
                LCPList.push({ idLCP: key.slice(3), quantity: HotelBookingInfo[key] });
            }
        }

        for (let item of LCPList) {
            await pool.execute(`
            insert into datluachonphong
            values(null, ${HotelBookingInfo.userId}, ${item.idLCP}, now(), '${dateConvertISO(req.session.searchInformation.checkIn)}', '${dateConvertISO(req.session.searchInformation.checkOut)}', ${item.quantity});
        `)
        }

        // tìm chủ sở hữu khách sạn vừa đặt
        let [ownerId, field3] = await pool.execute(`
            select U.id
            from luachonphong as LCP, loaiphong as LP, khachsan as KS, soHuuKhachSan as SHKS, users as U
            where KS.idKS = LP.idKS
            and LP.idLP = LCP.idLP
            and LCP.idLCP = ${LCPList[0].idLCP}
            and SHKS.idKS = KS.idKS
            and U.id = SHKS.idUser
        `)
        ownerId = ownerId[0].id;
        // cập nhật tiên thanh toán cho chủ khách sạn
        await pool.execute(`
            update users
            set soDuTaiKhoan = soDuTaiKhoan + ${HotelBookingInfo.userPay.split(',').join('')}
            where id = ${ownerId}
        `)
        res.render('hotels/hotel-booking-success', {
            userInfo: req.session.userInfo,
            message: "Đặt phòng thành công!"
        });

    } catch (error) {
        res.json({ message: error.message });
    }
}

let filterAndSort = (req, res) => {
    res.json(req.query);
}


module.exports = {
    showAllHotels,
    handleHotelsSearch,
    showHotelDetail,
    sortByPrice,
    booking,
    bookingProcess,
    filterAndSort,
    getHotelsSearch
}
