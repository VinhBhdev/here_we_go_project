import pool from "../configs/configDB";
import flightsServices from '../services/flights.services';
let findTinh = async (tenTinh) => {
    let [data, fields] = await pool.execute(`select * from tinh as T where T.tenTinh = '${tenTinh}'`);
    return data[0];
}

let timeDiff = (dateDiff, st, ed) => {
    let h1 = st.substring(0, 2);
    let h2 = ed.substring(0, 2);
    let m1 = st.substring(3, 5);
    let m2 = ed.substring(3, 5);
    let diff = (h2 * 60 + +m2) - (h1 * 60 + +m1);
    if (diff < 0) diff += (dateDiff + 1) * 24 * 60;
    return (diff / 60).toFixed(0) + "h " + (diff % 60) + "ph";
}

let flightsList = (req, res) => {
    res.render('flights/flights-list.ejs')
}

let xulyTien = (s) => {
    s = "" + s;
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
// let getTicketsList = async (req, res) => {
//     let searchInfo = req.query;
//     let departureCity = await findTinh(searchInfo.departureFrom);
//     let arrivalCity = await findTinh(searchInfo.arrivalTo);
//     let numberOfPeople = +searchInfo.adults + +searchInfo.children + +searchInfo.baby;

//     let [data, fields] = await pool.execute(
//         `
//         select VMB.idVMB, TMP.*, HHK.tenHHK, CBHG.soLuongHangGhe, VMB.phanLoai, VMB.giaGoc, VMB.uuDai, ROUND(VMB.giaGoc-VMB.giaGoc*VMB.uuDai/100) as giaHienTai, HG.tenHG
//         from HangHangKhong as HHK, chuyenbay_hangghe as CBHG, vemaybay as VMB, hangghe as HG, (select CB.idCB, CB.idHHK, soDiemDung, thoiGianCatCanh, thoiGianHaCanh, SB1.tenVietTat as tenVietTatSB1, SB1.tenSB as tenSanBay1, SB2.tenVietTat as tenVietTatSB2, SB2.tenSB as tenSanBay2
//                 from chuyenbay AS CB, sanbay AS SB1, sanbay AS SB2
//                 where SB1.idTinh = ${departureCity.idTinh}
//                 and CB.idSanBayCatCanh = SB1.idSB
//                 and SB2.idTinh = ${arrivalCity.idTinh}
//                 and CB.idSanBayHaCanh = SB2.idSB
//                 and CB.thoiGianCatCanh >= '${searchInfo.departDate} 00:00:00'
//                 and CB.thoiGianCatCanh <= '${searchInfo.departDate} 23:59:59') as TMP
//         where TMP.idHHK = HHK.idHHK
//         and TMP.idCB = CBHG.idCB
//         and CBHG.idHG = HG.idHG
//         and CBHG.idCB = VMB.idCB
//         and CBHG.idHG = VMB.idHG
//         and HG.idHG = ${searchInfo.classType}
//         and CBHG.soLuongHangGhe >=  ${numberOfPeople}      
//         `
//     )
//     for (let item of data) {
//         const SECOND_IN_A_DAY = 86400;
//         let dateDiff = item.thoiGianHaCanh - item.thoiGianCatCanh;
//         item.dateDiff = parseInt(dateDiff / 1000 / SECOND_IN_A_DAY);
//         item.thoiGianCatCanh = item.thoiGianCatCanh.toUTCString();
//         item.thoiGianCatCanh = {
//             ngayCatCanh: item.thoiGianCatCanh.substring(0, 16),
//             gioCatCanh: item.thoiGianCatCanh.substring(17, 22),
//         }
//         item.thoiGianHaCanh = item.thoiGianHaCanh.toUTCString();
//         item.thoiGianHaCanh = {
//             ngayHaCanh: item.thoiGianHaCanh.substring(0, 16),
//             gioHaCanh: item.thoiGianHaCanh.substring(17, 22),
//         }
//         item.khoangThoiGian = timeDiff(dateDiff, item.thoiGianCatCanh.gioCatCanh, item.thoiGianHaCanh.gioHaCanh)
//     }

//     let TicketsSearchResult = [];
//     for (let i = 0; i < data.length; i += 3) {
//         let ticketItem = data[i];
//         ticketItem.idVMB = [ticketItem.idVMB, ticketItem.idVMB + 1, ticketItem.idVMB + 2];
//         ticketItem.giaVe = [];
//         let userPay = 0;
//         for (let j = i; j < i + 3; j++) {
//             let tongGia = 0;
//             if (j === i) tongGia = data[j].giaHienTai * searchInfo.adults;
//             else if (j === i + 1) tongGia = data[j].giaHienTai * searchInfo.children;
//             else tongGia = data[j].giaHienTai * searchInfo.baby;
//             userPay += tongGia;
//             ticketItem.giaVe.push({
//                 phanLoai: data[j].phanLoai,
//                 uuDai: xulyTien(data[j].uuDai * data[j].giaGoc / 100 + ""),
//                 giaGoc: xulyTien(data[j].giaGoc + ""),
//                 giaHienTai: xulyTien(data[j].giaHienTai + ""),
//                 tongGia: xulyTien(tongGia + ""),
//             })
//         }
//         ticketItem.userPay = xulyTien(userPay);
//         delete ticketItem.giaGoc;
//         delete ticketItem.uuDai;
//         delete ticketItem.giaHienTai;

//         TicketsSearchResult.push(ticketItem);
//     }
//     // res.json({
//     //     ...req.query,
//     //     ticketsList: TicketsSearchResult
//     // })

//     res.render('flights/flights-list.ejs', {
//         searchInfo: req.query,
//         ticketsList: TicketsSearchResult
//     })


// }

let ticketsSearch = (req, res) => {
    console.log(1);
    res.render('flights/flights-list-2.ejs', {
        userInfo: req.session.userInfo,
        searchInfo: req.query,
    });
}

let getTicketsListApi = async (req, res) => {
    try {
        console.log(2);
        let searchInfo = req.query;
        let departureCity = await findTinh(searchInfo.departureFrom);
        let arrivalCity = await findTinh(searchInfo.arrivalTo);
        let numberOfPeople = +searchInfo.adults + +searchInfo.children + +searchInfo.baby;

        let [data, fields] = await pool.execute(
            `
        select VMB.idVMB, TMP.*, HHK.tenHHK, CBHG.soLuongHangGhe, VMB.phanLoai, VMB.giaGoc, VMB.uuDai, ROUND(VMB.giaGoc-VMB.giaGoc*VMB.uuDai/100) as giaHienTai, HG.tenHG
        from HangHangKhong as HHK, chuyenbay_hangghe as CBHG, vemaybay as VMB, hangghe as HG, (select CB.idCB, CB.idHHK, soDiemDung, thoiGianCatCanh, thoiGianHaCanh, SB1.tenVietTat as tenVietTatSB1, SB1.tenSB as tenSanBay1, SB2.tenVietTat as tenVietTatSB2, SB2.tenSB as tenSanBay2
                from chuyenbay AS CB, sanbay AS SB1, sanbay AS SB2
                where SB1.idTinh = ${departureCity.idTinh}
                and CB.idSanBayCatCanh = SB1.idSB
                and SB2.idTinh = ${arrivalCity.idTinh}
                and CB.idSanBayHaCanh = SB2.idSB
                and CB.thoiGianCatCanh >= '${searchInfo.departDate} 00:00:00'
                and CB.thoiGianCatCanh <= '${searchInfo.departDate} 23:59:59') as TMP
        where TMP.idHHK = HHK.idHHK
        and TMP.idCB = CBHG.idCB
        and CBHG.idHG = HG.idHG
        and CBHG.idCB = VMB.idCB
        and CBHG.idHG = VMB.idHG
        and HG.idHG = ${searchInfo.classType}
        and CBHG.soLuongHangGhe >=  ${numberOfPeople}      
        `
        )

        for (let item of data) {
            const SECOND_IN_A_DAY = 24 * 60 * 60;
            let dateDiff = item.thoiGianHaCanh - item.thoiGianCatCanh;
            item.dateDiff = parseInt(dateDiff / 1000 / SECOND_IN_A_DAY);

            let thoiGianCatCanhPlus7Hours = new Date(item.thoiGianCatCanh.valueOf() + 25200000);
            item.thoiGianCatCanh = thoiGianCatCanhPlus7Hours;

            let thoiGianHaCanhPlus7Hours = new Date(item.thoiGianHaCanh.valueOf() + 25200000);
            item.thoiGianHaCanh = thoiGianHaCanhPlus7Hours;


            item.thoiGianCatCanh = item.thoiGianCatCanh.toUTCString();


            item.thoiGianCatCanh = {
                ngayCatCanh: item.thoiGianCatCanh.substring(0, 16),
                gioCatCanh: item.thoiGianCatCanh.substring(17, 22),
            }

            item.thoiGianHaCanh = item.thoiGianHaCanh.toUTCString();
            item.thoiGianHaCanh = {
                ngayHaCanh: item.thoiGianHaCanh.substring(0, 16),
                gioHaCanh: item.thoiGianHaCanh.substring(17, 22),
            }
            item.khoangThoiGian = timeDiff(item.dateDiff, item.thoiGianCatCanh.gioCatCanh, item.thoiGianHaCanh.gioHaCanh)

        }

        let TicketsSearchResult = [];
        for (let i = 0; i < data.length; i += 3) {
            let ticketItem = data[i];
            ticketItem.idVMB = [ticketItem.idVMB, ticketItem.idVMB + 1, ticketItem.idVMB + 2];
            ticketItem.giaVe = [];
            let userPay = 0;
            for (let j = i; j < i + 3; j++) {
                let tongGia = 0;
                if (j === i) tongGia = data[j].giaHienTai * searchInfo.adults;
                else if (j === i + 1) tongGia = data[j].giaHienTai * searchInfo.children;
                else tongGia = data[j].giaHienTai * searchInfo.baby;
                userPay += tongGia;
                ticketItem.giaVe.push({
                    phanLoai: data[j].phanLoai,
                    uuDai: xulyTien(data[j].uuDai * data[j].giaGoc / 100 + ""),
                    giaGoc: xulyTien(data[j].giaGoc + ""),
                    giaHienTai: xulyTien(data[j].giaHienTai + ""),
                    tongGia: xulyTien(tongGia + ""),
                })
            }
            ticketItem.userPay = xulyTien(userPay);
            delete ticketItem.giaGoc;
            delete ticketItem.uuDai;
            delete ticketItem.giaHienTai;

            TicketsSearchResult.push(ticketItem);
        }
        req.session.ticketsInfo = {
            departureCity,
            arrivalCity,
            searchInfo: req.query,
            ticketsList: TicketsSearchResult
        }
        console.log(req.session.ticketsInfo)
        res.json({
            searchInfo: req.query,
            ticketsList: TicketsSearchResult
        })


    } catch (error) {
        res.status(500).json(error.message)
    }


}

// let getReturnTicketsListApi = async (req, res) => {
//     try {
//         console.log(2);
//         let searchInfo = req.query;
//         let departureCity = await findTinh(searchInfo.departureFrom);
//         let arrivalCity = await findTinh(searchInfo.arrivalTo);
//         let numberOfPeople = +searchInfo.adults + +searchInfo.children + +searchInfo.baby;

//         let [data, fields] = await pool.execute(
//             `
//         select VMB.idVMB, TMP.*, HHK.tenHHK, CBHG.soLuongHangGhe, VMB.phanLoai, VMB.giaGoc, VMB.uuDai, ROUND(VMB.giaGoc-VMB.giaGoc*VMB.uuDai/100) as giaHienTai, HG.tenHG
//         from HangHangKhong as HHK, chuyenbay_hangghe as CBHG, vemaybay as VMB, hangghe as HG, (select CB.idCB, CB.idHHK, soDiemDung, thoiGianCatCanh, thoiGianHaCanh, SB1.tenVietTat as tenVietTatSB1, SB1.tenSB as tenSanBay1, SB2.tenVietTat as tenVietTatSB2, SB2.tenSB as tenSanBay2
//                 from chuyenbay AS CB, sanbay AS SB1, sanbay AS SB2
//                 where SB1.idTinh = ${departureCity.idTinh}
//                 and CB.idSanBayCatCanh = SB1.idSB
//                 and SB2.idTinh = ${arrivalCity.idTinh}
//                 and CB.idSanBayHaCanh = SB2.idSB
//                 and CB.thoiGianCatCanh >= '${searchInfo.departDate} 00:00:00'
//                 and CB.thoiGianCatCanh <= '${searchInfo.departDate} 23:59:59') as TMP
//         where TMP.idHHK = HHK.idHHK
//         and TMP.idCB = CBHG.idCB
//         and CBHG.idHG = HG.idHG
//         and CBHG.idCB = VMB.idCB
//         and CBHG.idHG = VMB.idHG
//         and HG.idHG = ${searchInfo.classType}
//         and CBHG.soLuongHangGhe >=  ${numberOfPeople}      
//         `
//         )

//         for (let item of data) {
//             const SECOND_IN_A_DAY = 24 * 60 * 60;
//             let dateDiff = item.thoiGianHaCanh - item.thoiGianCatCanh;
//             item.dateDiff = parseInt(dateDiff / 1000 / SECOND_IN_A_DAY);

//             let thoiGianCatCanhPlus7Hours = new Date(item.thoiGianCatCanh.valueOf() + 25200000);
//             item.thoiGianCatCanh = thoiGianCatCanhPlus7Hours;

//             let thoiGianHaCanhPlus7Hours = new Date(item.thoiGianHaCanh.valueOf() + 25200000);
//             item.thoiGianHaCanh = thoiGianHaCanhPlus7Hours;


//             item.thoiGianCatCanh = item.thoiGianCatCanh.toUTCString();


//             item.thoiGianCatCanh = {
//                 ngayCatCanh: item.thoiGianCatCanh.substring(0, 16),
//                 gioCatCanh: item.thoiGianCatCanh.substring(17, 22),
//             }

//             item.thoiGianHaCanh = item.thoiGianHaCanh.toUTCString();
//             item.thoiGianHaCanh = {
//                 ngayHaCanh: item.thoiGianHaCanh.substring(0, 16),
//                 gioHaCanh: item.thoiGianHaCanh.substring(17, 22),
//             }
//             item.khoangThoiGian = timeDiff(item.dateDiff, item.thoiGianCatCanh.gioCatCanh, item.thoiGianHaCanh.gioHaCanh)

//         }

//         let TicketsSearchResult = [];
//         for (let i = 0; i < data.length; i += 3) {
//             let ticketItem = data[i];
//             ticketItem.idVMB = [ticketItem.idVMB, ticketItem.idVMB + 1, ticketItem.idVMB + 2];
//             ticketItem.giaVe = [];
//             let userPay = 0;
//             for (let j = i; j < i + 3; j++) {
//                 let tongGia = 0;
//                 if (j === i) tongGia = data[j].giaHienTai * searchInfo.adults;
//                 else if (j === i + 1) tongGia = data[j].giaHienTai * searchInfo.children;
//                 else tongGia = data[j].giaHienTai * searchInfo.baby;
//                 userPay += tongGia;
//                 ticketItem.giaVe.push({
//                     phanLoai: data[j].phanLoai,
//                     uuDai: xulyTien(data[j].uuDai * data[j].giaGoc / 100 + ""),
//                     giaGoc: xulyTien(data[j].giaGoc + ""),
//                     giaHienTai: xulyTien(data[j].giaHienTai + ""),
//                     tongGia: xulyTien(tongGia + ""),
//                 })
//             }
//             ticketItem.userPay = xulyTien(userPay);
//             delete ticketItem.giaGoc;
//             delete ticketItem.uuDai;
//             delete ticketItem.giaHienTai;

//             TicketsSearchResult.push(ticketItem);
//         }
//         req.session.ticketsInfo = {
//             departureCity,
//             arrivalCity,
//             searchInfo: req.query,
//             ticketsList: TicketsSearchResult
//         }
//         console.log(req.session.ticketsInfo)
//         res.json({
//             searchInfo: req.query,
//             ticketsList: TicketsSearchResult
//         })


//     } catch (error) {
//         res.status(500).json(error.message)
//     }


// }

let ticketsFilter = (req, res) => {
    // res.json(req.query);
    let filterData = req.query.filterData;
    // console.log(">>>CHECK DATA");
    // console.log(filterData);
    // Lọc theo maxPrice

    // clone ticketsList (dau '=' van la clone, ko phai references)
    let ticketsListFilter = req.session.ticketsInfo.ticketsList;
    ticketsListFilter = ticketsListFilter.filter((item) => {
        let price = +(item.giaVe[0].giaHienTai.split(',').join(''));
        return price <= filterData.maxPrice;
    })

    // Lọc theo hãng hàng không
    if (filterData.airlines && filterData.airlines.length > 0) {
        ticketsListFilter = ticketsListFilter.filter((item) => {
            let idx = filterData.airlines.indexOf('' + item.idHHK);
            return idx >= 0;
        })
    }

    // Lọc theo số lượng điểm dừng
    // if (filterData.stopOver && filterData.stopOver.length > 0) {
    //     ticketsListFilter = ticketsListFilter.filter((item) => {
    //         let idx = filterData.stopOver.indexOf('' + item.soDiemDung);
    //         return idx >= 0;
    //     })
    // }

    // Lọc theo thời gian lịch trình
    ticketsListFilter = ticketsListFilter.filter((item) => {
        let departTimeItem = item.thoiGianCatCanh.gioCatCanh;
        let arrivalTimeItem = item.thoiGianHaCanh.gioHaCanh;
        return (departTimeItem >= filterData.departTimeBegin && departTimeItem <= filterData.departTimeEnd && arrivalTimeItem >= filterData.arrivalTimeBegin && arrivalTimeItem <= filterData.arrivalTimeEnd)
    })

    // Sắp xếp
    if (req.query.sortData) {
        let sortData = req.query.sortData;
        function xuLyThoiGian(a) {
            let idx = a.khoangThoiGian.indexOf('h');
            let h = 0, m = 0;
            if (idx > 0) h = a.khoangThoiGian.substring(0, idx);
            m = a.khoangThoiGian.substring(idx + 1, a.khoangThoiGian.length - 2);
            return +h * 60 + +m;
        }
        if (sortData == "1") {
            console.log("sort1");
            ticketsListFilter.sort((a, b) => +a.giaVe[0].giaHienTai.split(",").join("") - +b.giaVe[0].giaHienTai.split(",").join(""));
        }
        else if (sortData == "2") {
            console.log("sort2");
            ticketsListFilter.sort((a, b) => {
                return xuLyThoiGian(a) - xuLyThoiGian(b);
            });
        }
        else if (sortData == "3") {
            console.log("sort3");
            ticketsListFilter.sort((a, b) => {
                return xuLyThoiGian(a) * 0.5 + +a.giaVe[0].giaHienTai.split(",").join("") / 4000 * 0.5 - xuLyThoiGian(b) * 0.5 - +b.giaVe[0].giaHienTai.split(",").join("") / 4000 * 0.5;
            });
        }
    }
    res.json({
        searchInfo: req.session.ticketsInfo.searchInfo,
        ticketsList: ticketsListFilter,
    })
}

let authBeforeBookingTickets = (req, res) => {

    if (req.session.ticketsInfo.searchInfo.flightType == 1) {
        req.session.flightTicketsBookingInfo = {
            ...req.body,
            ...req.session.ticketsInfo.searchInfo
        }
        if (req.session.userInfo) {
            res.redirect('/flights/one-way-booking');
        }
        else {
            req.session.redirectTo = 'flights/one-way-booking';
            res.redirect('/signin');
        }
    }
    else {
        req.session.twoWayBookingInfo = {
            firstTickets: req.session.firstTickets,
            secondTickets: req.body,
        }
        if (req.session.userInfo) {
            res.redirect('/flights/two-way-booking');
        }
        else {
            req.session.redirectTo = '/flights/two-way-booking';
            res.redirect('/signin');
        }
    }
}
let oneWayBooking = (req, res) => {
    let flightTicketsBookingInfo = req.session.flightTicketsBookingInfo;
    // res.json(flightTicketsBookingInfo);
    let firstTickets = req.session.flightTicketsBookingInfo;
    let searchInfo = req.session.ticketsInfo.searchInfo;
    firstTickets.totalPriceForAdults = xulyTien(firstTickets.adultsTicketPrice.split(',').join('') * +searchInfo.adults);
    firstTickets.totalPriceForChildren = xulyTien(firstTickets.childrenTicketPrice.split(',').join('') * +searchInfo.children);
    firstTickets.totalPriceForBaby = xulyTien(firstTickets.babyTicketPrice.split(',').join('') * +searchInfo.baby);

    let data = {
        userInfo: req.session.userInfo,
        firstTickets,
        searchInfo,
        userId: req.session.userInfo.user.id,
    }
    // res.json(data);
    res.render('flights/one-way-flight-booking.ejs', data);
}
let twoWayBooking = (req, res) => {
    let { firstTickets, secondTickets } = req.session.twoWayBookingInfo;
    let searchInfo = req.session.ticketsInfo.searchInfo;
    // swap lại thứ tự chiều đi, chiều về trong session
    // vì lúc tìm kiếm chuyến vế đã bị đảo ngược
    console.log(firstTickets, secondTickets);
    let dateTmp = req.session.ticketsInfo.searchInfo.departDate;
    req.session.ticketsInfo.searchInfo.departDate = req.session.ticketsInfo.searchInfo.returnDate;
    req.session.ticketsInfo.searchInfo.returnDate = dateTmp;

    let tmp = req.session.ticketsInfo.searchInfo.departureFrom;
    req.session.ticketsInfo.searchInfo.departureFrom = req.session.ticketsInfo.searchInfo.arrivalTo;
    req.session.ticketsInfo.searchInfo.arrivalTo = tmp;

    firstTickets.totalPriceForAdults = xulyTien(firstTickets.adultsTicketPrice.split(',').join('') * +searchInfo.adults);
    firstTickets.totalPriceForChildren = xulyTien(firstTickets.childrenTicketPrice.split(',').join('') * +searchInfo.children);
    firstTickets.totalPriceForBaby = xulyTien(firstTickets.babyTicketPrice.split(',').join('') * +searchInfo.baby);

    secondTickets.totalPriceForAdults = xulyTien(secondTickets.adultsTicketPrice.split(',').join('') * +searchInfo.adults);
    secondTickets.totalPriceForChildren = xulyTien(secondTickets.childrenTicketPrice.split(',').join('') * +searchInfo.children);
    secondTickets.totalPriceForBaby = xulyTien(secondTickets.babyTicketPrice.split(',').join('') * +searchInfo.baby);
    let data = {
        userInfo: req.session.userInfo,
        firstTickets: firstTickets,
        secondTickets,
        searchInfo: req.session.ticketsInfo.searchInfo,
        userId: req.session.userInfo.user.id,
    };
    // res.json(data);
    res.render('flights/two-way-flight-booking.ejs', data);

}

let ticketsReturnSearch = (req, res) => {
    req.session.firstTickets = req.body;
    // res.json(req.body);

    let searchInfo = req.session.ticketsInfo.searchInfo;
    if (!searchInfo.status || searchInfo.status === 1) {
        let searchInfo = req.session.ticketsInfo.searchInfo;
        let dateTmp = searchInfo.departDate;
        searchInfo.departDate = searchInfo.returnDate;
        searchInfo.returnDate = dateTmp;
        let tmp = searchInfo.departureFrom;
        searchInfo.departureFrom = searchInfo.arrivalTo;
        searchInfo.arrivalTo = tmp;
        searchInfo.status = 2;
    }

    res.render('flights/flights-list-return.ejs', {
        userInfo: req.session.userInfo,
        searchInfo: req.session.ticketsInfo.searchInfo,
    });
}

let twoWayPayment = (req, res) => {
    let { firstTickets, secondTickets } = req.session.twoWayBookingInfo;
    // res.json({
    //     searchInfo: req.session.ticketsInfo.searchInfo,
    //     paymentInfo: req.body,
    //     firstTickets,
    //     secondTickets,
    // });
    res.render('flights/two-way-flight-payment.ejs', {
        userInfo: req.session.userInfo,
        searchInfo: req.session.ticketsInfo.searchInfo,
        paymentInfo: req.body,
        firstTickets,
        secondTickets,
    });
}
let twoWayProcessBooking = async (req, res) => {
    // res.json(req.body);
    let twoWayTickets = req.body;
    let userId = req.session.userInfo.user.id;
    let searchInfo = req.session.ticketsInfo.searchInfo;
    let adults = +searchInfo.adults;
    let children = +searchInfo.children;
    let baby = +searchInfo.baby;
    let people = [adults, children, baby];
    try {
        console.log(twoWayTickets.firstTicketsId.split(','), people, userId);
        await flightsServices.datVeMayBayServices(twoWayTickets.firstTicketsId.split(','), people, userId);
        await flightsServices.datVeMayBayServices(twoWayTickets.secondTicketsId.split(','), people, userId);

        res.render('flights/flights-booking-success.ejs', {
            userInfo: req.session.userInfo,
            message: "Đặt vé thành công"
        })
    } catch (error) {
        res.json("Dat ve that bai");
    }
}

let test = (req, res) => {
    res.render('flights/flights-booking-success.ejs', { message: "Đặt vé thành công" })
}

let oneWayPayment = (req, res) => {
    // res.json(req.body);
    res.render('flights/one-way-flight-payment.ejs', {
        userInfo: req.session.userInfo,
        searchInfo: req.session.ticketsInfo.searchInfo,
        paymentInfo: req.body,
        firstTickets: req.session.flightTicketsBookingInfo,
    });
}

let oneWayProcessBooking = async (req, res) => {
    let twoWayTickets = req.body;
    let userId = req.session.userInfo.user.id;
    let searchInfo = req.session.ticketsInfo.searchInfo;
    let adults = +searchInfo.adults;
    let children = +searchInfo.children;
    let baby = +searchInfo.baby;
    let people = [adults, children, baby];
    try {
        console.log(twoWayTickets.firstTicketsId.split(','), people, userId);
        await flightsServices.datVeMayBayServices(twoWayTickets.firstTicketsId.split(','), people, userId);
        res.render('flights/flights-booking-success.ejs', {
            userInfo: req.session.userInfo,
            message: "Đặt vé thành công"
        })
    } catch (error) {
        res.json("Dat ve that bai");
    }
}
module.exports = {
    flightsList,
    getTicketsListApi,
    ticketsSearch,
    ticketsFilter,
    ticketsReturnSearch,
    authBeforeBookingTickets,
    oneWayBooking,
    twoWayBooking,
    twoWayPayment,
    twoWayProcessBooking,
    oneWayPayment,
    oneWayProcessBooking,
    test,
}