import express from 'express';
import { ObjectId } from 'mongodb';
import { catModel } from '../index';
import { isValidSortQuery } from '../utils/DocumentSortValidator';
import { isValidProjection } from '../utils/ProjectionValidator';
const router = express.Router();

const allowedProjectionKeys = ['Image', 'Name'];

router.get('/GetAllCategories', async (req, res) => {
    try {
        let page = 0, limit = 20, select = {}, sort = {};

        if (req.query.page) { page = (parseInt(req.query.page as any)); if (isNaN(page)) { throw new Error("Invalid Request.");}  }
        if (req.body.Select) { if (!isValidProjection(req.body.Select, allowedProjectionKeys)) { throw new Error('Invalid Request') } else { select = req.body.Select } }
        if (req.body.Sort) { if (!isValidSortQuery(req.body.Sort, allowedProjectionKeys)) { throw new Error('Invalid Request') } else { sort = req.body.Sort } }
        if (page > 0) page = (page - 1) * limit;

        const result = await catModel.find({}, select, sort, page, limit);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message ? err.message : 'Something went wrong.' });
    }
});

router.get('/Category/:CategoryId', async (req, res) => {
    try {
        let catId = null, select = {};
        catId = new ObjectId(req.params.CategoryId);
        if (req.body.Select) { if (!isValidProjection(req.body.Select, allowedProjectionKeys)) { throw new Error('Invalid Request') } else { select = req.body.Select } }
        if (catId) {
            const result = await catModel.findOne({ _id: catId }, select);
            res.status(200).json({ status: 'success', data: result });
        } else {
            res.status(400).json({ status: 'error', error: 'Invalid Id.' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message ? err.message : 'Something went wrong.' });
    }
});

router.post('/Category', async (req, res) => {
    try {
        if (req.body.Category && req.body.Category.Name && req.body.Category.Image) {
            const result = await catModel.InsertOne(req.body.Category);
            res.status(200).json({ status: 'success', data: result });
        } else {
            res.status(500).json({ status: 'error', error: 'Invalid Request.' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message ? err.message : 'Something went wrong.' });
    }
});


router.put('/Category/:CategoryId', async (req, res) => {
    try {
        const oId = new ObjectId(req.params.CategoryId)
        if (oId && req.body.Category && (req.body.Category.Name || req.body.Category.Image) && !req.body.Category._id) {
            const result = await catModel.updateOne({ _id: oId }, { $set: req.body.Category });
            res.status(200).json({ status: 'success', data: result, message: 'Category Updated.' });
        } else {
            res.status(500).json({ status: 'error', error: 'Invalid Request.' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message ? err.message : 'Something went wrong.' });
    }
});

export const categoryRouter = router;