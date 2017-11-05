const express = require('express')
const app = express()

const { mwParser, mwConverter } = require('./converter');



app.set('view engine', 'pug');
app.use(express.static('public'))




app.get('/', function (req, res) {
	res.render('index', { message: 'Hello there!' })
})

app.get('/convert', mwParser, mwConverter,  function( req, res) {
	if( !req.output ) res.status(500).send("Ocurrio un error al intentar convertir");
	res.json(req.conversion)
})


app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})


