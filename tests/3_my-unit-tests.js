const { mwParser, mwConverter, conversions } = require('../middleware/converter');
const chai = require('chai');
const spies = require('chai-spies-next');

chai.use(spies);
const { expect } = chai;


describe('parser testing', () => {
    let res = {};
    let req = {};
    let next;

    beforeEach( () => {
        next = chai.spy( () => {} );
        res.send = chai.spy( () =>  {});
    });

    afterEach( () => {
        res = {};
        req = {};
    })

    it('should parse correctly', () => {
        req.query = {};
        const inputs = [
            '2kg',
            '34.2gal',
            '3/32.32km',
            '0.32/42.32mi'
        ]
        inputs.forEach( (input) => {
            req.query.input = input;
            req.conversion = undefined;
            res.send = chai.spy( () => {});
            mwParser(req, res, next)
            expect(next).to.have.been.called();
            expect(res.send).to.not.have.been.called();
            expect(req.conversion).to.exist;
            expect(req.conversion.initNum).to.be.a('number');
            expect(req.conversion.initUnit).to.be.a('string');
        })  
    });

    it('should fill with 1 if no number present', () => {
        req.query = {};
        const units = conversions.reduce( (acc, e) => acc = [...acc, ...e.units], []);
        units.forEach( (unit) => {
            req.query.input = unit;
            req.conversion = undefined;
            mwParser(req, res, next)
            expect(next).to.have.been.called();
            expect(res.send).to.not.have.been.called();
            expect(req.conversion).to.exist;
            expect(req.conversion.initNum).to.equal(1);
            expect(req.conversion.initUnit).to.equal(unit);
        });
    });

    it('should send invalid unit', () => {
        req.query = {};
        const inputs = [
            'asdasd',
            '123qweasd123',
            '1kg3'
        ]
        inputs.forEach( (input) => {
            req.query.input = input;
            req.conversion = undefined;
            res.send = chai.spy( (message) => {});
            mwParser(req, res, next)
            expect(next).to.not.have.been.called();
            expect(res.send).to.have.been.called();
            expect(res.send).to.have.been.called.with('invalid unit');
            expect(req.conversion).to.not.exist;
        })    
    });

    it('should send invalid number', () => {
        req.query = {};
        const inputs = [
            'asdaskg',
            '1@2gal',
            '3kdkg'
        ]
        inputs.forEach( (input) => {
            req.query.input = input;
            req.conversion = undefined;
            res.send = chai.spy( (message) => {});
            mwParser(req, res, next)
            expect(next).to.not.have.been.called();
            expect(res.send).to.have.been.called.with('invalid number');
            expect(req.conversion).to.not.exist;
        })    
    });

    it('should send invalid number and unit', () => {
        req.query = {};
        const inputs = [
            'asdaskg@',
            '1@2gal3',
            '1g3kgkga'
        ]
        inputs.forEach( (input) => {
            req.query.input = input;
            req.conversion = undefined;
            res.send = chai.spy( (message) => {});
            mwParser(req, res, next)
            expect(next).to.not.have.been.called();
            expect(res.send).to.have.been.called.with('invalid number and unit');
            expect(req.conversion).to.not.exist;
        })    
    });
})



describe('converter testing', () => {
    let res = {};
    let req = {};
    let next;

    beforeEach( () => {
        next = chai.spy( () => {} );
        res.send = chai.spy( (message) => console.log(message));
    });

    afterEach( () => {
        res = {};
        req = {};
    })

    it('should convert correctly', () => {
        const inputs = [
            { initNum: 1, initUnit: 'kg' },
            { initNum: 1, initUnit: 'km' },
            { initNum: 1, initUnit: 'L' },
            { initNum: 1, initUnit: 'lbs' },
            { initNum: 1, initUnit: 'mi' },
            { initNum: 1, initUnit: 'gal' },
        ];
        //doesnt check string, check return vals
        const outputs = [
            { returnNum: 2.20462, returnUnit: 'lbs' },
            { returnNum: 0.62137, returnUnit: 'mi' },
            { returnNum: 0.26417, returnUnit: 'gal' },
            { returnNum: 0.45359, returnUnit: 'kg' },
            { returnNum: 1.60934, returnUnit: 'km' },
            { returnNum: 3.78541, returnUnit: 'L' },
        ]
        inputs.forEach( (input, index) => {
            req.conversion = input;
            mwConverter(req, res, next);
            expect(next).to.be.called;
            expect(req.conversion.returnNum).to.equal(outputs[index].returnNum);
            expect(req.conversion.returnUnit).to.equal(outputs[index].returnUnit);
            expect(req.conversion.string).to.exist;
        })
    });
})