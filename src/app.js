const express = require("express");
const app = express();

app.use("/test", (req, res) => {
    res.send("Curious test");
});
app.use("/", (req, res) => {
    res.send("Here starts  Backend Learning");
});

app.listen(7777);