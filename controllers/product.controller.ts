import express from 'express';
import { ObjectId } from 'mongodb';
import { proModel } from '../index';
import { isValidSortQuery } from '../utils/DocumentSortValidator';
import { postProduct, updateProduct } from '../utils/JoiValidations';
import { isValidProjection } from '../utils/ProjectionValidator';
import { ProductFilterParser } from '../utils/ProductFilterParser';
const router = express.Router();
const allowedKeys = ['Brand', 'Categories', 'Color', 'Description', 'DiscountRate', 'Images', 'Name', 'Price', 'ProductSpecificFields', 'Rating'];

router.get('/GetAllProducts', async (req, res) => {
    try {
        let page = 0, limit = 20, select = {}, sort = {}, find = {};
        if (req.query.page) { page = (parseInt(req.query.page as any)) }
        if (page > 0) page = (page - 1) * limit;
        if (req.body.Select) { if (!isValidProjection(req.body.Select, allowedKeys)) { throw new Error('Invalid Request') } else { select = req.body.Select } }
        if (req.body.Sort) { if (!isValidSortQuery(req.body.Sort, allowedKeys)) { throw new Error('Invalid Request') } else { sort = req.body.Sort } }
        if (req.body.Filters && !req.body.OP) {throw new Error('Invalid Request');}
        if (req.body.Filters && req.body.OP) { find = ProductFilterParser(req.body.Filters, req.body.OP); if(find === null) { throw new Error('Invalid Request'); } }

        const result = await proModel.find(find, select, sort, page, limit);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message ? err.message : 'Something went wrong.' });
    }
});

router.get('/Product/:ProductId', async (req, res) => {
    try {
        let select = {};
        const oId = new ObjectId(req.params.ProductId);
        if (req.body.Select) { if (!isValidProjection(req.body.Select, allowedKeys)) { throw new Error('Invalid Request') } else { select = req.body.Select } }
        const result = await proModel.findOne({ _id: oId }, select);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message ? err.message : 'Something went wrong.' });
    }
});

router.get('/SearchProducts', async (req, res) => {
    try {
        let page = 0, limit = 20, select = {}, sort = {}, find: any = {};
        if (req.query.page) { page = (parseInt(req.query.page as any)) }
        if (page > 0) page = (page - 1) * limit;        
        if (req.body.Select) { if (!isValidProjection(req.body.Select, allowedKeys)) { throw new Error('Invalid Request') } else { select = req.body.Select } }
        if (req.body.Sort) { if (!isValidSortQuery(req.body.Sort, allowedKeys)) { throw new Error('Invalid Request') } else { sort = req.body.Sort } }
        if (req.body.Filters && !req.body.OP) {throw new Error('Invalid Request');}
        if (req.body.Filters && req.body.OP) { find = ProductFilterParser(req.body.Filters, req.body.OP); if(find === null) { throw new Error('Invalid Request'); } }
        if (req.query.key) { let name = decodeURIComponent(req.query.key as string); find['Name'] = new RegExp(name, 'gi') } else { throw new Error('Invalid Request'); }
        const result = await proModel.find(find, select, sort, page, limit);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message ? err.message : 'Something went wrong.' });
    }
});

router.post('/Product', async (req, res) => {
    try {
        const { Product } = req.body;
        const { error } = postProduct.validate(Product);
        if (error) {
            res.status(400).json({ status: 'error', message: error.message });
        } else {
            Product._id = new ObjectId();
            await proModel.InsertOne(Product);
            res.status(200).json({ status: 'success', data: Product })
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message ? err.message : 'Something went wrong.' });
    }
});

router.put('/Product/:ProductId', async (req, res) => {
    try {
        const { Product } = req.body;
        const Id = new ObjectId(req.params.ProductId)
        const { error } = updateProduct.validate(Product);
        if (error) {
            res.status(400).json({ status: 'error', message: error.message });
        } else {
            Product.Categories = Product.Categories.map((i: string) => new ObjectId(i))
            await proModel.updateOne({ _id: Id }, { $set: Product });
            res.status(200).json({ status: 'success', message: 'Product Updated.' })
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message ? err.message : 'Something went wrong.' });
    }
});

router.get('/GetProductsByCategory/:CategoryId', async (req, res) => {
    try {
        let page = 0, limit = 20, select = {}, sort = {}, find: any = {};
        if (req.query.page) { page = (parseInt(req.query.page as any)) }
        if (page > 0) page = (page - 1) * limit;
        if (req.body.Select) { if (!isValidProjection(req.body.Select, allowedKeys)) { throw new Error('Invalid Request') } else { select = req.body.Select } }
        if (req.body.Sort) { if (!isValidSortQuery(req.body.Sort, allowedKeys)) { throw new Error('Invalid Request') } else { sort = req.body.Sort } }
        if (req.body.Filters && !req.body.OP) {throw new Error('Invalid Request');}
        if (req.body.Filters && req.body.OP) { find = ProductFilterParser(req.body.Filters, req.body.OP); if(find === null) { throw new Error('Invalid Request'); } }
        if (find.Categories) {
            find.Categories = { $in: [new ObjectId(req.params.CategoryId)] }
        }

        const result = await proModel.find(find, select, sort, page, limit);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message ? err.message : 'Something went wrong.' });
    }
});

export const productRouter = router;