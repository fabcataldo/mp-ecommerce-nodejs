var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const PaymentController = require("./controllers/PaymentController");
const PaymentService = require("./services/PaymentService"); 
const PaymentControllerObj = new PaymentController(new PaymentService()); 
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static('assets'));
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs());
app.use(cookieParser());
app.use(logger('dev'));
app.set('view engine', 'handlebars');
app.use('/assets', express.static(__dirname + '/assets'));


const mercadopago = require ('mercadopago');
mercadopago.configure({
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
});


var payer={
    id: "471923173",
    type: "registered",
    name:"Lalo",
    surname:"Landa",
    email:"test_user_63274575@testuser.com",
    phone:{
        area_code:"11",
        number:"22223333"
    },
    identification: {
        type: "DNI",
        number: "12345678"
    },
    address:{
        zip_code:"1111",
        street_name:"False",
        street_number:123
    }
}
var preferences = {
    payer: payer
};




app.get('/', function (req, res) {
    res.render('home');
});

app.get('/pendingPayment', function(req,res){
    res.render('pendingPayment');
})

app.get('/successPayment', function(req,res){
    res.render('successPayment', req.query);
})

app.get('/failurePayment', function(req,res){
    res.render('failurePayment');
})

app.post("/webhook", (req, res) => {
    PaymentControllerObj.webhook(req,res);
});

app.post('/procesar-pago', (req,res)=>{
    PaymentControllerObj.getMercadoPagoLink(preferences, req ,res);    
})

app.get('/detail', function (req, res) {
    preferences.items = [
        {
            id: "1234",
            title: req.query.title,
            description: "Dispositivo móvil de Tienda e-commerce",
            img: req.query.img,
            quantity: parseInt(req.query.unit),
            category_id: "1234",
            currency_id: "ARS",
            unit_price: parseFloat(req.query.price)
            }
    ];
    preferences.payment_methods = {
            excluded_payment_methods:[
                {
                    id:'amex',
                }
            ],
            excluded_payment_types:[
                {
                    id:'atm'
                }
            ],
            installments: 6,
            default_installments: 6
    }
    preferences.notification_url ='https://fabcataldo-mp-commerce-nodejs.herokuapp.com/webhook';
    preferences.back_urls = {
            success:'https://localhost:3000/successPayment',
            pending:'https://localhost:3000/pendingPayment',
            failure:'https://localhost:3000/failurePayment'
    }
    preferences.auto_return =  'approved';
    preferences.external_reference = "fabioalbertocataldo@gmail.com";
    res.render('detail', req.query);
});

app.listen(3000);

