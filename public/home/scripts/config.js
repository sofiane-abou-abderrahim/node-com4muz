const configOverlayElement = document.getElementById('config-overlay');
const configOverlayResponseElement = document.getElementById(
  'config-overlay-response'
);
const backdropElement = document.getElementById('backdrop');
const cancelConfigBtnElement = document.getElementById('cancel-config-btn');
const cancelConfigBtnResponseElement = document.getElementById(
  'cancel-config-btn-response'
);
const formElement = document.querySelector('form');
const usernameErrorsOutputElement = document.getElementById(
  'username-config-errors'
);
const emailErrorsOutputElement = document.getElementById('email-config-errors');

function closeQuotationConfig() {
  configOverlayElement.style.display = 'none';
  configOverlayResponseElement.style.display = 'none';
  backdropElement.style.display = 'none';
  formElement.firstElementChild.classList.remove('error-username');
  formElement.firstElementChild.nextElementSibling.classList.remove(
    'error-email'
  );
}

function removeUsernameErrorsOutputElement(event) {
  formElement.firstElementChild.classList.remove('error-username');
  usernameErrorsOutputElement.textContent = '';
}

function removeEmailErrorsOutputElement(event) {
  formElement.firstElementChild.nextElementSibling.classList.remove(
    'error-email'
  );
  emailErrorsOutputElement.textContent = '';
}

function saveFormConfig(event) {
  // event.preventDefault();
  const formData = new FormData(event.target);
  const enteredUsername = formData.get('username').trim(); // '      ' => ''
  const enteredEmail = formData.get('email').trim(); // '      ' => ''

  if (!enteredUsername) {
    // enteredPlayername === ''
    event.target.firstElementChild.classList.add('error-username');
    usernameErrorsOutputElement.textContent = `Entrez un nom valide s'il vous plaît !`;
    return;
  } else {
    removeUsernameErrorsOutputElement();
  }

  if (!enteredEmail) {
    // enteredPlayername === ''
    event.target.firstElementChild.nextElementSibling.classList.add(
      'error-email'
    );
    emailErrorsOutputElement.textContent = `Entrez un email valide s'il vous plaît !`;
    return;
  } else {
    removeEmailErrorsOutputElement();
  }

  closeQuotationConfig();
  configOverlayResponseElement.style.display = 'block';
}

cancelConfigBtnElement.addEventListener('click', closeQuotationConfig);
cancelConfigBtnResponseElement.addEventListener('click', closeQuotationConfig);
backdropElement.addEventListener('click', closeQuotationConfig);
formElement.addEventListener('submit', saveFormConfig);
formElement.addEventListener('input', removeUsernameErrorsOutputElement);
formElement.addEventListener('input', removeEmailErrorsOutputElement);

// module.exports = {
//   closeQuotationConfig: closeQuotationConfig,
// };
