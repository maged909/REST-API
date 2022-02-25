require('dotenv').config();

const express = require('express');
const app = express(); 

const mongoose = require('mongoose');
const DBURI = process.env.DATABASE_URL;
mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>{console.log('connected to db')})
.catch((err)=>{console.log(err)});


app.listen(3000,()=>{
    console.log('Server Started');
});

app.use(express.json())

const postsRouter = require('./routes/posts')
const usersRouter = require('./routes/users')
app.use('/posts',postsRouter)
app.use('/users',usersRouter)

