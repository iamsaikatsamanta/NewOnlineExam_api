const RegQuestion = require('../Models/regQuestion'),
    CodingQuestion = require('../Models/codingQuestion'),
    Common = require('../utils/response');

exports.getRegularQuestion = (req,res,next) => {
    RegQuestion.find().then(question=>{
        res.json(Common.generateResponse(0, question.map(ele => {
            return {
                id: ele._id,
                question: ele.question,
                option: ele.option,
                type: ele.type
            };
        })));
    }).catch(err=>{
            res.json(Common.generateResponse(100, err))
        });
};
exports.getCodingQuestions = (req,res,next) => {
    CodingQuestion.find()
        .then(codingQuestion => {
            res.json(Common.generateResponse(0,codingQuestion.map(question =>{
                return {
                    id: question._id,
                    question: question.question
                };
            })));
        })
        .catch(err => {
           res.json(Common.generateResponse(100, err))
        })
};
