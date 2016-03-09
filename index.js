// paq-addition-example/index.js

// Example question-generation module for Project Awesome
// Demonstrates basic functionality required to generate new types of questions

// Schema for validating the parameters passed to generate
// Format as specified at http://json-schema.org/
// See tutorial at http://spacetelescope.github.io/understanding-json-schema/
// For example, {"max": 10} would be valid by the schema below. 
exports.schema = {
    title: 'addition-example', // identifier for this module (questionType)
    type: 'object', // top level must be an object, not array or anything else
    required: ['max'], // it must have a property called "max"
    additionalProperties: false, // and may not have any properties not described below
    
    properties: {
        'max': { // the property max must...
            type: 'integer', // be an integer
            minimum: 1, // not less than one
            maximum: 1000, // and not greater than 1000
        },
        'mc': { // if present, the property mc must...
            type: 'boolean', // be a boolean (true or  false)
        },
    },
}

// The generate function is the core of a question-generation module.
// Its first argument is the parameters object, already validated by the schema.
// Its second argument is a pseudo-random number generator (pa-randomizer):
//  To allow easy testing, the random number generator takes an initial argument with each call
//  describing the decision to be made. This can be any string, and is used to help seed the RNG.
//  If you change these names, you'll also have to change the tests for your generator.
//  If you use the same name twice with the same method, the calls will produce the same results.
exports.generate = function (params, rand) {
    var question = {}; // question is an object, with certain required properties we assign below
    
    // but first, we need to pick the left and right addends for this question
    // since they are independent, we use separate names for each one
    // each value can be anything between zero and params.max, including zero but not params.max
    var left = rand.integer('left addend', params.max);
    var right = rand.integer('right addend', params.max);
    
    // Short, human readable title describing the type of question generated
    question.title = 'Integer Addition';
    
    // Text of the question, to be read by the student
    question.question = 'What is ' + left + ' + ' + right + '?';
    
    // We calculate the correct answer from the addends we already generated
    // Possible answers always must be strings
    var answer = (left + right).toString();
    
    // Since params.mc is optional, we check that it exists before checking the value
    if ('mc' in params && params.mc) {
        // 'mc' is true, so we are making a multiple-choice question
        question.format = 'multiple-choice';
        // question.choices should be a list of possible answers, in the order they will appear to the student
        // Here, we're lazy and use 'wrong' and 'not this' as incorrect answers
        // A better implementation would generate plausible but false answers
        // We then shuffle the list, ensuring the correct answer is not always first
        question.choices = rand.shuffle('ordering', [answer, 'wrong', 'not this']);
        // For a multiple choice question, question.answer must be the index of the correct answer in the list of choices
        question.answer = question.choices.indexOf(answer);
    } else {
        // 'mc' is false or not present, so we are making a free-response question
        question.format = 'free-response';
        // A free response question has no choices, so we don't create that field
        // question.answer is simply the text of the correct answer
        question.answer = answer;
    }
    
    return question;
}