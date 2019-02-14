const User = require('../Models/user'),
      Masrks= require('../Models/marks'),
      RegQuestion= require('../Models/regQuestion'),
      codingQuestion = require('../Models/codingQuestion'),
      Common = require('../utils/response'),
      {c, cpp, java, python} = require('compile-run'),
      fs= require('fs');

exports.onSaveAnswer = (req, res, next)=>{
  let correct = false;
  let questionType;
  console.log(req.body);
  RegQuestion.findOne({_id: req.body.questionId})
    .then(question=>{
      console.log(question);
      if (question.type === 'FUB' || question.type === 'MC') {
        questionType =question.type;
        if(question.correct === req.body.option) {
          correct = true;
          console.log(question);
          return Masrks.findOne({user: req.body.userId});
        }
      } 
      if(question.type === 'MC') {
        console.log(question);
        return Masrks.findOne({user: req.body.userId});
      }
      return res.json(Common.generateResponse(0,'Answer Saved'));
    })
    .then(marks => {
      console.log(marks);
      if(correct) {
        marks.questionmarks += 2;
        marks.total = marks.questionmarks+ marks.codingmarks;
        return marks.save(); 
      } else if(!correct && questionType=== 'MC') {
        marks.questionmarks -= 1;
        marks.total = marks.questionmarks+ marks.codingmarks;
        return marks.save(); 
      }
      return res.json(Common.generateResponse(0,'Answer Saved'))
    })
    .then(resp => {
      console.log(resp + 'Third Then');
      return res.json(Common.generateResponse(0, resp));
    })
    .catch(err => {
      console.log(err);
      return res.json(Common.generateResponse(100, err));
    })
};
  exports.onCodeCompile = async (req, res, next)=>{
    console.log(req.body);
  const ext = req.body.lang;
  const filename = req.body.userId;
  if (ext === 'C' ){
    await fs.writeFile('./codingFile/'+filename+'.c', req.body.code, (err)=>{
      if (err)
        console.log(err);
    });
    let resultPromiseC = c.runFile('./codingFile/'+filename+'.c');
    resultPromiseC
      .then(result =>{
        console.log(result);
        if (result.stderr === '') {
          res.status(200).json({
            status: 0,
            message: 'Compilation Successful',
            error: null
          })
        } else {
          res.status(200).json({
            status: 1,
            message: 'Error Occurred',
            error: result.stderr.split('error:')
          })
        }
      })
      .catch(err=>{
        res.status(500).json({
          status: 1,
          message: 'Error Occurred',
          error: err
        });
      });
  } else if (ext === 'C++' ){
    await fs.writeFile('./codingFile/'+filename+'.cpp', req.body.code, (err)=>{
      if (err)
        console.log(err);
    });
    let resultPromiseCpp = cpp.runFile('./codingFile/'+filename+'.cpp');
    resultPromiseCpp
      .then(result =>{
        if (result.stderr === '') {
          res.status(200).json({
            status: 0,
            message: 'Compilation Successful'
          })
        } else {
          res.status(200).json({
            status: 1,
            message: 'Error Occurred',
            error: result.stderr
          })
        }
      })
      .catch(err=>{
        res.status(500).json({
          status: 1,
          message: 'Error Occurred',
          error: err
        });
      });
  } else if (ext === 'JAVA' ){
    const dir = './codingFile/'+filename;
    console.log(dir);
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    await fs.writeFile('./codingFile/'+filename+'/Main.java', req.body.code, (err)=>{
    if (err)
        console.log(err);
    });
    let resultPromiseJava = java.runFile('./codingFile/'+filename+'/Main.java');
    resultPromiseJava
      .then(result =>{
        if (result.stderr === '') {
          res.status(200).json({
            status: 0,
            message: 'Compilation Successful'
          })
        } else {
          res.status(200).json({
            status: 1,
            message: 'Error Occurred',
            error: result.stderr
          })
        }
      })
      .catch(err=>{
        res.status(500).json({
          status: 1,
          message: 'Error Occurred',
          error: err
        });
      });
  } else if (ext === 'PYTHON' ){
    fs.writeFile('./codingFile/'+filename+'.py', req.body.code, (err)=>{
      if (err)
        console.log(err);
    });
    let resultPromisePython =python.runFile('./codingFile/'+filename+'.py');
    resultPromisePython
      .then(result => {
        console.log(result);
        if (result.stderr === '') {
          res.status(200).json({
            status: 0,
            message: 'Compilation Successful'
          })
        } else {
          res.status(200).json({
            status: 1,
            message: 'Error Occurred',
            error: result.stderr
          })
        }//result object
      })
      .catch(err => {
        res.status(500).json({
          status: 1,
          message: 'Error Occurred',
          error: err
        })
      });
  }
};
exports.onCodeRun = (req, res, next)=>{
  console.log(req.body);
  const lang = req.body.lang;
  const userId = req.body.userId;
  codingQuestion.findById(req.body.codingQuestionId)
  .then(result =>{
      if (lang === 'C') {
        runCCode(userId, result.input, result.output, res);
      } else if (lang === 'C++') {
        runCppCode(userId, result.input, result.output, res);
      } else if (lang === 'JAVA') {
        runJavaCode(userId, result.input, result.output, res);
      } else if (lang === 'PYTHON') {
        runPythonCode(userId,result.input, result.output, res);
      }
    });

};

