const State = require('../Models/states'),
        City = require('../Models/city'),
        Country = require('../Models/country'),
        College = require('../Models/college'),
        Common = require('../utils/response'),
        User = require('../Models/user'),
        UserInfo = require('../Models/UserInfo');

exports.saveState = (req,res) => {
    const newState = new College({
        college_name: req.body.state.toUpperCase()
    });
    newState.save()
    .then(resp => {
        res.json(Common.generateResponse(0,resp));
    })
};

exports.getCountry = (req,res) => {
    Country.find().sort({state: 1})
    .then(resp => {
        if(resp) {
            return res.json(Common.generateResponse(0, resp))
        }
        return res.json(Common.generateResponse(3));
    })
    .catch(err => {
        return res.json(Common.generateResponse(100, err));
    })
};
exports.getState = (req,res) => {
    State.find({countryId: req.params.countryId}).sort({state: 1})
    .then(resp => {
        if(resp) {
            return res.json(Common.generateResponse(0, resp))
        }
        return res.json(Common.generateResponse(3));
    })
    .catch(err => {
        return res.json(Common.generateResponse(100, err));
    })
};

exports.getCity = (req,res) => {
    City.find({stateId: req.params.stateId}).sort({city: 1})
    .then(resp => {
        if(resp) {
            return res.json(Common.generateResponse(0, resp));
        }
        return res.json(Common.generateResponse(3));
    })
    .catch(err => {
        return res.json(Common.generateResponse(100, err));
    })
};

exports.getCollege = (req, res) => {
    College.find().sort({college_name: 1})
    .then(resp => {
        if(resp.length) {
            return res.json(Common.generateResponse(0, resp));
        }
        return res.json(Common.generateResponse(3));
    })
    .catch(err=> {
        return res.json(Common.generateResponse(100, err));
    })
};

exports.fileUpload = (req,res) => {
    res.status(200).json(Common.generateResponse(0, req.file.location));
};

exports.applyForExam = (req, res) => {
  User.findOneAndUpdate({_id: req.user.userid},{appliedforexam: true})
  .then(resp => {
    if(resp) {
        return res.json(Common.generateResponse(0, resp));
    } 
    return res.json(Common.generateResponse(3));
  })
  .catch(err => {
      return res.json(Common.generateResponse(100, err));
  })
};

exports.getUserDetails = (req,res) => {
    UserInfo.findOne({userid: req.user.userid})
    .populate('country')
    .populate('state')
    .populate('city')
    .populate('college')
    .then(resp => {
        if(resp) {
            return res.json(Common.generateResponse(0, resp));
        } 
        return res.json(Common.generateResponse(3));
    })
    .catch(err => {
        return res.json(Common.generateResponse(100, err));
    })
};
