
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
        res.status(200).send();
    }
    else {
        const conversion = conversions.find( (conversion) => input.includes(conversion.units[0]) || input.includes(conversion.units[1]));
        const indexUnitInput = conversion.units.findIndex( (unit) => input.includes(unit) );
        const splitted = input.split(conversion[indexUnitInput]).filter( (substr) => substr );
        // falta checkear que no haya numero y rellenarlo con 1
        if ( splitted.length > 1 ) res.send("invalid unit");
        if ( splitted.length === 0 ) splitted[0] = '1';
        const parsedInput = splitted[0].split('/').reduce( (acc, d, i) => {
            if ( i === 0) acc = parseFloat(d);
            return acc;
        }, 0 );
        if ( !isNumeric(parsedInput) ) res.send("invalid unit");
        else {
            req.conversion = {
                initNum: parsedInput, 
                initUnit: conversion.units[indexUnitInput],
            }
            next();
        }
    }
}


const mwConverter = function( req, res, next) {
	if (!req.query.input) return res.sendStatus(400);

	
	req.output = {
		...req.conversion,
	};
	next();
}




function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}



module.exports = {
    mwParser: mwParser,
    mwConverter: mwConverter
}