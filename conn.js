require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.URI;
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("users").collection("userData");
  console.log("Mongodb connected successfully")
});

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('mongodb connected...')
    const collection = client.db("users").collection("userData");
    })
  .catch(err=>console.log(err));


  // User.plugin(passportLocalMongoose);

//   module.exports = mongoose.model('userData', User, 'userData');
  // client.close();
// });


