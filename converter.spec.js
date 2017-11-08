const { mwParser, mwConverter, conversions } = require('./converter');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);
const { expect } = chai;


describe('parser testing', () => {
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

    it('should fill send message if erroneus unit', () => {
        req.query = {};
        const inputs = [
            'asdasd',
            '123qweasd123',
            '1kg3'
        ]
        inputs.forEach( (input) => {
            req.query.input = input;
            req.conversion = undefined;
            res.send = chai.spy( (message) => console.log(message));
            mwParser(req, res, next)
            expect(next).to.not.have.been.called();
            expect(res.send).to.have.been.called();
            expect(res.send).to.have.been.called.with('invalid unit');
            expect(req.conversion).to.not.exist;
        })
        
    });
})