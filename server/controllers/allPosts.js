const express = require('express')
const router = express.Router()
const { LoggedInAsUserRequired,LoggedInAsAdminRequired  } =  require('../middleware/security')
const FoodPosts = require('../models/FoodPost');
const ExercisePost = require('../models/ExercisePost');
const User = require('../models/User');



router.get('/my-posts',LoggedInAsUserRequired,async (req,res)=>{
    const exercisePosts=await ExercisePost.find({user_id:req.user.user._id}).populate('user_id')
    const foodPosts=await FoodPosts.find({user_id:req.user.user._id}).populate('user_id')
    const combinedPosts= exercisePosts.concat( foodPosts)
    combinedPosts.sort((a,b)=>b.timePosted.getTime()-a.timePosted.getTime());
    res.json(combinedPosts)
});


router.get('/public-posts',async (req,res)=>{
    const exercisePosts=await ExercisePost.find({public:true}).populate('user_id')
    const foodPosts=await FoodPosts.find({public:true}).populate('user_id')
    const combinedPosts= exercisePosts.concat( foodPosts)
    combinedPosts.sort((a,b)=>b.timePosted.getTime()-a.timePosted.getTime());
    res.json(combinedPosts)
});


router.get('/friend-posts',LoggedInAsUserRequired,async(req,res)=>{
   try{
    var ids=[]
    const user=await User.findOne({_id:req.user.user._id}).select('followingUsers -_id')
    console.log(user.followingUsers)
    const exercisePosts=await ExercisePost.find({user_id:{$in:user.followingUsers}}).populate('user_id')
    const foodPosts=await FoodPosts.find({user_id:{$in:user.followingUsers}}).populate('user_id')
    const combinedPosts= exercisePosts.concat( foodPosts)
    combinedPosts.sort((a,b)=>b.timePosted.getTime()-a.timePosted.getTime());
    res.json(combinedPosts)
   }
   catch{return res.sendStatus(500)}

})


router.get('/countCalories',LoggedInAsUserRequired,async(req,res)=>{

    const exercisePosts=await ExercisePost.find(
        {
         user_id:req.user.user._id,
         timePosted:{  
             $gte: new Date(new Date().setHours(00, 00, 00)),
             $lt: new Date(new Date().setHours(23, 59, 59))
            }
        }).select('numberOfCaloriesBurned -_id')
        var calBurned=0;
        exercisePosts.forEach(element => calBurned= calBurned+element.numberOfCaloriesBurned);


        const foodPosts=await FoodPosts.find(
            {
             user_id:req.user.user._id,
             timePosted:{  
                 $gte: new Date(new Date().setHours(00, 00, 00)),
                 $lt: new Date(new Date().setHours(23, 59, 59))
                }
            }).select('calories -_id')

            var calIngested=0;
            foodPosts.forEach(element => calIngested= calIngested+element.calories);
            res.send({ burned:calBurned,ingested:calIngested })

})



router.get('/statistics',LoggedInAsAdminRequired,async(req,res)=>{
    const numberOfExercisePosts=await ExercisePost.countDocuments()
    const numberOfFoodPosts= await FoodPosts.countDocuments()
    const numberOfUsers= await User.countDocuments()
    const numberOfCaloriesIngested= await FoodPosts.aggregate([{
          $group : { _id : null, total : { $sum : "$calories"  } }}
        ])
    const numberOfBurnedCalories= await ExercisePost.aggregate([{
          $group : { _id : null, total : { $sum : "$numberOfCaloriesBurned"  } }}
          ])

    res.send({foodPosts:numberOfFoodPosts,exercisePosts:numberOfExercisePosts,users:numberOfUsers,ingedstedCalories:numberOfCaloriesIngested[0].total,burnedCalories:numberOfBurnedCalories[0].total})
})


router.get('/friend-posts/:friendId',LoggedInAsUserRequired,async(req,res)=>{
    try{
     const user=await User.findOne({followingUsers:req.params.friendId})
     console.log(user)
        if(user){
            const exercisePosts=await ExercisePost.find({user_id:req.params.friendId}).populate('user_id')
            const foodPosts=await FoodPosts.find({user_id:req.params.friendId}).populate('user_id')
            const combinedPosts= exercisePosts.concat( foodPosts)
            combinedPosts.sort((a,b)=>b.timePosted.getTime()-a.timePosted.getTime());
            res.json(combinedPosts)
        }else{
            const exercisePosts=await ExercisePost.find({user_id:req.params.friendId,public:true}).populate('user_id')
            const foodPosts=await FoodPosts.find({user_id:req.params.friendId,public:true}).populate('user_id')
            const combinedPosts= exercisePosts.concat( foodPosts)
            combinedPosts.sort((a,b)=>b.timePosted.getTime()-a.timePosted.getTime());
            res.json(combinedPosts)
        }
     
    }
    catch{return res.sendStatus(500)}
 
 })
module.exports = router