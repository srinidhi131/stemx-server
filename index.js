const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const infoRoutes = express.Router();
let Info = require('./infomodel');
var nodemailer = require('nodemailer');

app.use(cors());
app.use(bodyParser.json());
app.use('/info', infoRoutes);

mongoose.connect('mongodb+srv://stemx:winwin123@cluster0.1u2gk.mongodb.net/STEMx?retryWrites=true&w=majority', { useNewUrlParser: true , useUnifiedTopology: true});
const connection = mongoose.connection;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'stemxserver@gmail.com',
      pass: 'tthuvztlnwsezcqe'
    },
    tls: {
        rejectUnauthorized: false
      }
  });

infoRoutes.route('/add').post(async function(req, res) {
    let info = new Info(req.body);
    let data = "";
    data = data.concat('Book a Free Session Data','\n','Name: ',info.name,"\n","Phone: ",info.phone,"\n","Email: ",info.email)
    var mailOptions = {
        from: 'stemxserver@gmail.com',
        to: ['ramanujam@stemx.co.in', 'naveen@stemx.co.in'],
        subject: 'Get in Touch with Us!',
        text: data
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
    await info.save()
        .then(info => {
            res.status(200).json({'info': 'We will get in touch with you'});
        })
        .catch(err => {
            res.status(400).send('Server is busy. Please try again later');
        });
});

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});