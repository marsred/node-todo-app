const request = require('supertest');
const expect = require('expect');

const {app} = require('../app');
const {Todo} = require('../models/Todo');
const {mongoose,ObjectId} = require('../base/db');

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany([{text:'Test task 1'}])
  }).then(() => done());
});

describe("TODO API", () => {
  it('should expose an api to expose a list of incomplete tasks', (done) => {
    request(app)
      .get('/list')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
        expect(res.body.todos[0].text).toBe('Test task 1');
      })
      .end(done);
  });
  it('should expose a post api to add a task and return the document id', function(done) {
    var docId;
    request(app)
      .post('/add')
      .send({text: 'Test post task'})
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.docId).not.toBeUndefined();
        docId = res.body.docId;
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find({}).then((todos) => {
          expect(todos[1].text).toBe('Test post task');
          expect(todos[1].id).toBe(docId);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should expose an API to mark a task complete', (done) => {
    Todo.findOne({}).then((doc) => {
      request(app)
        .post('/mark')
        .send({docId: doc.id, complete: true})
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        })
        .end((err,res) => {
          if(err) {
            return done(err);
          }

          Todo.findById(new ObjectId(doc.id))
            .then((newdoc) => {
              expect(newdoc.id).toBe(doc.id);
              expect(newdoc.completed).toBe(true);
              done();
            }, (err) => done(err))
            .catch((e) => done(e));
        })
    }).catch((e) => done(e));
  });
});
