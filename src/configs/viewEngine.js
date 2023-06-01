import express from 'express';

const configViewEngine = (app) => {
    app.use(express.static('./src/public')) // can access public static file such as img, css, js, ... in public folder
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
}

export default configViewEngine;