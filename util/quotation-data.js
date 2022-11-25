const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'data', 'quotations.json');

function getStoredQuotations() {
  const fileData = fs.readFileSync(filePath);
  const storedQuotations = JSON.parse(fileData);

  return storedQuotations;
}

function storeQuotations(storableQuotations) {
  fs.writeFileSync(filePath, JSON.stringify(storableQuotations));
}

module.exports = {
  getStoredQuotations: getStoredQuotations,
  storeQuotations: storeQuotations
};
