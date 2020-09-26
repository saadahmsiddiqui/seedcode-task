import { ObjectId } from 'mongodb';

export interface ICategory {
    Name: string;
    _id: ObjectId;
    Image: string;
}