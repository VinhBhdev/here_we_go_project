import pool from "../configs/configDB";

let datVeMayBayServices = async (ticketsId, people, userId) => {
    let numberOfPeople = 0;
    for (let i = 0; i < ticketsId.length; i++) {
        console.log("i = " + i);
        if (people[i]) {
            await pool.execute(
                `insert into datvemaybay
            values(null, ${ticketsId[i]}, ${userId}, ${people[i]}, now())`)
            numberOfPeople += people[i];
        }
    }
    await pool.execute(`
        update chuyenbay_hangghe as CBHG
        set soLuongHangGhe = soLuongHangGhe - ${numberOfPeople}
        where (idCB, idHG) in (select idCB, idHG
        from vemaybay
        where idVMB = ${ticketsId[0]});
    `)
}

module.exports = {
    datVeMayBayServices
}