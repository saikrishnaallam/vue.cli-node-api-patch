const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/User');
const UserValidationSchema = require('../validation/userModelValidation')
const { LoggedInAsUserRequired,LoggedInAsAdminRequired  } =  require('../middleware/security')

const FoodPosts = require('../models/FoodPost');
const ExercisePost = require('../models/ExercisePost');

const multer=require('multer')

//multer config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null,file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
const upload=multer({storage:storage})
  //


router.get('/',(req,res)=>{
    res.send("hit hit hit")
});

router.post('/register',async(req,res)=>{

 console.log(req.body)
 const { error } = UserValidationSchema.validate(req.body)
 if (error) {
     res.status(400).json({
         error: error.details[0].message,
         successful: false
     })
     return
 }
 else {
      const existingUser = User.findOne({
            $or: [{
                email: req.body.email
            },
            {
                username: req.body.username
            }]
        })

        if(await existingUser ) {
            res.status(400).send({error:"username or email already taken"}) 
            return
        }
        const salt = await bcrypt.genSalt(10)

        const user = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })
        if (req.file) user.picture_id = req.file.id

        user.save().then(() => {
            res.send({ successful: true })
        }).catch(err => {
            res.status(400).json({
                successful: false,
                error: err
            })
        })   
 }
});

router.post('/login',async(req,res)=>{
    const {password, ...user} = await User.findOne({
        $or: [{
            username: req.body.username
        },
        {
            email: req.body.email
        }]
    }).lean().exec()
    
    if(await user && await password){

    //checks password with hashed password stored in db
    const validPassword = await bcrypt.compare(req.body.password, password)

    //if not valid returns error
    if (!validPassword) return res.status(400).send({ error: errorMessage })

    //creates a token with user
    const token = jwt.sign({ user: await user }, process.env.JWT_SECRET)
    console.log(user.role)
    //adds the token to the header
    res.header('auth-token', token)

    //sends the token back as well as user data
    return res.send({ user: user, token: token })
    }
    else return res.status(400).send({ error: "wrong password" })

});

router.get('/search/:query?',LoggedInAsUserRequired,async(req,res)=>{
    try {
        var searchQuery = req.params.query
        var users = User.find({})
        if (searchQuery) users.find({
            $or:
                [
                    { username: new RegExp(searchQuery, 'i') },
                    { email: new RegExp(searchQuery, 'i') },
                    { firstName: new RegExp(searchQuery, 'i') },
                    { lastName: new RegExp(searchQuery, 'i') }
                ]

        })
        users.select("username email firstName lastName imageUrl").sort('+firstName +lastName')
        return res.json(await users.lean().exec())
    }
    catch{
        return res.sendStatus(500)
    }
})

router.get('/autocomplete/:query?',LoggedInAsUserRequired,async(req,res)=>{
    try {
        var searchQuery = req.params.query
        var users = User.find({})
        if (searchQuery) users.find({
            $or:
                [
                    { username: new RegExp(searchQuery, 'i') },
                    { email: new RegExp(searchQuery, 'i') },
                    { firstName: new RegExp(searchQuery, 'i') },
                    { lastName: new RegExp(searchQuery, 'i') }
                ]

        }).select("username firstName lastName -_id").sort('+username').limit(3)
        // users.
        return res.json(await users.lean().exec())
    }
    catch{
        return res.sendStatus(500)
    }
})


router.patch('/follow/:userId',LoggedInAsUserRequired,async(req,res)=>{
    User.updateOne(
        {_id:req.user.user._id},
        {$addToSet : {followingUsers:req.params.userId}}
    )
    .then(data=> res.send({ successful:true, data:data }))
    .catch(err=> res.send({ successful:false, error:err }))
})

router.patch('/unfollow/:userId',LoggedInAsUserRequired,async(req,res)=>{
    User.updateOne(
        {_id:req.user.user._id},
        {$pull : {followingUsers:req.params.userId}}
    )
    .then(data=> res.send({ successful:true, data:data }))
    .catch(err=> res.send({ successful:false, error:err }))
})

//fetching people user follows - friends
router.get('/friends',LoggedInAsUserRequired,async(req,res)=>{
    User.findOne({_id:req.user.user._id}).select('followingUsers -_id').then(data=>{
        res.send(data)
    })
    .catch(err=>res.json(err))
})

router.get('/friendsProfiles',LoggedInAsUserRequired,async(req,res)=>{
    User.findOne({_id:req.user.user._id}).populate(
       { 
        path: 'followingUsers',
        select: 'username firstName lastName email imageUrl'
    }
        ).then(data=>{
        res.send(data.followingUsers)
    })
    .catch(err=>res.json(err))
})

router.get('/profile/:id',LoggedInAsUserRequired,async(req,res)=>{
    User.findOne({_id:req.params.id}).select('username firstName lastName').then(data=>res.send(data))
})

router.patch('/changePassword',LoggedInAsUserRequired,async(req,res)=>{
    const salt = await bcrypt.genSalt(10)
    const newPassword = await bcrypt.hash(req.body.password, salt)
    User.updateOne(
        {_id:req.user.user._id},
        {password : newPassword}
    )
    .then(()=> res.status(200).send())
    .catch(()=> res.status(400).send())
})

router.patch('/updateWeight',LoggedInAsUserRequired,async(req,res)=>{
    User.updateOne(
        {_id:req.user.user._id},
        {weight : req.body.weight}
    )
    .then(()=> res.status(200).send())
    .catch(()=> res.status(400).send())
})

//for admin
router.get('/all',LoggedInAsUserRequired,async(req,res)=>{
    User.find().select('username firstName lastName email imageUrl').then(data=>{
        res.send(data)
    })
})
//for admin
router.delete("/:id",LoggedInAsUserRequired,async(req,res)=>{
    FoodPosts.remove({user_id:req.params.id}).then(data=>console.log(data))
    ExercisePost.remove({user_id:req.params.id}).then(data=>console.log(data))
    User.remove({_id:req.params.id}).then(data=>
     
        res.send(data))
})

router.post('/uploadProfilePicture',upload.single('image'),LoggedInAsUserRequired ,async(req,res)=>{
    console.log(req.file)

    User.updateOne(
        {_id:req.user.user._id},
        {imageUrl : req.file.destination+req.file.filename}
    )
    .then(()=> res.status(200).send(req.file.destination+req.file.filename))
    .catch(()=> res.status(400).send())
})
module.exports = router