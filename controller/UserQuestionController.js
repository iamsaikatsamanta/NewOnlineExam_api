const RegQuestion = require('../Models/regQuestion'),
    CodingQuestion = require('../Models/codingQuestion'),
    Common = require('../utils/response');

exports.getRegularQuestion = (req,res,next) => {
    RegQuestion.find().then(question=>{
        res.json(Common.generateResponse(0, question.map(ele => {
            return {
                id: ele._id,
                question: ele.question,
                option: ele.option
            };
        })));
    }).catch(err=>{
            res.json(Common.generateResponse(100, err))
        });
};
exports.getCodingQuestions = (req,res,next) => {
    CodingQuestion.find()
        .then(codingQuestion => {
            delete codingQuestion.input;
            delete codingQuestion.output;
            res.json(Common.generateResponse(0, codingQuestion));
        })
        .catch(err => {
           res.json(Common.generateResponse(100, err))
        })
};
