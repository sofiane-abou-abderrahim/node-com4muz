// const h3ElementTitle = document.getElementById('title');
// h3ElementTitle.textContent = 'Contactez-nous pour faire du business';

// const inputMessageElement = document.getElementById('message');
// function retrieveUserInput(event) {
//   // const enteredText = inputMessageElement.value;
//   const enteredText = event.target.value;
//   console.log(enteredText);
//   // console.log(event);
// }
// inputMessageElement.addEventListener('input', retrieveUserInput);

// Display chars count
const inputMessageElement = document.getElementById('message');
const remaingCharsElement = document.getElementById('remaining-chars');

const maxAllowedChars = inputMessageElement.maxLength;

function updateRemainingCharacters(event) {
  const enteredText = event.target.value;
  const enteredTextLength = enteredText.length;

  const remainingCharacters = maxAllowedChars - enteredTextLength;

  remaingCharsElement.textContent = remainingCharacters;

  if (remainingCharacters === 0) {
    remaingCharsElement.classList.add('error');
    inputMessageElement.classList.add('error');
  } else if (remainingCharacters <= 10) {
    remaingCharsElement.classList.add('warning');
    inputMessageElement.classList.add('warning');
    remaingCharsElement.classList.remove('error');
    inputMessageElement.classList.remove('error');
    inputMessageElement.classList.remove('focus-textarea');
  } else {
    remaingCharsElement.classList.remove('warning');
    inputMessageElement.classList.remove('warning');
    inputMessageElement.classList.add('focus-textarea');
  }
}

inputMessageElement.addEventListener('input', updateRemainingCharacters);
