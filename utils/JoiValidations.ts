import joi from 'joi';

export const postProduct = joi.object({
    Name: joi.string().min(3).max(500).normalize().required(),
    Description: joi.string().min(3).max(500).normalize().required(),
    Price: joi.number().required(),
    Rating: joi.number().required(),
    DiscountRate: joi.number().required(),
    Categories: joi.array().items(joi.string()).required(),
    ProductSpecificFields: joi.any(),
    Images: joi.array().items(joi.string()).required(),
    Color: joi.string().min(3).max(100).normalize().required(),
    Brand: joi.string().min(3).max(100).normalize().required()
})

export const updateProduct = joi.object({
    Name: joi.string().min(3).max(500).normalize(),
    Description: joi.string().min(3).max(500).normalize(),
    Price: joi.number(),
    Rating: joi.number(),
    DiscountRate: joi.number(),
    Categories: joi.array().items(joi.string()),
    ProductSpecificFields: joi.any(),
    Images: joi.array().items(joi.string()),
    Color: joi.string().min(3).max(100).normalize(),
    Brand: joi.string().min(3).max(100).normalize()
})

export const updateCategory = joi.object({
    Name: joi.string().min(3).max(100),
    Image: joi.string().min(3)
})

export const postCategory = joi.object({
    Name: joi.string().min(3).max(100).required(),
    Image: joi.string().min(3).required()
})
