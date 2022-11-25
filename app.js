const path = require('path');

const express = require('express');
const session = require('express-session');

const sessionConfig = require('./config/session');

const db = require('./data/database');

const adminRoutes = require('./routes/admin/blog');
const authRoutes = require('./routes/admin/auth');

const defaultRoutes = require('./routes/home/default');
const postsRoutes = require('./routes/home/posts');
const quotationsRoutes = require('./routes/home/quotations');
const contactsRoutes = require('./routes/home/contacts');

const authMiddleware = require('./middlewares/auth-middleware');

const mongoDbSessionStore = sessionConfig.createSessionStore(session);

let port = 3000;

if (process.env.MONGODB_URL) {
  port = process.env.MONGODB_URL;
}

const app = express();

app.set('views', [
  path.join(__dirname, 'views/home'),
  path.join(__dirname, 'views/admin')
]);
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/public/admin/images', express.static('public/admin/images'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));

app.use(authMiddleware);
app.use('/', authRoutes);

app.use('/', defaultRoutes);
app.use('/', quotationsRoutes);
app.use('/', contactsRoutes);
app.use('/', postsRoutes);
app.use('/', adminRoutes);

app.use(function (req, res) {
  res.status(404).render('404');
});

app.use(function (error, req, res, next) {
  console.error(error);
  res.status(500).render('500');
});

db.connectToDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log('La connexion à la base de données a échoué !');
  });
