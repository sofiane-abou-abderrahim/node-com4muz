const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'data', 'contacts.json');

function getStoredContacts() {
  const fileData = fs.readFileSync(filePath);
  const storedContacts = JSON.parse(fileData);

  return storedContacts;
}

function storeContacts(storableContacts) {
  fs.writeFileSync(filePath, JSON.stringify(storableContacts));
}

module.exports = {
  getStoredContacts: getStoredContacts,
  storeContacts: storeContacts
};
