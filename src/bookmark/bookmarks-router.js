/* eslint-disable strict */
const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const { bookmarks } = require('../store');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const BookmarksService = require('./bookmarks-service');

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => res.json(bookmarks))
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { title, url, description, rating } = req.body;

    if (!title) {
      const error = `Missing 'title' in request body`;
      logger.error(error);
      return res.status(400).json({
        error: { message: error }
      });
    }

    if (!url) {
      const error = `Missing 'url' in request body`;
      logger.error(error);
      return res.status(400).json({
        error: { message: error }
      });
    }
    if (!rating) {
      const error = `Missing 'rating' in request body`;
      logger.error(error);
      return res.status(400).json({
        error: { message: error }
      });
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      description,
      rating
    };

    BookmarksService.insertBookmark(req.app.get('db'), bookmark)
      .then(bookmark => {
        res
          .status(201)
          .location(`http://localhost:8000/bookmarks/${id}`)
          .json(bookmark);
      })
      .catch(next);

    logger.info(`Bookmark with id ${id} created`);
  });

bookmarksRouter
  .route('/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { id } = req.params;
    BookmarksService.getBookmarkById(knexInstance, id)
      .then(bookmarks => res.json(bookmarks))
      .catch(next);
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
