const express = require('express');
const multer = require('multer');

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/admin/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storageConfig });

const blogControllers = require('../../controllers/post-controller');
const guardRoute = require('../../middlewares/auth-protection-middleware');

const router = express.Router();

router.use(guardRoute);

router.get('/posts', blogControllers.getPosts);

router.get('/new-post', blogControllers.getNewPost);

router.post('/new-post', upload.single('image'), blogControllers.postNewPost);

router.get('/blog/:id/edit', blogControllers.getBlodIdEdit);

router.post('/blog/:id/edit', blogControllers.postBlogIdEdit);

router.post('/blog/:id/delete', blogControllers.postBlogIdDelete);

router.get('/admin', blogControllers.getAdmin);

module.exports = router;
