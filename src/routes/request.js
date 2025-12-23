const express = require('express');
const requestRouter = express.Router();

requestRouter.use('/', (req, res) => {
    res.send("This is request Router !!!");
})

module.exports = requestRouter;