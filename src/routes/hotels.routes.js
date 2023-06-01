import express from 'express';
import hotelController from '../controllers/hotel.controllers';

const hotelRouter = express.Router();

hotelRouter.get('/show', hotelController.showAllHotels);
hotelRouter.get('/show', hotelController.showAllHotels);
hotelRouter.get('/search', hotelController.getHotelsSearch);

hotelRouter.get('/hotels-search-api', hotelController.handleHotelsSearch);
hotelRouter.get('/detail/:idKS', hotelController.showHotelDetail);
hotelRouter.get('/detail/:idKS/sort-by-price', hotelController.sortByPrice);
hotelRouter.get('/booking', hotelController.booking);
hotelRouter.post('/booking-process', hotelController.bookingProcess);
hotelRouter.get('/test', (req, res) => {
    console.log("HI")
    res.render('hotels/hotel-booking-success.ejs', {
        message: "Đặt phòng thành công!"
    });
})
module.exports = hotelRouter;