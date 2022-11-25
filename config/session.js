const mongodbStore = require('connect-mongodb-session');

function createSessionStore(session) {
  const MongoDBStore = mongodbStore(session);

  const sessionStore = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017',
    databaseName: 'com4muz-blog',
    collection: 'sessions'
  });

  return sessionStore;
}

function createSessionConfig(sessionStore) {
  return {
    secret: 'super-secret-secure-authentication',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    }
  };
}

module.exports = {
  createSessionStore: createSessionStore,
  createSessionConfig: createSessionConfig
};
