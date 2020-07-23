var express = require('express');
var exphbs  = require('express-handlebars');
var cors = require('cors')
const mercadopago = require ('mercadopago');
mercadopago.configure({
    access_token: 'TEST-4810749615636979-022920-32ef3bbc2b8d5497662fe21661515b92-233164701'
  });
 
var app = express();
app.use(cors())
// configurar cabeceras http
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE");
    next();
});

var preferences;
var payer={
    name:"Lalo",
    surname:"Landa",
    email:"test_user_63274575@testuser.com",
    phone:{
        area_code:"11",
        number:"22223333"
    },
    address:{
        zip_code:"1111",
        street_name:"False",
        street_number:123
    }
}

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/pendingPayment', function(req,res){
    res.render('pendingPayment');
})

app.get('/successPayment', function(req,res){
    res.render('successPayment');
})


app.get('/failurePayment', function(req,res){
    res.render('failurePayment');
})

app.post('/procesar-pago', (req,res)=>{
    mercadopago.preferences.create(preferences)
    .then(function(response){
    // Este valor reemplazará el string "$$init_point$$" en tu HTML
    global.init_point = response.body.init_point;
    console.log(response)
    }).catch(function(error){
        console.log(error)
    console.log(error);
    });
})

app.get('/detail', function (req, res) {
    console.log(req.query)
    preferences = {
        items:[{
            title: req.query.title,
            description: "Dispositivo móvil de Tienda e-commerce",
            img: req.query.img,
            quantity: parseInt(req.query.unit),
            unit_price: parseFloat(req.query.price)
            }
        ],
        payer:payer,
        payment_methods:{
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
            installments: 6
        },
        notification_url:'http://localhost:3000/',
        back_urls:{
            success:'http://localhost:3000/successPayment?collection_id=[PAYMENT_ID]'+
            '&collection_status=approved&external_reference=[EXTERNAL_REFERENCE]'+
            '&payment_type=credit_card&preference_id=[PREFERENCE_ID]&site_id'+
            '=[SITE_ID]&processing_mode=aggregator&merchant_account_id=null',
            pending:'http://localhost:3000/pendingPayment',
            failure:'http://localhost:3000/failurePayment'
        },
        external_reference: "fabioalbertocataldo@gmail.com"
    };
    res.render('detail', req.query);
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.listen(3000);

