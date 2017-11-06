
const conversions = [
    {
        units: [ 'gal', 'L'],
        relation: 3.78541,
    },
    {
        units: [ 'lbs', 'kg'],
        relation: 0.453592,
    },
    {
        units: [ 'mi', 'km'],
        relation: 1.60934,
    }
];



const mwParser = function ( req, res, next) {
	if (!req.query.input) return res.sendStatus(400);
	const { input } = req.query;

    const units = conversions.reduce( (units, e) => units = [ ...units, ...e.units], [] );
    if ( !conversions.some( (conversion) => input.includes(conversion.units[0]) || input.includes(conversion.units[1])) ) {
        console.log('Unit not found');
        return res.status(200).send("invalid unit");
    }
    
    const conversion = conversions.find( (conversion) => input.includes(conversion.units[0]) || input.includes(conversion.units[1]));
    const indexUnitInput = conversion.units.findIndex( (unit) => input.includes(unit) );
    const splitted = input.split(conversion[indexUnitInput]).filter( (substr) => substr );
    // falta checkear que no haya numero y rellenarlo con 1
    if ( splitted.length > 1 ) {
        console.log('Numbers after unit. Invalid unit.');
        return res.status(200).send("invalid unit");
    }

    if ( splitted.length === 0 ) splitted[0] = '1';
    const parsedInput = splitted[0].split('/').reduce( (acc, d, i) => {
        if ( i === 0) acc = parseFloat(d);
        else acc = acc/parseFloat(d);
        return acc;
    }, 0 );
    if ( !isNumeric(parsedInput) ) {
        console.log('Non numeric input');
        return res.send("invalid unit");
    }
    req.conversion = {
        initNum: parseFloat(parsedInput.toFixed(5)), 
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
    req.conversion.string = ""
	next();
}




function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}



module.exports = {
    mwParser: mwParser,
    mwConverter: mwConverter
}