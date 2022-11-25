const express = require('express');

const blogControllers = require('../../controllers/post-controller');

const router = express.Router();

router.get('/blog', blogControllers.getBlog);

router.get('/blog/:id', blogControllers.getBlogId);

router.get('/blog/:id/comments', blogControllers.getBlogIdComments);

router.post('/blog/:id/comments', blogControllers.postBlogIdComments);

router.get('/profile', blogControllers.getProfile);

module.exports = router;
