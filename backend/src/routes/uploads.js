import crypto from 'crypto';
import express from 'express';
import multer from 'multer';
import _ from 'lodash';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    // file name format: <timestamp>_<random string>
    cb(null, Date.now() + "_" + crypto.randomBytes(8).toString('hex'));
  }
});
const upload = multer({ storage });

router.post('/', upload.array('files'), function(req, res, next) {
  const files =
    _.chain(req.files)
     .keyBy('originalname')
     .mapValues(file => _.pick(file, ['filename']))
     .value();

  res.send({ files });
});

module.exports = router;
