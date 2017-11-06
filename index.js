const express = require('express');
const app = express();
const morgan = require('morgan');

const { mwParser, mwConverter } = require('./converter');



app.set('view engine', 'pug');
app.use(express.static('public'))


// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

app.get('/', function (req, res) {
	res.render('index', { message: 'Hello there!' })
})

app.get('/convert', mwParser, mwConverter,  function( req, res) {
	if( !req.conversion ) res.status(500).send("Ocurrio un error al intentar convertir");
	res.json(req.conversion)
})


app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})


