import hotelsRoute from './hotels.routes'
import siteRoute from './site.routes';
import flightRoute from './flights.routes';
import createHotelsRoute from './create-hotels.routers'
const initWebRoute = (app) => {

    app.use('/hotels', hotelsRoute);
    app.use('/flights', flightRoute);
    app.use('/create-hotels', createHotelsRoute);
    return app.use('/', siteRoute);
}

module.exports = initWebRoute;