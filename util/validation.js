function postIsValid(title, summary, content, author, image) {
  return (
    title &&
    summary &&
    content &&
    author &&
    image &&
    title.trim() !== '' &&
    summary.trim() !== '' &&
    content.trim() !== ''
  );
}

module.exports = {
  postIsValid: postIsValid
};
