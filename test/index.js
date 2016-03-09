var expect = require('chai').expect,
	paq = require('../'),
	sinon = require('sinon'),
	Randomizer = require('pa-randomizer');
var ajv = require('ajv')({
    v5: true,
    allErrors: true,
    verbose: true,
    format: 'full',
});

describe('addition example paq', function () {
    describe('schema', function () {
        it('should validate correct parameters', function () {
            expect(ajv.validate(paq.schema, {max: 10, mc: true})).to.be.true;
        });
        it('should validate correct parameters without mc', function () {
            expect(ajv.validate(paq.schema, {max: 10})).to.be.true;
        });
        it('should invalidate parameters missing max', function () {
            expect(ajv.validate(paq.schema, {mc: false})).to.be.false;
        });
        it('should invalidate parameters with non-integer max', function () {
            expect(ajv.validate(paq.schema, {max: 'abc', mc: false})).to.be.false;
        });
        it('should invalidate parameters with non-boolean mc', function () {
            expect(ajv.validate(paq.schema, {max: 10, mc: 'abc'})).to.be.false;
        });
    });
    describe('generate', function () {
        var rand;
        var stub;
        beforeEach(function () {
            rand = new Randomizer('seed');
            stub = sinon.stub(rand, 'integer');
            stub.withArgs('left addend').returns(3);
            stub.withArgs('right addend').returns(9);
        });
        it('should create a free-response question', function () {
            expect(paq.generate({max: 10}, rand)).to.eql({
                title: 'Integer Addition',
                question: 'What is 3 + 9?',
                format: 'free-response',
                answer: '12',
            });
            expect(stub.calledWithExactly('left addend', 10)).to.be.true;
            expect(stub.calledWithExactly('right addend', 10)).to.be.true;
        });
    });
});