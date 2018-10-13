const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/arexa');


app.get("/", function(req, res) {
	res.send("Suh dude");
});