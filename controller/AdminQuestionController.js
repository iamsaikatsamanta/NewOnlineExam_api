const RegQuestion = require('../Models/regQuestion'),
      CodeingQuestion = require('../Models/codingQuestion'),
      Common = require('../utils/response');

exports.saveQuestion = (req,res,next)=>{
    console.log(req.body);
    let question;
    if(req.body.type === 'MC') {
        question = new RegQuestion({
            question: req.body.question,
            option: req.body.option,
            correct: req.body.correct,
            type: req.body.type
        });
    } else if(req.body.type === 'FUB') {
        question = new RegQuestion({
            question: req.body.question,
            correct: req.body.correct,
            type: req.body.type
        });
    }
    question.save()
        .then(savedQuestion => {
            return res.json(Common.generateResponse(0, savedQuestion));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        });
};

exports.saveCodeingQuestions = (req,res,next) => {
    const codingQuestion = new CodeingQuestion({
        question: req.body.question,
        input: req.body.input,
        output: req.body.output
    });
    codingQuestion.save().then(savedCodingQuestion=>{
        return res.json(Common.generateResponse(0, savedCodingQuestion));
    })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        });
};

exports.getQuestions = (req,res,next)=>{
    RegQuestion.find().then(question=>{
        return res.json(Common.generateResponse(0, question));
    })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        });
};

exports.getCodingQuestions = (req,res,next)=>{
    CodeingQuestion.find().then(CodeingQuestions=>{
        return res.json(Common.generateResponse(0, CodeingQuestions));
    }).catch(err=>{
        return res.json(Common.generateResponse(100, err));
    });
};

exports.updateQuestion = (req,res,next) =>{
    const question = {
        question: req.body.question,
        option: req.body.option,
        correct:  req.body.correct
    };
    RegQuestion.findOneAndUpdate({_id: req.params.id}, question)
        .then(question => {
            if (question){
                return res.json(Common.generateResponse(0, question));
            }else {
                return res.json(Common.generateResponse(3));
            }
        })
        .catch(err => {
            return res.json(Common.generateResponse(100, err));
        });
};

exports.updateCodingQuestion = (req,res,next) =>{
    const codingQuestion ={
        question: req.body.question,
        input: req.body.input,
        output: req.body.output
    };
    CodeingQuestion.findOneAndUpdate({_id: req.params.id}, codingQuestion)
        .then(question => {
            if (question){
                return res.json(Common.generateResponse(0, question));
            }else {
                return res.json(Common.generateResponse(3));
            }
        })
        .catch(err => {
            return res.json(Common.generateResponse(100, err));
        });
};

exports.deleteQuestion = () => {
    RegQuestion.findByIdAndRemove(req.params._id)
        .then(resp=> {
            return res.json(Common.generateResponse(0, resp))
        })
        .catch(err => {
            return res.json(Common.generateResponse(100, err));
        })
};

exports.deleteCodingQuestion = () => {
    CodeingQuestion.findByIdAndRemove(req.params._id)
        .then(resp=> {
            return res.json(Common.generateResponse(0, resp))
        })
        .catch(err => {
            return res.json(Common.generateResponse(100, err));
        })
};
