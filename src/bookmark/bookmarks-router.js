const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const { bookmarks } = require('../store');
const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, desc, rating } = req.body;

    if (!title) {
      logger.error('Title is required');
      return res.status(400).send('Invalid data');
    }
    if (!url) {
      logger.error('URL is required');
      return res.status(400).send('Invalid data');
    }
    if (!desc) {
      logger.error('Description is required');
      return res.status(400).send('Invalid data');
    }
    if (!rating) {
      logger.error('Rating is required');
      return res.status(400).send('Invalid data');
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      desc,
      rating
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

module.exports = bookmarksRouter;
