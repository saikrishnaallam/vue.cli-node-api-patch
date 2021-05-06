const express = require('express')
const router = express.Router()
const { LoggedInAsUserRequired,LoggedInAsAdminRequired  } =  require('../middleware/security')
const ExercisePostValidationSchema = require('../validation/exerciseModelValidation')
const ExercisePost = require('../models/ExercisePost');
const User = require('../models/User');



router.post('/add',LoggedInAsUserRequired,async(req,res)=>{
        console.log(req.user.user._id)
        const { error } = ExercisePostValidationSchema.validate(req.body)
        console.log(req.body)
        if (error) {
            res.status(400).json({
                error: error.details[0].message,
                successful: false
            })
            return
        }
        else {
            
        const exercise = new ExercisePost({
            user_id: req.user.user._id,
            type: req.body.type,
            description:req.body.description,
            public:req.body.public,
            numberOfCaloriesBurned:req.body.numberOfCaloriesBurned,
            length:req.body.length,
            timeUnit:req.body.timeUnit
      
        })

        exercise.save().then(data => {
         
            res.send({ successful: true ,post:data})
        }).catch(err => {
            res.status(400).json({
                successful: false,
                error: err
            })
        })

        }

})

router.delete('/:id',LoggedInAsUserRequired,async(req,res)=>{
    var ObjectId = require('mongodb').ObjectID;

    ExercisePost.remove({
        _id:req.params.id,
        user_id:ObjectId(req.user.user._id)})
        .then((data)=>{
            res.send({ successful: true,data:data})
        }).catch(err=>{
            res.send({successful:false,error:err})
        })
})

//this will function as like and dislike at the same time , after trying to add users id to list of users that liked post
//  we check to see if post was modified if not then it means it was already liked then we remove user from that array
router.patch('/like/:exerciseId',LoggedInAsUserRequired,async(req,res)=>{
    ExercisePost.updateOne(
        { _id: req.params.exerciseId},
        {$addToSet : {usersThatLikedPost:req.user.user._id}}
        )
        .then(data=>{
            if(data.nModified==0){
                    ExercisePost.updateOne(
                { _id: req.params.exerciseId},
                {$pull : {usersThatLikedPost:req.user.user._id}}
                ).then(data=>res.send({successful:true ,data:data}))
                .catch(err=>res.send({successful:false,error:err}))
            }else{
                res.send({successful:true ,data:data})

            }
            
            
        })
        .catch((err)=>{
            res.send({successful:false ,error:err})
        })
})


module.exports = router