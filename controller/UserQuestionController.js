const RegQuesstion = require('../Models/regQuestion'),
CodeingQuestion = require('../Models/codingQuestion');


exports.getQuestions = (req,res,next) => {
    RegQuestion.find().then(question=>{
        if (question) {
            question.forEach(element => {
                delete element.correct;
            });
            return res.json(Common.generateResponse(0, question));
        }
        return res.json(Common.generateResponse(3));
    })
    .catch(err=>{
        return res.json(Common.generateResponse(100, err));
    });
};
exports.getCodingQuestions = (req,res,next) =>{
    CodeingQuestion.find().then(codeingQuestions=>{
        if (codeingQuestions) {
            question.forEach(element => {
                delete element.input;
                delete element.output;
            });
            return res.json(Common.generateResponse(0, codeingQuestions));
        }
        return res.json(Common.generateResponse(3));
    }).catch(err=>{
        return res.json(Common.generateResponse(100, err));
    });
};