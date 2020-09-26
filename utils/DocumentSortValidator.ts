export function isValidSortQuery(sortObj: any, expectedKeys: string[]) {
    for(const k in sortObj) {
        if (k != '_id') {
            if (!expectedKeys.some(oke => oke === k)) { return false; }
            if (sortObj[k] !== 1 && sortObj[k] !== -1) {
                return false;
            }
        }
    }
    return true;
}