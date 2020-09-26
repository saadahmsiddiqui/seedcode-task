import { ObjectId } from 'mongodb';
import { IProductSpecificField } from './IProductSpecificField';

export interface IProduct {
    _id: ObjectId;
    Name: string;
    Description: string;
    Price: number;
    Rating: number;
    DiscountRate: number;
    Categories: ObjectId[];
    ProductSpecificFields: IProductSpecificField;
    Images: string[];
    Color: string;
    Brand: string;
}