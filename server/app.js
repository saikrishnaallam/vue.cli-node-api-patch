const express = require('express');
const app = express();
//setup
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const usersModel = require('./models/User');
const {FromJWT} = require('./middleware/security')
require('dotenv/config');
const cors = require('cors')

//controllers
const users = require('./controllers/users')
const exercisePosts = require('./controllers/exercisePost')
const foodPosts = require('./controllers/foodPost')
const allPosts = require('./controllers/allPosts')

mongoose.connect(process.env.DATABASE_URL,
{ useNewUrlParser: true,
useUnifiedTopology: true
},
)
.then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

app.use(cors())
app.use(bodyParser.json())
app.use('/uploads',express.static('uploads'))
app.use(async (req, res, next)=>{ 
    const token = req.headers.authorization?.split(' ').reverse()[0];
    req.user = token && await FromJWT(token);
    next();     
  })
app.use('/users',users)
app.use('/exercise',exercisePosts)
app.use('/food',foodPosts)
app.use('/posts',allPosts)
app.listen(3000);