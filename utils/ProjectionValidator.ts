export function isValidProjection(object: any, allowedKeys: string[]) {
    let zC = 0, oC = 0;
    for (const k in object) {
        if (k != '_id') {
            if (!allowedKeys.some(keys => keys === k)) { return false; }
            switch(object[k]) {
                case 1:
                    oC+=1;
                    break;
                case 0:
                    zC+=1;
                    break;
            }
        }
    }
    return ((zC === 0 && oC > 0) || (zC > 0 && oC === 0))
}