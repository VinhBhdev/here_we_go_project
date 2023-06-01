let baggage1Element = document.querySelector('.baggage-flight');
let baggage2Element = document.querySelector('.baggage-flight-2');

let extraFee1 = baggage1Element.querySelectorAll('[name="extra-baggage"]');
let extraFee2 = baggage2Element.querySelectorAll('[name="extra-baggage-2"]');

let extraFee1Box = document.querySelector('.extra-fee-1-box');
let extraFee2Box = document.querySelector('.extra-fee-2-box');

let extraFee1Number = document.querySelector('.extra-fee-1-number');
let extraFee2Number = document.querySelector('.extra-fee-2-number');

let insuranceChecks = document.querySelectorAll('[name="insurance"]');
let insuranceBox = document.querySelector('.insurance-box');
let insuranceNumber = document.querySelector('.insurance-number');

extraFee1Box.style.display = "none";
extraFee2Box.style.display = "none";
insuranceBox.style.display = "none";

insuranceChecks.forEach((item, index) => {
    item.oninput = function () {
        let num = item.value;
        if (num === "0") {
            insuranceNumber.innerHTML = num + " ₫";
            insuranceBox.style.display = "none";

        }
        else {
            insuranceBox.style.display = "flex";
            insuranceNumber.innerHTML = num + " ₫";
        }
        computeTotalPrice();
    }
})


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

// computeTotalPrice();
extraFee1.forEach((item, index) => {
    item.oninput = function () {
        if (index === 0) extraFee1Box.style.display = "none";
        else extraFee1Box.style.display = "flex";
        extraFee1Number.innerHTML = item.value + " ₫";
        computeTotalPrice();
    }

})

extraFee2.forEach((item, index) => {
    item.oninput = function () {
        if (index === 0) extraFee2Box.style.display = "none";
        else extraFee2Box.style.display = "flex";
        extraFee2Number.innerHTML = item.value + " ₫";
        computeTotalPrice()
    }

})


function toNumber(price) {
    let res = '';
    for (let i = 0; i < price.length; i++) {
        let c = price[i];
        if (c >= '0' && c <= '9') {
            res += c;
        }
    }
    return +res;
}
computeTotalPrice();
function computeTotalPrice() {
    let priceBillElements = Array.from(document.querySelectorAll('.price-bill'));
    let priceDetailBox = Array.from(document.querySelectorAll('.price-detail'));
    let billPriceDetail = Array.from(document.querySelectorAll('.bill-price-detail'));
    let result = priceBillElements.reduce((sum, item) => {
        sum += toNumber(item.innerText);
        return sum;
    }, 0)
    priceBillElements.forEach((item, index) => {
        if (toNumber(item.innerText) === 0) {
            priceDetailBox[index].style.display = 'none';
        }
        else {
            priceDetailBox[index].style.display = 'flex';
        }
        billPriceDetail[index].value = xulyTien(toNumber(item.innerText));
    })
    billPriceDetail[billPriceDetail.length - 1].value = xulyTien(result);

    document.querySelector('.total-price-include-extra-fee').innerHTML = xulyTien(result) + " ₫";
}

