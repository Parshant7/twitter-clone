require('dotenv').config({ override: true});
const express = require("express");
const app = express();
const router = express.Router();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid").v4;
const path = require("path");
const fs = require("fs");


const s3 = new aws.S3(
    {
        apiVersion: '2022-07-01',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'twitter-clone-images-bucket',
        acl:'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname})
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
})

module.exports = upload;
