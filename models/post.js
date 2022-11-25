const mongodb = require('mongodb');

const db = require('../data/database');

const ObjectId = mongodb.ObjectId;

class Post {
  constructor(title, summary, content, date, author, image, id) {
    this.title = title;
    this.summary = summary;
    this.content = content;
    this.date = date;
    this.author = author;
    this.image = image;

    if (id) {
      this.id = new ObjectId(id);
    }
  }

  static async fetchAll() {
    const posts = await db
      .getDb()
      .collection('posts')
      .find({})
      .project({ title: 1, summary: 1, content: 1, 'author.name': 1 })
      .toArray();
    return posts;
  }

  async fetch() {
    if (!this.id) {
      return;
    }

    const postDocument = await db
      .getDb()
      .collection('posts')
      .findOne(
        { _id: new ObjectId(this.id) },
        { title: 1, summary: 1, content: 1 }
      );

    this.title = postDocument.title;
    this.summary = postDocument.summary;
    this.content = postDocument.content;
  }

  async save() {
    let result;
    if (this.id) {
      result = await db
        .getDb()
        .collection('posts')
        .updateOne(
          { _id: this.id },
          {
            $set: {
              title: this.title,
              summary: this.summary,
              content: this.content
            }
          }
        );
    } else {
      result = await db.getDb().collection('posts').insertOne({
        title: this.title,
        summary: this.summary,
        content: this.content,
        date: this.date,
        author: this.author,
        imagePath: this.image
      });
    }

    return result;
  }

  async delete() {
    if (!this.id) {
      return;
    }
    const result = await db
      .getDb()
      .collection('posts')
      .deleteOne({ _id: this.id });
    return result;
  }
}

module.exports = Post;
