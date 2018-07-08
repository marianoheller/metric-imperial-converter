/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
const spies = require('chai-spies-next');
//const { mwParser, mwConverter, conversions } = require('../middleware/converter');
const convertHandler = require('../modules/convertHandler');
const conversions = require('../modules/conversions');

chai.use(spies);


suite('Unit Tests', function(){
  
  suite('Function convertHandler.getConversion(input)', function() {
    test('Valid inputs', function(done) {
      const inputs = [
        '32gal', '12L',
        '44lbs', '11kg',
        '22mi', '44km',
      ];
      inputs.forEach((input, i) => {
        expect(convertHandler.getConversion(input)).to.equal(conversions[i]);
      });
      return done();
    });
  });
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      expect(convertHandler.getNum('32L')).to.equal(32);
      expect(convertHandler.getNum('12gal')).to.equal(12);
      expect(convertHandler.getNum('122lbs')).to.equal(122);
      expect(convertHandler.getNum('112kg')).to.equal(112);
      expect(convertHandler.getNum('88mi')).to.equal(88);
      expect(convertHandler.getNum('34km')).to.equal(34);
      return done();
    });

    test('Decimal Input', function(done) {
      expect(convertHandler.getNum('32.412L')).to.equal(32.412);
      expect(convertHandler.getNum('12.312gal')).to.equal(12.312);
      expect(convertHandler.getNum('122.45lbs')).to.equal(122.45);
      expect(convertHandler.getNum('112.666kg')).to.equal(112.666);
      expect(convertHandler.getNum('88.76mi')).to.equal(88.76);
      expect(convertHandler.getNum('34.11km')).to.equal(34.11);
      return done();
    });
    
    test('Fractional Input', function(done) {
      expect(convertHandler.getNum('1/2L')).to.equal(1/2);
      expect(convertHandler.getNum('3/4gal')).to.equal(3/4);
      expect(convertHandler.getNum('5/2lbs')).to.equal(5/2);
      expect(convertHandler.getNum('6/2kg')).to.equal(6/2);
      expect(convertHandler.getNum('1/4mi')).to.equal(1/4);
      expect(convertHandler.getNum('3/2km')).to.equal(3/2);
      return done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      expect(convertHandler.getNum('1.2/2L')).to.equal(1.2/2);
      expect(convertHandler.getNum('3.3/4gal')).to.equal(3.3/4);
      expect(convertHandler.getNum('5.4/2lbs')).to.equal(5.4/2);
      expect(convertHandler.getNum('6.5/2kg')).to.equal(6.5/2);
      expect(convertHandler.getNum('1.6/4mi')).to.equal(1.6/4);
      expect(convertHandler.getNum('3.7/2km')).to.equal(3.7/2);
      return done();
    });
    
    test('Invalid Input (double fraction)', function(done) {
      expect(convertHandler.getNum.bind(null, '3.3/4/3L')).to.throw('Too many divisions');
      expect(convertHandler.getNum.bind(null, '3.3/4/3gal')).to.throw('Too many divisions');
      expect(convertHandler.getNum.bind(null, '3.3/4/3lbs')).to.throw('Too many divisions');
      expect(convertHandler.getNum.bind(null, '3.3/4/3kg')).to.throw('Too many divisions');
      expect(convertHandler.getNum.bind(null, '3.3/4/3mi')).to.throw('Too many divisions');
      expect(convertHandler.getNum.bind(null, '3.3/4/3km')).to.throw('Too many divisions');
      return done();
    });
    
    test('No Numerical Input', function(done) {
      expect(convertHandler.getNum('L')).to.equal(1);
      expect(convertHandler.getNum('gal')).to.equal(1);
      expect(convertHandler.getNum('lbs')).to.equal(1);
      expect(convertHandler.getNum('kg')).to.equal(1);
      expect(convertHandler.getNum('mi')).to.equal(1);
      expect(convertHandler.getNum('km')).to.equal(1);
      return done();
    }); 
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
      input.forEach(function(u) {
        expect(convertHandler.getUnit.bind(null,u)).to.not.throw();
      });
      done();
    });
    
    test('Unknown Unit Input', function(done) {
      var input = ['agal','dl','mai','kam','ltbs','qkg','GeAL','WL','RAM','LABS','KGG'];
      input.forEach(function(u) {
        expect(convertHandler.getUnit.bind(null,u)).to.throw('Invalid unit');
      });
      done();
    });  
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','L','mi','km','lbs','kg'];
      var expected = ['L','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        expect(convertHandler.getReturnUnit(ele)).to.equal(expected[i]);
      });
      done();
    });
    
  });  
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','L','mi','km','lbs','kg'];
      var expected = ['gallons','liters','miles', 'kilometers','pounds', 'kilograms'];
      input.forEach(function(ele, i) {
        expect(convertHandler.spellOutUnit(ele)).to.equal(expected[i]);
      });
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      var input = [5, 'gal'];
      var expected = 18.9271;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('L to Gal', function(done) {
      var input = [5, 'L'];
      var expected = 1.32086;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Mi to Km', function(done) {
      var input = [5, 'mi'];
      var expected = 8.04672;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Km to Mi', function(done) {
      var input = [5, 'km'];
      var expected = 3.10686;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Lbs to Kg', function(done) {
      var input = [5, 'lbs'];
      var expected = 2.26796;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Kg to Lbs', function(done) {
      var input = [5, 'kg'];
      var expected = 11.0231;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
  });

});