export function ParseRangeString(rangeString: string) {
    const regex = new RegExp(/^((!)?(>)?(<)?(=)?)?[0-9]*(-)?[0-9]*$/)
    if (rangeString.match(regex) === null) { return null; }
    if (rangeString.includes('!') && (rangeString.includes('<') || rangeString.includes('>') || rangeString.includes('-'))) { return null; }
    if (rangeString.includes('>') && rangeString.includes('<')) { return null; }
    if ((rangeString.includes('>') || rangeString.includes('<')) && rangeString.includes('-')) { return null; }
    if ((rangeString.includes('>=') || rangeString.includes('<=')) && rangeString.includes('-')) { return null; }
    if (!rangeString.includes('>=') && !rangeString.includes('<=') && rangeString.includes('-') && (rangeString.split('-')[1] === '' || rangeString.split('-')[0] === '')) { return null; }
    /**
     * Only a number
     */
    if (!rangeString.includes('!') && !rangeString.includes('>') && !rangeString.includes('<') && !rangeString.includes('=') && !rangeString.includes('-')) { return { $eq: parseInt(rangeString) } }
    /**
     * != Condition
     */
    if (rangeString.startsWith('!=')) { return { $ne: parseInt(rangeString.substr(2)) } }
    /**
     * Case Greater
     */
    if (rangeString.includes('>') && !rangeString.includes('=')) return { $gt: parseInt(rangeString.substr(1)) }
    /**
     * Case Greater Equal
     */
    if (rangeString.includes('>=')) return { $gte: parseInt(rangeString.substr(2)) }
    /**
     * Case Lesser
     */
    if (rangeString.includes('<') && !rangeString.includes('=')) return { $lt: parseInt(rangeString.substr(1)) }
    /**
     * Case Lesser Equal
     */
    if (rangeString.includes('<=')) return { $lte: parseInt(rangeString.substr(2)) }
    /**
     * Case Range
     */
    if (rangeString.includes('-')) {
        /**
         * First Amount Greater than second, invalid range
         */
        if (parseInt(rangeString.split('-')[0]) > parseInt(rangeString.split('-')[1])) return null;
        return [{ $gte: parseInt(rangeString.split('-')[0])}, { $lte: parseInt(rangeString.split('-')[1])}]
    }
    /**
     * Case Equal
     */
    return null;
}