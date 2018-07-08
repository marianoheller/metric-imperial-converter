
const conversions = [
  {
    inputUnit: {
      symbol: 'gal',
      name: 'gallons',
    },
    outputUnit: {
      symbol: 'L',
      name: 'liters',
    },
    relation: 3.78541,
  },
  {
    inputUnit: {
      symbol: 'L',
      name: 'liters',
    },
    outputUnit: {
      symbol: 'gal',
      name: 'gallons',
    },
    relation: 1/3.78541,
  },
  {
    inputUnit: {
      symbol: 'lbs',
      name: 'pounds',
    },
    outputUnit: {
      symbol: 'kg',
      name: 'kilograms',
    },
    relation: 0.453592,
  },
  {
    inputUnit: {
      symbol: 'kg',
      name: 'kilograms',
    },
    outputUnit: {
      symbol: 'lbs',
      name: 'pounds',
    },
    relation: 1/0.453592,
  },
  {
    inputUnit: {
      symbol: 'mi',
      name: 'miles',
    },
    outputUnit: {
      symbol: 'km',
      name: 'kilometers',
    },
    relation: 1.60934,
  },
  {
    inputUnit: {
      symbol: 'km',
      name: 'kilometers',
    },
    outputUnit: {
      symbol: 'mi',
      name: 'miles',
    },
    relation: 1/1.60934,
  },
]


module.exports = conversions;