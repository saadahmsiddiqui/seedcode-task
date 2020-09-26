import multer from 'multer';
import { v4 } from 'uuid';
import path from 'path';

export const carImagesUploader = multer({
    storage: multer.diskStorage({
        destination: 'public/cars/',
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, v4() + ext);
        }
    }),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});

export const carRangeImagesUploader = multer({
    storage: multer.diskStorage({
        destination: 'public/ranges/',
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, v4() + ext);
        }
    }),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});

export const carBrandImagesUploader = multer({
    storage: multer.diskStorage({
        destination: 'public/brands/',
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, v4() + ext);
        }
    }),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});

export const characterImagesUploader = multer({
    storage: multer.diskStorage({
        destination: 'public/characters/',
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, v4() + ext);
        }
    }),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});