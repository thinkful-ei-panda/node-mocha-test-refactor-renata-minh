require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const movies = require('./movie-data.js');



app.use(morgan('common'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
    
  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({error : 'opps you put in the wrong disk 🤔 '});
  }

  next();
});
    
const validTypes = ['genre','country','ave_vote'];






app.get('/movie' , (req, res) => {

  const { ave_vote , genre , country  } = req.query;

  if(!ave_vote && !genre  && !country){
    return res.send(' idk what you looking for but we don\'t have it 😃');
  }
  if(ave_vote){
    let results = movies.filter(mov => 
      mov.avg_vote <=  Number(ave_vote)
    );
    results.sort((a,b) => {return a[ave_vote] > b[ave_vote] ? 1 : a[ave_vote] < b[ave_vote] ?  -1 : 0 ; });
  }
});


app.listen(8000, ()=> console.log('server is running on port 8000'));
