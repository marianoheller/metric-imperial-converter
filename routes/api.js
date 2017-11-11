/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const { mwParser, mwConverter } = require('../middleware/converter');

module.exports = function (app) {

    app.get('/convert', mwParser, mwConverter,  function( req, res) {
        if( !req.conversion ) res.status(500).send("Ocurrio un error al intentar convertir");
        res.json(req.conversion)
    })

    
};
