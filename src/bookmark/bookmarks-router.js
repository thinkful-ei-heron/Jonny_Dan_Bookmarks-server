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
      const error = 'Title is required';
      logger.error(error);
      return res.status(400).send(error);
    }
    if (!url) {
      const error = 'URL is required';
      logger.error(error);
      return res.status(400).send(error);
    }
    if (!desc) {
      const error = 'Description is required';
      logger.error(error);
      return res.status(400).send(error);
    }
    if (!rating) {
      const error = 'Rating is required';
      logger.error(error);
      return res.status(400).send(error);
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
bookmarksRouter
    .route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const bookmark = bookmarks.find(b => b.id === id);
      if (!bookmark) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res
            .status(404).send('Bookmark Not Found');
      }

      res.json(bookmark);
    })
    .delete((req, res) => {
      const { id } = req.params;
      const bookmarkIndex = bookmarks.findIndex(b => b.id === id);
      if (bookmarkIndex === -1) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res.status(404).send('Not found');
    }
      bookmarks.splice(bookmarkIndex, 1);
      logger.info(`Bookmark with id ${id} deleted.`);
      res.status(204).end();
});
module.exports = bookmarksRouter;
