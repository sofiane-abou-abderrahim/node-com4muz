const User = require('../models/user');

function get401(req, res) {
  res.status(401).render('401');
}

function getSignup(req, res) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: '',
      confirmEmail: '',
      password: ''
    };
  }

  req.session.inputData = null;

  res.render('signup', { inputData: sessionInputData });
}

function getLogin(req, res) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: '',
      password: ''
    };
  }

  req.session.inputData = null;
  res.render('login', { inputData: sessionInputData });
}

async function signup(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email; // userData['email']
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password;

  if (
    !enteredEmail ||
    !enteredConfirmEmail ||
    !enteredPassword ||
    enteredPassword.trim().length < 6 ||
    enteredEmail !== enteredConfirmEmail ||
    !enteredEmail.includes('@')
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Entrée invalide - veuillez vérifier vos données.',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword
    };

    req.session.save(function () {
      res.redirect('/signup');
    });
    return;
    // return res.render('signup');
  }

  const newUser = new User(enteredEmail, enteredPassword);
  const userExistsAlready = await newUser.existsAlready();

  if (userExistsAlready) {
    req.session.inputData = {
      hasError: true,
      message: 'Cet utilisateur existe déjà.',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword
    };
    req.session.save(function () {
      res.redirect('/signup');
    });
    return;
  }

  await newUser.signup();

  res.redirect('/login');
}

async function login(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const newUser = new User(enteredEmail, enteredPassword);
  const existingUser = await newUser.getUserWithSameEmail();

  if (!existingUser) {
    req.session.inputData = {
      hasError: true,
      message:
        "Impossible de vous connecter - veuillez vérifier vos informations d'identification !",
      email: enteredEmail,
      password: enteredPassword
    };

    req.session.save(function () {
      res.redirect('/login');
    });
    return;
  }

  const success = await newUser.login(existingUser.password);

  if (!success) {
    req.session.inputData = {
      hasError: true,
      message:
        "Impossible de vous connecter - veuillez vérifier vos informations d'identification !",
      email: enteredEmail,
      password: enteredPassword
    };
    req.session.save(function () {
      res.redirect('/login');
    });
    return;
  }

  req.session.user = { id: existingUser._id, email: existingUser.email };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect('/profile');
  });
}

function logout(req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect('/admin');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
  get401: get401
};
