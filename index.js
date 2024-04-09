const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
const PORT = process.env.PORT || 3000;

let submissions = [];

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
});

