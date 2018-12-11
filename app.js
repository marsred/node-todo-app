const express = require('express');
const hbs = require('hbs');

const {Todo} = require('./models/Todo');
const {ObjectId} = require('./base/db');

const app = express();
const port = 3000;
const filesRoot = __dirname + '/files/';

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + '/public'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {
  res.render('list.hbs');
});

app.post('/add', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save((err, doc) => {
    if(err) {
      res.send({success: false});
    }

    res.send({success: true, docId: doc.id});
  });
});

app.get('/list', (req, res) => {
  Todo.find({completed: false}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(500).send({error: "There was some error"});
  });
});

app.post('/mark', (req, res) => {
  Todo.findById(new ObjectId(req.body.docId))
    .then((task) => {
      if(!task) {
        return res.status(404).send();
      }

      task.completed = req.body.complete;
      task.save().then((doc) => {
        res.set(200).send({success: true});
      }, () => {
        res.set(200).send({success: false});
      });
    }, () => res.status(404).send());
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

module.exports.app = app;
