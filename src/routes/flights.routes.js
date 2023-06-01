import express from 'express';
import flightController from '../controllers/flight.controller';

const flightRouter = express.Router();


// flightRouter.get('/search', flightController.getTicketsList);
flightRouter.get('/search', flightController.ticketsSearch);
flightRouter.get('/tickets-search', flightController.ticketsSearch);
flightRouter.get('/tickets-search-api', flightController.getTicketsListApi);
// flightRouter.get('/return-tickets-search-api', flightController.getReturnTicketsListApi);


flightRouter.get('/tickets-filter', flightController.ticketsFilter);
flightRouter.post('/auth-before-booking-tickets', flightController.authBeforeBookingTickets);
flightRouter.post('/tickets-return-search', flightController.ticketsReturnSearch)
flightRouter.get('/one-way-booking', flightController.oneWayBooking)
flightRouter.post('/one-way-payment', flightController.oneWayPayment)

flightRouter.get('/two-way-booking', flightController.twoWayBooking)
flightRouter.post('/two-way-payment', flightController.twoWayPayment)
flightRouter.post('/two-way-process-booking', flightController.twoWayProcessBooking);
flightRouter.post('/one-way-process-booking', flightController.oneWayProcessBooking);
flightRouter.get('/test', flightController.test);
module.exports = flightRouter;