const State = require('../Models/states'),
        City = require('../Models/city'),
        Country = require('../Models/country')
        Common = require('../utils/response');

exports.saveState = (req,res) => {
    const newState = new Country({
        country: req.body.state
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
            return res.json(Common.generateResponse(0, resp))
        }
        return res.json(Common.generateResponse(3));
    })
    .catch(err => {
        return res.json(Common.generateResponse(100, err));
    })
};

exports.fileUpload = (req,res) => {
    res.status(200).json(Common.generateResponse(0, req.file.location));
};
