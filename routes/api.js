/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var convertHandler = require('../modules/convertHandler');

module.exports = function (app) {

    app.get('/api/convert', function( req, res) {
      if (!req.query.input) return res.sendStatus(400);
      const { input } = req.query;
      try {
        const initNum = convertHandler.getNum(input);
        const initUnit = convertHandler.getUnit(input);
        const returnNum = convertHandler.convert( initNum, initUnit );
        const returnUnit = convertHandler.getReturnUnit(initUnit);
        res.json({
          initNum,
          initUnit,
          returnNum,
          returnUnit,
          string: `${initNum} ${convertHandler.spellOutUnit(initUnit)} converts to ${returnNum} ${convertHandler.spellOutUnit(returnUnit)}`,
        })
      } catch(err) {
        res.sendStatus(400);
      }
    })

    
};
