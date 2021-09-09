const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Gossip = require('../../models/gossip');
const config = require('../../config/config');
const { Error } = require('./postingErrors');

beforeAll(async () => {
  if (config.ENV !== 'test') {
    throw new Error('ENV should be changed to test');
  }
  await Gossip.deleteMany();
});

afterAll(() => {
  mongoose.connection.close();
});

test('invalid gossip body', async () => {
  await request(app)
    .post('/posting')
    .send({
      gossip: 12345,
      hashtags: ['celebrity', 'cs'],
      author_id: 'author_id',
      author_name: 'testing 5',
      author_authorized: 1,
      author_pic_id: 'author_pic_id',
    })
    .expect(400);
});

test('invalid gossip hashtags', async () => {
  await request(app)
    .post('/posting')
    .send({
      gossip: 'hello there mate!',
      hashtags: ['celebrity', 12345],
      author_id: 'author_id',
      author_name: 'testing 5',
      author_authorized: 1,
      author_pic_id: 'author_pic_id',
    })
    .expect(400);
});

test('invalid gossip author_id', async () => {
  await request(app)
    .post('/posting')
    .send({
      gossip: 'hello there mate',
      hashtags: ['celebrity', 'cs'],
      author_id: 12345,
      author_name: 'testing 5',
      author_authorized: 1,
      author_pic_id: 'author_pic_id',
    })
    .expect(400);
});

test('invalid gossip author_name', async () => {
  await request(app)
    .post('/posting')
    .send({
      gossip: 'hello there mate',
      hashtags: ['celebrity', 'cs'],
      author_id: 'author_id',
      author_name: 12345,
      author_authorized: 1,
      author_pic_id: 'author_pic_id',
    })
    .expect(400);
});

test('invalid gossip author_authorized', async () => {
  await request(app)
    .post('/posting')
    .send({
      gossip: 'hello there mate',
      hashtags: ['celebrity', 'cs'],
      author_id: 'author_id',
      author_name: 'author_name',
      author_authorized: 2,
      author_pic_id: 'author_pic_id',
    })
    .expect(400);

  await request(app)
    .post('/posting')
    .send({
      gossip: 'hello there mate',
      hashtags: ['celebrity', 'cs'],
      author_id: 'author_id',
      author_name: 'author_name',
      author_authorized: 'test',
      author_pic_id: 'author_pic_id',
    })
    .expect(400);
});

test('invalid gossip author_pic_id', async () => {
  await request(app)
    .post('/posting')
    .send({
      gossip: 'hello there mate',
      hashtags: ['celebrity', 'cs'],
      author_id: 'author_id',
      author_name: 'author_name',
      author_authorized: 1,
      author_pic_id: 12345,
    })
    .expect(400);
});

test('invalid gossip link', async () => {
  await request(app)
    .post('/posting')
    .send({
      gossip: 'hello there mate',
      hashtags: ['celebrity', 'cs'],
      author_id: 'author_id',
      author_name: 'author_name',
      author_authorized: 1,
      author_pic_id: 'author_pic_id',
      link: 12345,
    })
    .expect(400);
});

test('valid gossip data', async () => {
  const gossip = await request(app)
    .post('/posting')
    .send({
      gossip: 'hello there mate jest testing!',
      hashtags: ['celebrity', 'cs'],
      author_id: 'author_id',
      author_name: 'author_name',
      author_authorized: 1,
      author_pic_id: 'author_pic_id',
      link: 'link',
    })
    .expect(201);
  expect(gossip.body.status).toBe('success');
});
