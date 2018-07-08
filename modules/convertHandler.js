const conversions = require('./conversions');

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

String.prototype.includesMine = exp => {
  const re = new RegExp(exp,"i");
  return Boolean(this.match(re));
}

const getConversion = input => {
  const conversion = conversions.find( ({ inputUnit }) => {
    const { symbol } = inputUnit;
    const re = new RegExp(`([0-9]|^)${symbol}$`, 'i');
    return Boolean(input.match(re));
  });
  if(!conversion) throw Error("Invalid unit");
  return conversion;
};

const getUnit = input => {
  const conversion = getConversion(input);
  return conversion.inputUnit.symbol;
};

const getNum = input => {
  const conversion = getConversion(input);
  let numberString = input.substring(0, input.indexOf(conversion.inputUnit.symbol));
  if (!numberString) numberString = '1';
  if (numberString.split('/').length > 2) throw Error('Too many divisions');
  const output = numberString.split('/').reduce( (acc, d, i) => {
    if ( i === 0) acc = Number(d);
    else if ( isNumeric(acc) ) acc = acc/Number(d);
    return acc;
  }, 0 );
  if ( !isNumeric(output) ) throw Error('Parsing error');
  return  Number(output.toFixed(5));
};

const getReturnUnit = unit => {
  const conversion = conversions.find( ({ inputUnit }) => inputUnit.symbol === unit );
  return conversion.outputUnit.symbol;
};

const spellOutUnit = unit => {
  const units = conversions.reduce( (acc, conv) => 
    [ ...acc, conv.inputUnit, conv.outputUnit],
    []
  );
  const targetUnit = units.find( u => u.symbol === unit);
  return targetUnit.name;
};

const convert = (num, unit) => {
  const conversion = getConversion(`${num}${unit}`);
  return parseFloat(parseFloat((num*conversion.relation)).toFixed(5));
};


module.exports = {
  getConversion,
  getNum,
  getUnit,
  getReturnUnit,
  spellOutUnit,
  convert,
}