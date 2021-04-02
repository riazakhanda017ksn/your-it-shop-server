const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectID;
const cors=require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5055
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enpeg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
  const eventCollection = client.db("your-shop").collection("events");
  const userCollection = client.db("your-shop").collection("UserDetailsShow");

// app.get('/UserDetailsShow',(req,res)=>{
//   userCollection.find({})
//   .toArray((err,documents)=>{
//     res.send(documents)
//   })
// })
app.get('/UserDetailsShow',(req,res)=>{
  userCollection.find()
  .toArray((err,items)=>{
    res.send(items)
  })
})




app.post('/UserDetailsItem',(req,res)=>{
  const newClient=req.body;
  userCollection.insertOne(newClient)
 .then(result=>{
    res.send(result.insertedCount > 0)
    console.log(result);
 })
 console.log(newClient);
})



 
  app.get('/events',(req,res)=>{
    eventCollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  })

    app.post('/addProduct',(req,res)=>{
      const newEvent=req.body;
      console.log('new event', newEvent);
      eventCollection.insertOne(newEvent)
      .then(result=>{
        res.send(result.insertedCount > 0)
      })
    })

    app.delete('/deleteProduct/:id',(req,res)=>{
      const id=ObjectId(req.params.id);
      console.log('delete this');
      eventCollection.findOneAndDelete({_id: id})
      .then((err,documents)=>res.send(documents.value))
    })
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})