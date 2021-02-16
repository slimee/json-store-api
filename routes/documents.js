var express = require('express')
var router = express.Router()
var { col } = require('../db')
var documents = col('documents')
var debug = require('debug')('api:json-store')

router.get('/:_id', (req, res) => {
  const _id = req.params._id;
  documents.findOne({ _id })
    .then((document) => {
      delete document.password;
      return res.send(document);
    })
    .catch(debug)
})

router.post('/', (req, res, next) => {
  const document = req.body;
  const { _id, password } = document;

  if(!password) return res.status(422).send({ message:"missing password" });
  if(!_id) return res.status(422).send({ message:"missing _id" });

  documents
      .updateOne({_id, password}, { $set: document}, { upsert: true })
      .then(() => res.sendStatus(200))
      .catch(next);
})

module.exports = router
