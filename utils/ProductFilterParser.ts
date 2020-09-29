import { ParseRangeString } from "./RangeStringParser";
import { MultipleValueFilter } from "../interfaces/IFilter";
import { MultipleValueFilterParser } from './MultipleValueFilterParser';
import { ObjectId } from "mongodb";

export function ProductFilterParser(filters: any, operator: string) {
    if (operator !== 'or' && operator !== 'and') { return null; }
    operator = (operator === 'or') ? '$or' : '$and'
    let find: any = { [operator]: [] };
    for (const key in filters) {
        switch(typeof(filters[key])) {
            case 'string':
                switch(key) {
                    case 'Categories':
                        try {
                            const oId = new ObjectId(filters[key])
                            find['Categories'] = { $in: [ oId ]}
                        } catch (err) {
                            return null;
                        }
                        break;
                    case 'Color':
                        if (!Array.isArray(filters[key])) filters[key] = [filters[key]]
                        find['Color'] = filters[key]
                        break;                        
                    case 'Brand':
                        if (!Array.isArray(filters[key])) filters[key] = [filters[key]]
                        find['Brand'] = filters[key]
                        break;
                    case 'Price':
                        const c1 = ParseRangeString(filters[key])
                        if (c1 != null) {
                            if (!Array.isArray(c1)) {
                                find[operator].push({ Price: c1 });
                            } else {
                                find[operator].push(
                                    { Price: c1[0]},
                                    { Price: c1[1]}
                                )
                            }
                        } else {
                            return null;
                        }
                        break;
                    case 'Rating':
                        const c2 = ParseRangeString(filters[key]);
                        if (c2 != null) {
                            if (!Array.isArray(c2)) {
                                find[operator].push({ Rating: c2 });
                            } else {
                                find[operator].push(
                                    { Rating: c2[0] },
                                    { Rating: c2[1] }
                                )
                            }
                        } else {
                            return null;
                        }
                        break;
                    case 'DiscountRate':
                        const c3 = ParseRangeString(filters[key]);
                        if (c3 != null) {
                            if (!Array.isArray(c3)) {
                                find[operator].push({ DiscountRate: c3 });
                            } else {
                                find[operator].push(
                                    { DiscountRate: c3[0]},
                                    { DiscountRate: c3[1]}
                                )
                            }
                        } else {
                            return null;
                        }
                        break;
                }
                break;
            case 'object':
                if (Array.isArray(filters[key])) {
                    switch(key) {
                        case 'Categories':
                            try {
                                find['Categories'] = { $in: filters[key].map((i: string) => new ObjectId(i)) }
                            } catch (err) {
                                console.log(err);
                                return null;
                            }
                            break;
                        case 'Color':
                            // if (!Array.isArray(filters[key])) filters[key] = [filters[key]]
                            find['Color'] = { $in: filters[key] };
                            break;                        
                        case 'Brand':
                            // if (!Array.isArray(filters[key])) filters[key] = [filters[key]]
                            find['Brand'] = { $in: filters[key] };
                            break;
                    }
                } else {
                    switch(key) {
                        case 'Categories':
                            try {
                                if (filters[key].in && Array.isArray(filters[key].in)) { filters[key].in = filters[key].in.map((i: string) => new ObjectId(i)) }
                                if (filters[key].ex && Array.isArray(filters[key].ex)) {filters[key].ex = filters[key].ex.map((i: string) => new ObjectId(i))}
                                const arrCt = MultipleValueFilterParser(filters[key], 'Categories');
                                if (arrCt != null) {
                                    if (arrCt[operator] && find[operator]) {
                                        find[operator] = find[operator].concat(arrCt[operator])
                                    } else if (arrCt[operator] && !find[operator]) {
                                        find[operator] = arrCt[operator];
                                    } else {
                                        Object.assign(find, arrCt)
                                    }
                                } else {
                                    return null;
                                }
                            } catch (err) {
                                console.log(err);
                                return null;
                            }
                            break;
                        case 'ProductSpecificFields':
                            for (const innerKey in filters[key]) {
                                const innerFindKeyName = key + '.' + innerKey;

                                switch(typeof(filters[key][innerKey])) {
                                    case 'string':
                                        find[operator].push({ [innerFindKeyName]: { $exists: true } });
                                        find[operator].push({ [innerFindKeyName]: { $eq: filters[key][innerKey]} });
                                        break;
                                    case 'number':
                                        find[operator].push({ [innerFindKeyName]: { $exists: true } });
                                        find[operator].push({ [innerFindKeyName]: { $eq: filters[key][innerKey] } });
                                        break;
                                    case 'boolean':
                                        find[operator].push({ [innerFindKeyName]: { $exists: true } });
                                        find[operator].push({ [innerFindKeyName]: filters[key][innerKey] });
                                        break;
                                    case 'object':
                                        if (!filters[key][innerKey].has || (filters[key][innerKey] === true && !filters[key][innerKey].value)) return null;
                                        find[operator].push({ [innerFindKeyName]: { $exists: filters[key][innerKey].has } });
                                        if (filters[key][innerKey].has) {
                                            if (Array.isArray(filters[key][innerKey].value)) {
                                                // find[operator].push({ [innerFindKeyName]: { $in: filters[key][innerKey].value} });
                                            } else {
                                                find[operator].push({ [innerFindKeyName]: filters[key][innerKey].value });
                                            }
                                        }
                                        break;
                                }
                            }
                            break;
                        case 'Color':
                            const arrC = MultipleValueFilterParser(filters[key], 'Color');
                            if (arrC != null) {
                                if (arrC != null) {
                                    if (arrC[operator] && find[operator]) {
                                        find[operator] = find[operator].concat(arrC[operator])
                                    } else if (arrC[operator] && !find[operator]) {
                                        find[operator] = arrC[operator];
                                    } else {
                                        Object.assign(find, arrC)
                                    }
                                } else {
                                    return null;
                                }
                            } else {
                                return null;
                            }
                            break;
                        case 'Brand':
                            const arr = MultipleValueFilterParser(filters[key], 'Brand');
                            if (arr != null) {
                                if (arr[operator] && find[operator]) {
                                    find[operator] = find[operator].concat(arr[operator])
                                } else if (arr[operator] && !find[operator]) {
                                    find[operator] = arr[operator];
                                } else {
                                    Object.assign(find, arr)
                                }
                            } else {
                                return null;
                            }
                            break;
                    }
                }
        }
    }
    if (find[operator].length === 0) { delete(find[operator]) }
    return find;
}