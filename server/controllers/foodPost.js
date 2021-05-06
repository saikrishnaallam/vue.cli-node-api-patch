const express = require('express')
const router = express.Router()
const { LoggedInAsUserRequired,LoggedInAsAdminRequired  } =  require('../middleware/security')
const FoodPostPostValidationSchema = require('../validation/foodModelValidation')
const FoodPost = require('../models/FoodPost');



router.post('/add',LoggedInAsUserRequired,async(req,res)=>{
        console.log(req.user.user._id)
        const { error } = FoodPostPostValidationSchema.validate(req.body)
        console.log(req.body)
        if (error) {
            res.status(400).json({
                error: error.details[0].message,
                successful: false
            })
            return
        }
        else {
            
        const food = new FoodPost({
            user_id: req.user.user._id,
            description:req.body.description,
            public:req.body.public,
            foodType:req.body.foodType,
            grams:req.body.grams,
            calories:req.body.calories
         
      
        })

        food.save().then(data => {
            res.send({ successful: true ,post:data})
        }).catch(err => {
            res.status(400).json({
                successful: false,
                error: err
            })
        })

        }

})

router.patch('/like/:exerciseId',LoggedInAsUserRequired,async(req,res)=>{
    FoodPost.updateOne(
        { _id: req.params.exerciseId},
        {$addToSet : {usersThatLikedPost:req.user.user._id}}
        )
        .then(data=>{
            if(data.nModified==0){
                FoodPost.updateOne(
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


router.delete('/:id',LoggedInAsUserRequired,async(req,res)=>{
    var ObjectId = require('mongodb').ObjectID;

    FoodPost.remove({
        _id:req.params.id,
        user_id:ObjectId(req.user.user._id)})
        .then((data)=>{
            res.send({ successful: true,data:data})
        }).catch(err=>{
            res.send({successful:false,error:err})
        })
})

module.exports = router