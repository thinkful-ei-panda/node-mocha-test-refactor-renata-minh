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
    
app.get('/movie' , (req, res) => {
  /*grabs query */
  const { avg_vote , genre , country  } = req.query;
  /* filters out B.S. */
  //   if(!avg_vote && !genre  && !country){
  //     return res.status(418).send(' idk what you looking for but we don\'t have it 😃');
  //   }

  for( let p in req.query){
    if(p !== 'avg_vote' && p !== 'genre' && p !== 'country' ){
      return res.status(418).send(' idk what you looking for but we don\'t have it 😃');
    }
  }

  let results = movies;


  if(avg_vote){
    results = results.filter(mov => 
      mov.avg_vote >=  Number(avg_vote)
    );
    results.sort((a,b) => {return a[avg_vote] > b[avg_vote] ? 1 : a[avg_vote] < b[avg_vote] ?  -1 : 0 ; });
  }

  if (genre){
    results = results.filter(mov=> mov.genre.toLowerCase().includes(genre.toLowerCase())); 
  }
  
  if(country){
    results = results.filter(mov=> mov.country.toLowerCase().includes(country.toLowerCase())); 

  }
  
  if(results.length === 0){
    res.status(418).send('sorry we can\'t find anything :c');
  }else{
    res.json(results).status(200).send();  
  }

  

});


app.listen(8000, ()=> console.log('server is running on port 8000') );
