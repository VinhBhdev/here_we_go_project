
let filterData = {
    departTimeBegin: '00:00',
    departTimeEnd: '23:59',
    arrivalTimeBegin: '00:00',
    arrivalTimeEnd: '23:59',
    airlines: [],
    stopOver: [],
    maxPrice: 10000000,
    flightTime: 26,
}

// Lọc theo giá
let priceFilterElement = document.querySelector('.price-filter');
let priceInputElement = priceFilterElement.querySelector('input');
let priceLabelElement = priceFilterElement.querySelector('label');
priceInputElement.onchange = function () {
    let price = (+priceInputElement.value / 100 * 10000000).toFixed(0);
    filterData.maxPrice = price;
    getTicketsFilter();
}
priceInputElement.oninput = function () {
    let price = (+priceInputElement.value / 100 * 10000000).toFixed(0);
    priceLabelElement.innerHTML = "Lên đến " + xulyTien(price) + " ₫"
}
// Lọc theo hãng hàng không
let airlinesFilterElements = document.querySelectorAll('.airlines-filter input');
for (let item of airlinesFilterElements) {
    item.oninput = function () {
        let airlinesResult = [];
        for (let airlines of airlinesFilterElements) {
            if (airlines.checked) {
                airlinesResult.push(airlines.value);
            }
        }
        filterData.airlines = airlinesResult;
        getTicketsFilter();
    }
}

// Lọc theo số lượng điểm dừng
let stopOverFilterElements = document.querySelectorAll('.stopover-filter input');
for (let item of stopOverFilterElements) {
    item.oninput = function () {
        let stopOverResult = [];
        for (let stopOver of stopOverFilterElements) {
            if (stopOver.checked) {
                stopOverResult.push(stopOver.value);
            }
        }
        filterData.stopOver = stopOverResult;
        getTicketsFilter();
    }
}

// Lọc theo số lượng thời gian bay
// let flightTimeElement = document.querySelector('.flight-time-filter');

// flightTimeInputElement.onchange = function () {
//     let flightTime = (+flightTimeInputElement.value / 100 * 26).toFixed(0);
//     filterData.flightTime = flightTime;
//     getTicketsFilter();
// }
// flightTimeInputElement.oninput = function () {
//     let flightTime = (+flightTimeInputElement.value / 100 * 26).toFixed(0);
//     flightTimeLabelElement.innerHTML = "Lên đến " + xulyTien(flightTime) + " ₫"
// }

let departTimeBegin = document.querySelector('.depart-time-begin');
let departTimeEnd = document.querySelector('.depart-time-end');
let arrivalTimeBegin = document.querySelector('.arrival-time-begin');
let arrivalTimeEnd = document.querySelector('.arrival-time-end');
departTimeBegin.onchange = () => { filterData.departTimeBegin = departTimeBegin.value; getTicketsFilter() };
departTimeEnd.onchange = () => { filterData.departTimeEnd = departTimeEnd.value; getTicketsFilter() };
arrivalTimeBegin.onchange = () => { filterData.arrivalTimeBegin = arrivalTimeBegin.value; getTicketsFilter() };
arrivalTimeEnd.onchange = () => { filterData.arrivalTimeEnd = arrivalTimeEnd.value; getTicketsFilter() };

// Xóa bộ lọc
let removeFilterBtn = document.querySelector('.remove-filter');
removeFilterBtn.onclick = clearFilter
function clearFilter() {
    filterData = {
        departTimeBegin: '00:00',
        departTimeEnd: '23:59',
        arrivalTimeBegin: '00:00',
        arrivalTimeEnd: '23:59',
        airlines: [],
        stopOver: [],
        maxPrice: 10000000,
        flightTime: 26,
    }
    departTimeBegin.value = "00:00";
    departTimeEnd.value = "23:59";
    arrivalTimeBegin.value = "00:00";
    arrivalTimeEnd.value = "23:59";


    for (let airlines of airlinesFilterElements) {
        airlines.checked = false;
    }
    priceInputElement.value = 10000000;
    priceLabelElement.value = "Lên đến 10,000,000 ₫"
    getTicketsFilter();
}



//
let sortData = ''
let sortElements = document.querySelectorAll('.sort-section .f2-sort');
for (let item of sortElements) {
    item.onclick = function () {
        let val = item.querySelector('input').value;
        clearFilter();
        sortData = val;
        getTicketsFilter();
    }
}



function getTicketsFilter() {
    $.ajax({
        url: "/flights/tickets-filter",
        type: "get", //send it through get method
        data: {
            filterData: filterData,
            sortData,
        },
        success: function (data) {
            console.log(">>>TEST SORT")
            console.log(data);
            renderTicketList(data);
            handleTicketDetailLink();
        },
        error: function (xhr) {
            alert('NO');
        }
    });
}
