import express from 'express';
import siteController from '../controllers/site.controllers';

const siteRouter = express.Router();

siteRouter.get('/', siteController.showHomePage);

siteRouter.get('/signin', siteController.getSignin);
siteRouter.post('/signin', siteController.postSignin);
siteRouter.get('/signup', siteController.getSignup);
siteRouter.post('/signup', siteController.postSignup);
siteRouter.get('/signout', siteController.getSignout);
siteRouter.get('/user-info', siteController.getUserInfo);
siteRouter.post('/auth-before-booking-hotels', siteController.authBeforBookingHotels)
module.exports = siteRouter;