import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoute from './routes/web'
import session from 'express-session';
import cors from 'cors';

const app = express();

require('dotenv').config();

const port = process.env.PORT;


// middleware to read req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true }))

app.use(session(
  {
    secret: "Your secret key",
    cookie: { secure: false }
  }));


configViewEngine(app);
initWebRoute(app);


//middleware 404 not found
app.use((req, res) => {
  res.render('error-handling/404.ejs');
})

app.listen(port, () => {
  console.log(`HERE WE GO listening on port ${port}`)
})