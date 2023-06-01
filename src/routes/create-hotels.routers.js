import express from 'express';
import createHotelsController from '../controllers/createHotels.controllers';

const createHotelsRouter = express.Router();

createHotelsRouter.get('/add-hotels', createHotelsController.addHotels);
createHotelsRouter.post('/post-add-hotels', createHotelsController.postAddHotels)
createHotelsRouter.get('/all-hotels', createHotelsController.getAllHotels)
createHotelsRouter.get('/hotel-detail/:id', createHotelsController.getHotelDetail)
createHotelsRouter.get('/add-room-type/:idKS', createHotelsController.addRoomType)
createHotelsRouter.post('/post-add-room-type', createHotelsController.postAddRoomType)
createHotelsRouter.get('/room-type-detail/:idLP', createHotelsController.getRoomTypeDetail)
createHotelsRouter.post('/post-add-room-option', createHotelsController.postAddRoomOption)

module.exports = createHotelsRouter;