//C code Running Logic
runCCode = (userId, input, output , res)=> {
  let marks=0;
  let codingStatus=[];
  let resultPromiseC = c.runFile('./codingFile/'+userId+'.c', {stdin: input[0]});
  resultPromiseC.then(result => {
    const answer0 = result.stdout;
    if (answer0 === output[0]) {
      marks+=5;
      codingStatus.push(0);
    } else {
      codingStatus.push(1);
    }
    c.runFile('./codingFile/'+userId+'.c', {stdin: input[1]})
      .then(result=>{
        const answer1 = result.stdout;
        if (answer1 === output[1]) {
          marks+=5;
          codingStatus.push(0);
        } else {
          codingStatus.push(1);
        }
        calculateMarks(userId,marks);
        res.status(200).json({
          message: 'Code Run Successfully',
          status: codingStatus
        });
      });
  });
};
//C++ Code Running Logic
runCppCode = (userId, input, output, res)=> {
  let marks=0;
  let codingStatus=[];
  let resultPromiseCpp = cpp.runFile('./codingFile/'+userId+'.cpp', {stdin: input[0]});
  resultPromiseCpp.then(result => {
    const answer0 = result.stdout;
    console.log(answer0===output[0]);
    console.log(answer0);
    console.log(output[0]);
    if (answer0 === output[0]) {
      marks+=5;
      codingStatus.push(0);
    } else {
      codingStatus.push(1);
    }
    cpp.runFile('./codingFile/'+userId+'.cpp', {stdin: input[1]})
      .then(result=>{
        const answer1 = result.stdout;
        if (answer1 === output[1]) {
          marks+=5;
          codingStatus.push(0);
        } else {
          codingStatus.push(1);
        }
        calculateMarks(userId,marks);
        res.status(200).json({
          message: 'Code Run Successfully',
          status: codingStatus
        });
      });
  });
};
//Java Code Running Logic
runJavaCode = (userId, input, output, res)=> {
  let marks=0;
  let codingStatus=[];
  let resultPromiseJava = java.runFile('./codingFile/'+userId+'/Main.java', {stdin: input[0]});
  resultPromiseJava.then(result => {
    console.log(result);
    const answer0 = result.stdout.substr(0,result.stdout.length-2);
    if (answer0 === output[0]) {
      marks+=5;
      codingStatus.push(0);
    } else {
      codingStatus.push(1);
    }
    java.runFile('./codingFile/'+userId+'/Main.java', {stdin: input[1]})
      .then(result=>{
        const answer1 = result.stdout.substr(0,result.stdout.length-2);
        if (answer1 === output[1]) {
          marks+=5;
          codingStatus.push(0);
        } else {
          codingStatus.push(1);
        }
        calculateMarks(userId,marks);
        res.status(200).json({
          message: 'Code Run Successfully',
          status: codingStatus
        });
      });
  });
};
//Python Code Running Logic
runPythonCode = (userId, input, output, res)=> {
  let marks=0;
  let codingStatus=[];
  python.runFile('./codingFile/'+userId+'.py', {stdin: input[0]})
    .then(result=>{
      const answer0 = result.stdout.substr(0,result.stdout.length-1);
      console.log(answer0===output[0]);
      console.log(answer0);
      console.log(output[0]);
      if (answer0 === output[0]) {
        marks+=5;
        codingStatus.push(0);
      } else {
        codingStatus.push(1);
      }
      python.runFile('./codingFile/'+userId+'.py', {stdin: input[1]})
        .then(result=>{
          const answer1 = result.stdout.substr(0,result.stdout.length-1);
          if (answer1 === output[1]) {
            marks+=5;
            codingStatus.push(0);
          } else {
            codingStatus.push(1);
          }
          calculateMarks(userId,marks,'./codingFile/'+userId+'.py');
          res.status(200).json({
                message: 'Code Run Successfully',
                status: codingStatus
              });
        });
    });
};
exports.onSubmitReg = (req,res)=>{
  console.log(req.userId);
  Masrks.findOne({user: req.userId})
    .then(marks=>{
      marks.submit_reg = true;
      marks.save();
      res.status(200).json({
        code: 0,
        message: 'This Section Submited Successfully'
      });
    })
    .catch(err=>{
      res.status(500).json({
        code: 100,
        message: 'Error Occurred'
      });
    })
};
exports.onSubmitCoding = (req,res)=>{
  Masrks.findOne({user: req.userId})
    .then(marks=>{
      marks.submit_coding = true;
      marks.save();
      res.status(200).json({
        code: 0,
        message: 'This Section Submited Successfully'
      });
    })
    .catch(err=>{
      res.status(500).json({
        code: 100,
        message: 'Error Occurred'
      });
    })
};
calculateMarks = (userId, mark, filename)=>{
  Masrks.findOne({user: userId})
  .then(marks => {
    if (marks.submit_coding){
      return;
    }
    console.log(marks);
    marks.codingmarks = mark;
    marks.total= marks.questionmarks + marks.codingmarks;
    marks.codingfile = filename;
    marks.save();
  })
  .catch(err=>{
    res.status(500).json({
      message: 'Can\'t Run The Code'
    });
  })
};
