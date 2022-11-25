const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'data', 'posts.json');

function getStoredPosts() {
  const fileData = fs.readFileSync(filePath);
  const storedPosts = JSON.parse(fileData);

  return storedPosts;
}

function storePosts(storablePosts) {
  fs.writeFileSync(filePath, JSON.stringify(storablePosts));
}

module.exports = {
  getStoredPosts: getStoredPosts,
  storePosts: storePosts
};
