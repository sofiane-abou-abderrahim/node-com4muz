const mongodb = require('mongodb');
const xss = require('xss')

const db = require('../data/database');

const Post = require('../models/post');

const validationSession = require('../util/validation-session');
const validation = require('../util/validation');

const ObjectId = mongodb.ObjectId;

async function getBlog(req, res) {
  const posts = await db
    .getDb()
    .collection('posts')
    .find({})
    .project({
      title: 1,
      summary: 1,
      content: 1,
      'author.name': 1,
      imagePath: 1
    })
    .toArray();
  console.log(posts);
  res.render('posts', { posts: posts });
}

async function getBlogId(req, res, next) {
  let postId = req.params.id;

  try {
    postId = new ObjectId(postId);
  } catch (error) {
    return res.status(404).render('404');
    // return next(error);
  }

  const post = await db
    .getDb()
    .collection('posts')
    .findOne({ _id: postId }, { summary: 0 });

  if (!post) {
    return res.status(404).render('404');
  }

  post.humanReadableDate = post.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  post.date = post.date.toISOString();

  res.render('post-detail', { post: post, comments: null });
}

async function getBlogIdComments(req, res) {
  const postId = new ObjectId(req.params.id);
  const comments = await db
    .getDb()
    .collection('comments')
    .find({ postId: postId })
    .toArray();

  res.json(comments);
}

async function postBlogIdComments(req, res) {
  const postId = new ObjectId(req.params.id);
  const newComment = {
    postId: postId,
    title: xss(req.body.title),
    text: xss(req.body.text)
  };
  await db.getDb().collection('comments').insertOne(newComment);
  res.json({ message: 'Commentaire ajouté !' });

  // res.status(500).json({ message: 'Error!' });
}

function getProfile(req, res) {
  if (!res.locals.isAuth) {
    // if (!req.session.user)
    return res.status(401).render('401');
  }
  res.render('profile');
}

async function getPosts(req, res) {
  const posts = await Post.fetchAll();

  res.render('posts-list', { posts: posts });
}

async function getNewPost(req, res) {
  const authors = await db.getDb().collection('authors').find().toArray();

  sessionErrorData = validationSession.getSessionErrorData(req, {
    title: '',
    summary: '',
    content: '',
    author: '',
    image: ''
  });

  res.render('create-post', { authors: authors, inputData: sessionErrorData });
}

async function postNewPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredSummary = req.body.summary;
  const enteredContent = req.body.content;

  const date = new Date();

  const uploadedImageFile = req.file;
  const imagePath = uploadedImageFile.path;

  const authorId = new ObjectId(req.body.author);
  const author = await db
    .getDb()
    .collection('authors')
    .findOne({ _id: authorId });

  const selectedAuthor = {
    author: {
      id: authorId,
      name: author.name,
      email: author.email
    }
  };

  if (
    !validation.postIsValid(
      enteredTitle,
      enteredSummary,
      enteredContent,
      selectedAuthor,
      imagePath
    )
  ) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: 'Entrée invalide - veuillez vérifier vos données.',
        title: enteredTitle,
        summary: enteredSummary,
        content: enteredContent,
        author: selectedAuthor,
        image: imagePath
      },
      function () {
        res.redirect('/new-post');
      }
    );

    return; // or return res.redirect('/new-post'); => Has the same effect
  }

  const post = new Post(
    enteredTitle,
    enteredSummary,
    enteredContent,
    date,
    selectedAuthor.author,
    imagePath
  );
  await post.save();

  res.redirect('/posts');
}

async function getBlodIdEdit(req, res, next) {
  let post;
  try {
    post = new Post(null, null, null, null, null, null, req.params.id);
  } catch (error) {
    // next(error);
    return res.status(404).render('404');
  }

  await post.fetch();

  if (!post.title || !post.summary || !post.content) {
    return res.status(404).render('404');
  }

  res.render('update-post', { post: post });
}

async function postBlogIdEdit(req, res) {
  const enteredTitle = req.body.title;
  const enteredSummary = req.body.summary;
  const enteredContent = req.body.content;

  const post = new Post(
    enteredTitle,
    enteredSummary,
    enteredContent,
    ...[, , ,], // pass 3 undefined arguments
    req.params.id
  );
  await post.save();

  res.redirect('/posts');
}

async function postBlogIdDelete(req, res) {
  const post = new Post(null, null, null, null, null, null, req.params.id);
  await post.delete();
  res.redirect('/posts');
}

async function getAdmin(req, res) {
  if (!res.locals.isAdmin) {
    return res.status(403).render('403');
  }

  res.render('admin');
}

module.exports = {
  getBlog: getBlog,
  getBlogId: getBlogId,
  getBlogIdComments: getBlogIdComments,
  postBlogIdComments: postBlogIdComments,
  getProfile: getProfile,
  getPosts: getPosts,
  getNewPost: getNewPost,
  postNewPost: postNewPost,
  getBlodIdEdit: getBlodIdEdit,
  postBlogIdEdit: postBlogIdEdit,
  postBlogIdDelete: postBlogIdDelete,
  getAdmin: getAdmin
};
