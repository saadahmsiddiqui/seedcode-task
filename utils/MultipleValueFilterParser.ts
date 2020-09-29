import { MultipleValueFilter } from "../interfaces/IFilter";

export function MultipleValueFilterParser(filterValue: MultipleValueFilter, keyName: string, joinOperator: string = 'and') {
    joinOperator = (joinOperator === 'and') ? '$and' : '$or';
    if (!filterValue.in && !filterValue.ex) return null;
    if (!filterValue.in || !filterValue.ex) {
        return filterValue.in ? { [keyName]: { $in: filterValue.in } } : { [keyName]: { $nin: filterValue.ex } }
    } else {
        let exists = false;
        filterValue.in.filter((i: string) => {
            filterValue.ex.forEach((br: string) => {
                if (i === br) exists = true;
            })
            return i;
        })
        if (exists) return null;
        return { [joinOperator]: [ { [keyName]: { $nin: filterValue.ex } }, { [keyName]: { $in: filterValue.in } } ] }
//         return { [keyName]: { $in: filterValue.in, $nin: filterValue.ex } }
    }
}
