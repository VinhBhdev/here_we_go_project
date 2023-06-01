let ticketsListElement = document.querySelector('.flights-list-content');
let ticketsListApi = 'http://localhost:8000/flights/tickets-search-api?flightType=1&departureFrom=H%C3%A0+N%E1%BB%99i&arrivalTo=%C4%90%C3%A0+N%E1%BA%B5ng&departDate=2023-06-01&returnDate=&adults=3&children=2&baby=1&classType=1';
let searchInfoElement = document.querySelector('#searchInfo');
let searchInfo = JSON.parse(searchInfoElement.value);
console.log(searchInfo);
// let dateTmp = searchInfo.departDate;
// searchInfo.departDate = searchInfo.returnDate;
// searchInfo.returnDate = dateTmp;
// let tmp = searchInfo.departureFrom;
// searchInfo.departureFrom = searchInfo.arrivalTo;
// searchInfo.arrivalTo = tmp;
console.log(searchInfo);
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
let getTicketsList = async (data = searchInfo) => {
    $.ajax({
        url: "/flights/tickets-search-api",
        type: "get", //send it through get method
        data: data,
        success: function (data) {
            console.log(">>>CHECK DATA")
            console.log(data);
            renderTicketList(data);
            handleTicketDetailLink();
        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });

}

function start() {
    getTicketsList();
}
start();


function renderTicketList(data) {
    let htmls = '';
    for (let item of data.ticketsList) {
        htmls += `
        <div class="flight-item-container">
        <div class="flight-item">

            <div class="flight-item__airlines">
                ${item.tenHHK}
            </div>
            <div class="flight-item__info">
                <div class="depart">
                    <span class="depart-time">
                        ${item.thoiGianCatCanh.gioCatCanh}
                    </span>
                    <div class="depart-place">
                        ${data.searchInfo.departureFrom}
                    </div>
                </div>
                <div class="diff-time">
                    <div class="">
                        <p style="text-align: center; margin-bottom: -2px">
                            ${item.khoangThoiGian}
                        </p>
                        <i class="fa-solid fa-plane-departure"></i>
                        <span>--------------</span>
                        <i class="fa-solid fa-location-dot"></i>
                    </div>`
        if (item.soDiemDung == 0) {
            htmls += `
                        <p style="text-align: center; font-size: 14px;">
                            Bay thẳng
                        </p>`
        } else {
            htmls += `
                        <p style="text-align: center; font-size: 14px;">
                            ${item.soDiemDung} điểm dừng
                        </p>`
        }

        htmls +=
            `</div>
                <div class="arrival">
                    <span class="arrival-time">
                        ${item.thoiGianHaCanh.gioHaCanh}
                    </span>
                    <div class="arrival-place">
                        ${data.searchInfo.arrivalTo}
                    </div>
                </div>
            </div>
            <div class="flight-item__price">
                <div class="price-container">
                    <span class="sale">GIẢM ${item.giaVe[0].uuDai} ₫</span>
                    <div class="old-price">
                        ${item.giaVe[0].giaGoc} ₫
                    </div>
                    <div class="current-price">
                        ${item.giaVe[0].giaHienTai} ₫
                    </div>
                    <form class="booking-form" action="/flights/auth-before-booking-tickets" method="POST">
                    <input hidden type="text" name="idVMB" value="${item.idVMB}">
                    <input hidden type="text" name="idCB" value="${item.idCB}">
                    <input hidden type="text" name="idHHK" value="${item.idHHK}">
                    <input hidden type="text" name="tenHHK" value="${item.tenHHK}">
                    <input hidden type="text" name="userPay" value="${item.userPay}">
                    <input hidden type="text" name="adultsTicketPrice" value="${item.giaVe[0].giaHienTai}">
                    <input hidden type="text" name="childrenTicketPrice" value="${item.giaVe[1].giaHienTai}">
                    <input hidden type="text" name="babyTicketPrice" value="${item.giaVe[2].giaHienTai}">

                    <input hidden type="text" name="ngayCatCanh" value="${item.thoiGianCatCanh.ngayCatCanh}">
                    <input hidden type="text" name="gioCatCanh" value="${item.thoiGianCatCanh.gioCatCanh}">
                    <input hidden type="text" name="ngayHaCanh" value="${item.thoiGianHaCanh.ngayHaCanh}">
                    <input hidden type="text" name="gioHaCanh" value="${item.thoiGianHaCanh.gioHaCanh}">
                    <input hidden type="text" name="khoangThoiGian" value="${item.khoangThoiGian}">
                    <input hidden type="text" name="tenSanBay1" value="${item.tenSanBay1}">
                    <input hidden type="text" name="tenSanBay2" value="${item.tenSanBay2}">
                    <input hidden type="text" name="soDiemDung" value="${item.soDiemDung}">
                    <button class="btn btn-info mt-2 booking-btn">CHỌN</button>

                    </form>
                    
                    <!-- <div class="flight-detail-link">Xem chi tiết</div> -->
                </div>
            </div>
        </div>
        <div class="flight-detail-link-container">
            <div class="delail-links">
                <span class="flight-detail-link">Xem chi tiết</span>
                <span class="flight-detail-link">Giá tiền và chính sách</span>
                <span class="flight-detail-link">Hoàn tiền</span>
                <span class="flight-detail-link">Đổi lịch</span>
            </div>

            <span class="close-all-links">
                Thu gọn
                <i class="fa-solid fa-caret-up"></i>

            </span>
            <span class="open-all-links">
                Mở rộng
                <i class="fa-solid fa-caret-down"></i>
            </span>
        </div>
        <hr>
        <div class="flight-detail flight-detail-1">
            <hr>
            <div class="flight-detail-time">
                <div class="depart-time-2">
                    ${item.thoiGianCatCanh.gioCatCanh}<br>
                        ${item.thoiGianCatCanh.ngayCatCanh}
                </div>
                <span style="opacity: 0.4;">|</span>
                <span style="opacity: 0.4;">|</span>
                <span style="opacity: 0.4;">|</span>
                <div class="time-diff" style="opacity: 0.7; font-size: 12px">
                    ${item.khoangThoiGian}
                </div>
                <span style="opacity: 0.4;">|</span>
                <span style="opacity: 0.4;">|</span>
                <span style="opacity: 0.4;">|</span>
                <div class="arrival-time-2">
                    ${item.thoiGianHaCanh.gioHaCanh}<br>
                        ${item.thoiGianHaCanh.ngayHaCanh}
                </div>
            </div>
            <hr>
            <div class="flight-detail-info">
                <p class="airport depart-airport">${item.tenSanBay1}</p>
                <div class="airline-name">Vietnam Airlines</div>
                <div class="airline-id">VN 6077</div>
                <div class="class-type">Hạng phổ thông</div>
                <div class="plane-detail">
                    <span>A320 Máy bay phản lực thân hẹp</span><br>
                    <span>Sẵn có đồ uống có cồn (Trả phí)</span><br>
                    <span>Sẵn có đồ ăn nhẹ (Trả phí)</span><br>
                    <span>Cách bố trí 3-3</span><br>
                </div>
                <br>
                <p class="airport arrival-airport">${item.tenSanBay2}</p>
            </div>
        </div>
        <div class="flight-detail flight-detail-2">
            <div class="condition">
                <div class="title">Điều kiện</div>
                <p>${data.searchInfo.departureFrom} -> ${data.searchInfo.arrivalTo}</p>
                <span>Khuyến mại</span>

                <div class="policy">
                    <div class="return-ticket"><i class="fa-regular fa-thumbs-up"></i> Được hoàn vé
                    </div>
                    <div class="reschedule"><i class="fa-regular fa-thumbs-up"></i> Đổi lịch có sẵn
                    </div>
                </div>
            </div>
            <div class="price-detail">
                <div class="title">Chi tiết giá</div>

                <div class="price-calculate">
                    <div class="people-price-row">
                        <span>Vé người lớn cơ bản (x${data.searchInfo.adults})</span>
                        <span>
                            ${item.giaVe[0].tongGia} VND
                        </span>
                    </div>
                    <div class="people-price-row">
                        <span>Vé trẻ em cơ bản (x${data.searchInfo.children})</span>
                        <span>
                            ${item.giaVe[1].tongGia} VND
                        </span>
                    </div>
                    <div class="people-price-row">
                        <span>Vé trẻ sơ sinh cơ bản (x${data.searchInfo.baby})</span>
                        <span>
                            ${item.giaVe[2].tongGia} VND
                        </span>
                    </div>
                    <div class="tax grey-color">
                        <span>Thuế</span>
                        <span>Đã bao gồm</span>
                    </div>
                    <hr>
                    <div class="total-price .grey-color">
                        <b>Bạn trả</b>
                        <b>
                            ${item.userPay} VND
                        </b>
                    </div>
                </div>
            </div>
        </div>

        <div class="flight-detail flight-detail-3 refund-container">
            <div class="refund-sub-nav">
                <div class="refund-item-title">Chính sách hoàn tiền của bạn</div>
                <div class="refund-item-title">Ước tính tiền hoàn lại</div>
                <div class="refund-item-title">Quy trình hoàn lại vé</div>
                <div class="refund-item-title">Thông tin hoàn lại tiền khác</div>
            </div>
            <div class="refund-content">
                <div class="title">Chính sách</div>
                <div class="refund-detail">
                    <span>Vietravel Airlines</span><br>
                    <span class="grey-color">Hà Nội → Đà Nẵng</span>
                    <div class="refund-result">
                        <i class="fa-solid fa-circle-check"></i> Có thể hoàn vé
                    </div>
                    <ul class="refund-reason">
                        Hoàn lại tiền được áp dụng vì (các) lý do sau:
                        <li>
                            Tự hủy (thay đổi kế hoạch)</li>
                        <li>
                            Đau ốm (bao gồm dương tính với COVID-19)</li>
                        <li>
                            Bất khả kháng</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="flight-detail flight-detail-4 reschedule-container">
            <div class="reschedule-header">
                <p>Vietnam Airlines</p>
                <span class="grey-color">Hà Nội → Đà Nẵng</span>
                <div class="reschedule-result">
                    <i class="fa-solid fa-circle-check"></i> Có áp dụng đổi lịch bay
                </div>
            </div>

            <div class="reschedule-body">
                <div class="reschedule-sub-nav">
                    <div class="reschedule-title">Chính sách Chung về Đổi lịch Thường xuyên</div>
                    <div class="reschedule-title">Thời hạn đổi lịch bay</div>
                    <div class="reschedule-title">Phí đổi lịch bay</div>
                    <div class="reschedule-title">Đổi lịch trình</div>
                </div>
                <div class="reschedule-content">
                    <div class="title">Chính sách</div>
                    <p class="grey-color">Nếu bạn đổi lịch chuyến bay, bạn sẽ có thể thay đổi:</p>
                    <div class="reschedule-option">
                        <div class="reschedule-item">
                            <i class="fa-solid fa-check success-color"></i>
                            <span>Giờ khởi hành</span>
                        </div>
                        <div class="reschedule-item">
                            <i class="fa-sharp fa-solid fa-xmark"></i>
                            <span>Lộ trình di chuyển</span>
                        </div>
                        <div class="reschedule-item">
                            <i class="fa-sharp fa-solid fa-xmark"></i>
                            <span>Hãng hàng không</span>
                        </div>
                    </div>
                    <ul class="reschedule-policy grey-color">

                        <li>Easy Reschedule chỉ áp dụng để đổi ngày bay.</li>
                        <li>Traveloka sẽ thông báo tổng giá tiền chuyến bay mới của bạn qua email,
                            thông
                            báo đẩy, hoặc Hộp thư của tôi trên ứng dụng Traveloka.</li>
                        <li>Tiến trình đổi lịch bay có thể lên đến 1 giờ.</li>
                        <li>Đổi lịch bay phải được áp dụng với tất cả chuyến bay với cùng một mã đặt
                            chỗ
                            trên hệ thống hãng (PNR).</li>
                    </ul>
                </div>
            </div>


        </div>
    </div>
        `

    }
    if (htmls === '') {
        htmls = '<div class="btn btn-danger text-center">Không tìm thấy chuyến bay nào phù hợp</div>'
    }
    ticketsListElement.innerHTML = htmls;
}
function handleTicketDetailLink() {
    const numberOfDetail = 4;
    let flightDetailElements = document.querySelectorAll('.flight-detail');
    let flightDetailLinks = document.querySelectorAll('.flight-detail-link');
    let closeAllLinksElements = document.querySelectorAll('.close-all-links');
    let openAllLinksElements = document.querySelectorAll('.open-all-links');
    for (let item of flightDetailElements) {
        item.style.display = "none";
    }
    for (let item of closeAllLinksElements) {
        item.style.display = "none";
    }
    flightDetailLinks.forEach((item, index) => {
        item.onclick = function () {
            let st = parseInt(index / numberOfDetail) * numberOfDetail;
            let ed = parseInt(index / numberOfDetail + 1) * numberOfDetail;
            for (let i = st; i < ed; i++) {
                flightDetailElements[i].style.display = "none";
                flightDetailLinks[i].style.border = "none";
            }
            if (index % 4 != 3)
                flightDetailElements[index].style.display = "flex";
            else
                flightDetailElements[index].style.display = "block";
            flightDetailLinks[index].style.borderBottom = "3px solid rgb(1, 148, 243)";
            openAllLinksElements[parseInt(index / numberOfDetail)].style.display = "none";
            closeAllLinksElements[parseInt(index / numberOfDetail)].style.display = "block";
        }
    })
    openAllLinksElements.forEach((item, index) => {
        item.onclick = function () {
            let i = index * numberOfDetail;
            flightDetailElements[i].style.display = "flex";
            openAllLinksElements[index].style.display = "none";
            closeAllLinksElements[index].style.display = "block";
        }
    })
    closeAllLinksElements.forEach((item, index) => {
        item.onclick = function () {
            let st = index * numberOfDetail;
            let ed = (index + 1) * numberOfDetail;
            for (let i = st; i < ed; i++) {
                flightDetailElements[i].style.display = "none";
            }
            closeAllLinksElements[index].style.display = "none";
            openAllLinksElements[index].style.display = "block";
        }
    })
    // let bookingForms = document.querySelectorAll('.booking-form');
    // let bookingBtns = document.querySelectorAll('.booking-btn');
    // for (let bookingForm of bookingForms) {

    //     bookingForm.onsubmit = function (e) {
    //         e.preventDefault();
    //         alert('Hi');
    //         if (5 % 2 == 1) e.submit();
    //     }
    // }


}


