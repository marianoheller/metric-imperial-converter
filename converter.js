
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

    const units = conversions.reduce( (units, e) => units = [ ...units, ...e.units], [] );
    if ( !conversions.some( (conversion) => input.includes(conversion.units[0]) || input.includes(conversion.units[1])) ) {
        return res.send("invalid unit");
    }
    
    const conversion = conversions.find( (conversion) => input.includes(conversion.units[0]) || input.includes(conversion.units[1]));
    const indexUnitInput = conversion.units.findIndex( (unit) => input.includes(unit) );
    const splitted = input.split(conversion.units[indexUnitInput]).filter( (substr) => substr );
    // falta checkear que no haya numero y rellenarlo con 1
    if ( splitted.length > 1 ) {
        return res.send("invalid unit");
    }

    if ( splitted.length === 0 ) splitted[0] = '1';
    const parsedInput = splitted[0].split('/').reduce( (acc, d, i) => {
        if ( i === 0) acc = parseFloat(d);
        else acc = acc/parseFloat(d);
        return acc;
    }, 0 );
    if ( !isNumeric(parsedInput) ) {
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