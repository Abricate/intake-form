import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import _ from 'lodash';
import path from 'path';
import { extension as mimeExtension, lookup as mimeLookup } from 'mime-types';
import DxfParser from 'dxf-parser';
import Dxf from 'dxf';

import db, { createBoxFile } from '../db';
import box, { uploadFileToBox } from '../clients/box';
import { promisify } from '../util';

const mime = promisify(require('mime-magic'));
const router = require('express-promise-router')();

const UploadDir = './uploads/';
const storage = multer.diskStorage({
  destination: UploadDir,
  filename: function (req, file, cb) {
    // file name format: <timestamp>_<random string>
    cb(null, Date.now() + "_" + crypto.randomBytes(8).toString('hex'));
  }
});
const upload = multer({ storage });

/* if provided file mimetype is any of these, ignore it */
const fileMimetypeBlacklist = [
  'application/octet-stream',
  '',
  null,
  undefined
]

const fileExtensionWhitelist = [
  'ai',
  'dwg',
  'dxf',
  'pdf',
  'svg',
];

router.post('/', upload.array('files'), async function(req, res) {
  const boxFiles = _.fromPairs(await Promise.all(
    _.values(req.files).map ( async file => {
      const filepath = path.join(UploadDir, file.filename);

      /* infer mimetype and extension from upload
       * using following order of precedence:
       *   - mimetype set by browser on uplaod (unless in blacklist)
       *   - file extension on original file if in whitelist
       *   - mimetype from file extension
       *   - mimetype using mime magic from file contents
       *   - extension for mime magic inferred mimetype
       */
      
      let mimetype, extension;
      
      if(!fileMimetypeBlacklist.includes(file.mimetype)) {
        mimetype = file.mimetype;
      }

      const m = file.originalname.match(/.*\.(.*)/);
      if(m !== null) {
        const fileExtension = m[1].toLowerCase();
        if(fileExtensionWhitelist.includes(fileExtension)) {
          mimetype = mimetype || mimeLookup(fileExtension);
          extension = extension || fileExtension;
        }
      }

      if(!mimetype) {
        mimetype = await mime(filepath);
      }

      if(mimetype && !extension) {
        extension = mimeExtension(mimetype);
      }
      
      const destFilename = extension ? file.filename + '.' + extension : file.filename;
      console.log('uploading to box', filepath, destFilename);
      const boxFile = await uploadFileToBox(filepath, destFilename);
      
      if(boxFile.entries.length !== 1) {
        throw Error('expected one file in Box, got ' + boxFile.entries.length);
      }

      let pathLength = null;
      if(destFilename.toLowerCase().endsWith('.dxf')) {
        try {
          const { dxf, parsedDxf } = await new Promise( (resolve, reject) => {
            fs.readFile(filepath, 'utf8', (err, data) => {
              if(err) {
                console.error('Error reading uploaded DXF file', err);
              } else {
                const parsedDxf = Dxf.parseString(data);

                const parser = new DxfParser();

                const dxf = parser.parseSync(data);
                if(err) {
                  reject(err);
                } else {
                  resolve({ parsedDxf, dxf });
                }
              }
            })
          });
          
          const svg = Dxf.toSVG(parsedDxf);

          // see https://github.com/svgdotjs/svgdom
          const window   = require('svgdom');
          const SVG      = require('svg.js')(window);
          const document = window.document

          // create svg.js instance
          const draw = SVG(document.documentElement)

          const svgDocument = draw.svg(svg);
          var lengths = [];
          svgDocument.select('path').each( function() { lengths.push(this.length()); })
          const totalPathLength = _.sum(lengths);

          pathLength = {
            length: totalPathLength,
            units: dxf && dxf.header['$MEASUREMENT'] === 0 ? 'in' : 'mm'
          }
        } catch(err) {
          console.error('Error parsing uploaded DXF file', err);
        }
      }
      
      return [file.originalname, { boxFile: boxFile.entries[0], pathLength }];
    })
  ));

  const dbFiles = _.fromPairs(await Promise.all(
    _.map(boxFiles, async ({ boxFile, pathLength }, originalname) => {
      const { shared_link } = await box.files.update(boxFile.id, { shared_link: {access: 'collaborators'} });
      
      const dbFile = await createBoxFile({
        boxId: boxFile.id,
        sharedLinkUrl: shared_link.url,
        downloadUrl: shared_link.download_url,
        props: { pathLength }
      });

      return [originalname, dbFile];
    })
  ));

  res.send({files: _.mapValues(dbFiles, 'identifier')});
});

module.exports = router;
