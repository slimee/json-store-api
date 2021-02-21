const express = require('express')
const router = express.Router()
const { col } = require('../db')
const documents = col('documents')
const debug = require('debug')('api:json-store')

router.get('/:_id', (req, res) => {
  const _id = req.params._id;
  const password = req.query.p;
  documents.findOne({ _id })
    .then((document) => {
      if(!password || password !== document.password) delete document.password;
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
