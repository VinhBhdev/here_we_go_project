
let res = ''
for (let i = 5; i <= 12; i++) {
    let s = `insert into LoaiPhong
    values(null, ${i}, 2, 1, 0, 0, 24, 'Biển', 'Standard 2 giường đơn'),
    (null, ${i}, 0, 2, 2, 0, 22, 'Biển', 'Superior giường đôi Hướng phố (Superior Double City View)'),
    (null, ${i}, 0, 2, 1, 0, 24, 'Núi', 'Phòng Đôi Cao Cấp (Superior Double Room)'),
    (null, ${i}, 2, 3, 0, 0, 30, 'Núi', 'Phòng Grande Deluxe 2 giường (Grand Deluxe Twin Room)'),`
}

console.log(res) 