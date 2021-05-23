const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ryify.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);

const port = process.env.PORT || 5001;


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error',err);
  const eventCollection = client.db("testrun").collection("test");

  app.get('/events', (req,res) => {
    eventCollection.find()
    .toArray((err, items) => {
      // console.log('from database', items)
      res.send(items);
    })

  })
  
  app.post('/addEvent', (req, res) => {
    const NewEvent = req.body;
    console.log('adding event', NewEvent);
    eventCollection.insertOne(NewEvent)
    .then(result => {
      console.log('inserted count',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('deleteEvent/:id', (req,res) => {
    const id= ObjectID(req.params.id);
    console.log('delete this', id);
    eventCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(documents.value))
  })
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})