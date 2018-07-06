
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

String.prototype.includesMine = exp => {
  const re = new RegExp(exp,"i");
  return Boolean(this.match(re));
}

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

const getNum = input => {
  const units = conversions.reduce( (units, e) => units = [ ...units, ...e.units], [] );
  const conversion = conversions.find( conversion => input.includes(conversion.units[0]) || input.includes(conversion.units[1]));
  const unit = getUnit(input);
  const inputUnitIndex = conversion.units.findIndex( u => u === unit );
  let numberString = input.substring(0, input.indexOf(conversion.units[inputUnitIndex]));
  if (!numberString) numberString = '1';
  if (numberString.split('/').length > 2) throw Error('Too many divisions');
  const output = numberString.split('/').reduce( (acc, d, i) => {
    if ( i === 0) acc = Number(d);
    else {
      if ( !isNumeric(acc) ) acc;
      else acc = acc/Number(d);
    }
    return acc;
  }, 0 );
  return  Number(output.toFixed(5));
};

const getUnit = input => {
  const units = conversions.reduce( (units, e) => units = [ ...units, ...e.units], [] );
  let inputUnitIndex;
  const conversion = conversions.find( conversion => {
    return conversion.units.some((u,i) => {
      var ret = false;
      if(u !== 'L') {
        const re = new RegExp(u, 'i');
        ret = Boolean(input.match(re));
      }
      else {
        const re = new RegExp(`.*[L|l]$`);
        ret = Boolean(input.match(re));
      }
      if (ret) inputUnitIndex = i;
      return ret;
    })
  });
  console.log("LOGGG", input, conversion);
  if(!conversion) throw Error("Invalid unit");
  return conversion.units[inputUnitIndex];
};

const getReturnUnit = unit => {
  const conversion = conversions.find( conversion => conversion.units.find(u => u === unit));
  const inputUnitIndex = conversion.units.findIndex( u => u === unit );
  return conversion.units[(inputUnitIndex + 1) % 2];
};

const spellOutUnit = unit => {
  const conversion = conversions.find( conversion => conversion.units.find(u => u === unit));
  const unitIndex = conversion.units.findIndex( u => u === unit );
  return conversion.names[unitIndex];
};

const convert = (num, unit) => {
  const conversionConfig = conversions.find( ({ units }) => units.find( u => u === unit ));
  const returnUnit = getReturnUnit(unit);
  const returnUnitIndex = conversionConfig.units.findIndex( u => u === returnUnit );
  return parseFloat(parseFloat(returnUnitIndex === 1 ?
    (num*conversionConfig.relation) :
    (num/conversionConfig.relation)
  ).toFixed(5));
};


module.exports = {
  getNum,
  getUnit,
  getReturnUnit,
  spellOutUnit,
  convert,
}