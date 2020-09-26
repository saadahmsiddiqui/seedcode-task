import { MultipleValueFilter } from "../interfaces/IFilter";

export function MultipleValueFilterParser(filterValue: MultipleValueFilter, keyName: string) {
    if (!filterValue.in && !filterValue.ex) return null;
    if (!filterValue.in || !filterValue.ex) {
        return filterValue.in ? { [keyName]: { $in: filterValue.in } } : { [keyName]: { $in: filterValue.ex } }
    } else {
        let exists = false;
        filterValue.in.filter((i: string) => {
            filterValue.ex.forEach((br: string) => {
                if (i === br) exists = true;
            })
            return i;
        })
        if (exists) return null;

        return { [keyName]: { $in: filterValue.in, $nin: filterValue.ex } }
    }
}