export interface IFilter {
    Brand: string[] | MultipleValueFilter | string;
    Color: string[] | MultipleValueFilter | string;
    Price: string;
    Rating: string;
    DiscountRate: string;
    Categories: string[] | MultipleValueFilter | string;
}

export interface MultipleValueFilter {
    in: string[];
    ex: string[];
}