
const conversions = [
    {
        units: [ 'gal', 'L'],
        names: [ 'gallons', 'liters'],
        relation: 3.78541,
    },
    {
        units: [ 'lbs', 'kg'],
        names: [ 'pounds', 'kilograms'],
        relation: 0.453592,
    },
    {
        units: [ 'mi', 'km'],
        names: [ 'miles', 'kilometers'],
        relation: 1.60934,
    }
];



const mwParser = function ( req, res, next) {
	if (!req.query.input) return res.sendStatus(400);
    const { input } = req.query;
    const errors = {
        invalidUnit: false,
        invalidNumber: false,
    }

    const units = conversions.reduce( (units, e) => units = [ ...units, ...e.units], [] );
    
    const conversion = conversions.find( (conversion) => input.includes(conversion.units[0]) || input.includes(conversion.units[1]));
    if ( !conversion ) errors.invalidUnit = true;
    else {
        var indexUnitInput = conversion.units.findIndex( (unit) => input.includes(unit) );

        let numberString = input.substring(0, input.indexOf(conversion.units[indexUnitInput]));
        let postUnitString = input.substring(input.indexOf(conversion.units[indexUnitInput]) + conversion.units[indexUnitInput].length );

        if ( numberString.length === 0 ) numberString = '1';
        if ( postUnitString.length ) errors.invalidUnit = true;        

        var output = numberString.split('/').reduce( (acc, d, i) => {
            if ( i === 0) acc = Number(d);
            else {
                if ( !isNumeric(acc) ) acc;
                else acc = acc/Number(d);
            }
            return acc;
        }, 0 );
        if ( !isNumeric(output) ) errors.invalidNumber = true;
    }
    
    if( errors.invalidNumber && errors.invalidUnit ) return res.send('invalid number and unit');
    if( errors.invalidNumber ) return res.send('invalid number');
    if( errors.invalidUnit ) return res.send('invalid unit');

    req.conversion = {
        initNum: Number(output.toFixed(5)), 
        initUnit: conversion.units[indexUnitInput],
    }
    next();
}


const mwConverter = function( req, res, next) {
    if (!req.conversion) return res.sendStatus(400);
    if (!req.conversion.initNum) return res.sendStatus(400);
    if (!req.conversion.initUnit) return res.sendStatus(400);
    const { initNum, initUnit } = req.conversion;
    const conversionConfig = conversions.find( (conversion) => initUnit.includes(conversion.units[0]) || initUnit.includes(conversion.units[1]));
    const returnUnitIndex = ( conversionConfig.units.findIndex( (unit) => initUnit===unit ) + 1 ) % 2;
    const returnNum = (function() {
        if( returnUnitIndex === 1) return parseFloat((initNum*conversionConfig.relation).toFixed(5));
        else return parseFloat( (initNum/conversionConfig.relation).toFixed(5) );

    })();
    req.conversion.returnNum = returnNum;
    req.conversion.returnUnit = conversionConfig.units[returnUnitIndex];
    req.conversion.string = `\
    ${req.conversion.initNum} \
    ${conversionConfig.names[(returnUnitIndex+1)%2]} \
    converts to \
    ${returnNum} \
    ${conversionConfig.names[returnUnitIndex]}`
	next();
}




function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}



module.exports = {
    mwParser: mwParser,
    mwConverter: mwConverter,
    conversions: conversions
}