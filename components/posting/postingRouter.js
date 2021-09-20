const express = require('express');
const postingController = require('./postingController');
const validateSchema = require('./middleware/validateGossip');
const gossipSchema = require('./schema/gossipSchema');
const deleteGossipSchema = require('./schema/deleteGossipSchema');
const auth = require('./middleware/auth');
const upload = require('./middleware/multer');
const { errorHandlingMiddleware } = require('./postingErrors');

const router = new express.Router();

router.post(
  '/posting',
  auth,
  upload.single('post_img'),
  validateSchema(gossipSchema),
  postingController.posting
);

router.delete(
  '/post',
  auth,
  validateSchema(deleteGossipSchema),
  postingController.deleteGossip
);

router.use(errorHandlingMiddleware);

// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (error, p) => {
  console.log('=== UNHANDLED REJECTION ===');
  console.dir(error.stack);
});

module.exports = router;
