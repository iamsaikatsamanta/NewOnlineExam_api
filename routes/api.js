const express = require('express'),
        router = express.Router(),
        multer = require('multer');
const adminauthcontroller = require('../controller/adminauthcontroller'),
      Userauthcontroller = require('../controller/UserAuthController'),
      userAuth = require('../middleware/check-user-auth'),
      adminAuth = require('../middleware/check-auth'),
      AdminQuestionController = require('../controller/AdminQuestionController'),
      AdminOtherController = require('../controller/AdminOtherController'),
      UserQuestionController = require('../controller/UserQuestionController'),
      passportjs = require('../controller/passport'),
      passport = require('passport');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req,file,cb)=> {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid Mime Type");
        if (isValid) {
            error = null;
        }
        cb(error,'images/user');
    },
    filename: (require, file,cb) =>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+ext);
    }
});
//Admin Auth
router.post("/admin/login",adminauthcontroller.adminLogin);
router.post('/resetpasswordinit',adminauthcontroller.resetPassword);
router.post('/setnewpassword',adminauthcontroller.setNewPassword);
//User Auth
router.post('/user/register', multer({storage: storage}).single('image'),Userauthcontroller.userRegister);
router.post('/user/login"', Userauthcontroller.userLogin);
router.post('/user/fblogin', passport.authenticate('facebookLogin', {session: false}), Userauthcontroller.facebookLogin);
router.post('/user/fbrgistration', passport.authenticate('facebookRegistration', {session: false}), Userauthcontroller.facebookRegistration);
router.post('/user/googlelogin',passport.authenticate('googleLogin', {session: false}), Userauthcontroller.googleLogin);
router.post('/user/googlergistration',passport.authenticate('googleRegistration', {session: false}), Userauthcontroller.googleRegistration);
//Admin Question
router.post('/admin/savequestion', adminAuth, AdminQuestionController.saveQuestion);
router.post('/admin/savecodingquestion', adminAuth, AdminQuestionController.saveCodeingQuestions);
router.get('/admin/getquestions', adminAuth, AdminQuestionController.getQuestions);
router.get('/admin/getcodingquestions', adminAuth, AdminQuestionController.getCodingQuestions);
router.post('/admin/updatequestion/:id', adminAuth, AdminQuestionController.updateQuestion);
router.post('/admin/updatecodequestion/:id', adminAuth, AdminQuestionController.updateCodingQuestion);
router.delete('/admin/delete-question/:id', adminAuth, AdminQuestionController.deleteQuestion);
router.delete('/admin/delete-coding-question/:id', adminAuth, AdminQuestionController.deleteCodingQuestion);


//Admin Other
router.get('/admin/registeredCandidate', adminAuth, AdminOtherController.getRegisteredCandidate);

//User Question
router.get('/user/get-question/regular', UserQuestionController.getRegularQuestion);
router.get('/user/get-question/coding', UserQuestionController.getCodingQuestions);

module.exports = router;
