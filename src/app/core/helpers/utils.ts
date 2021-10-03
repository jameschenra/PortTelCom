import { expand } from 'rxjs/operators';

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // tslint:disable-next-line:no-bitwise
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
        return v.toString(16);
    });
}

export function getDecimal(value): any {
    const decimal = (value + '').split('.');
    if (decimal.length > 1) {
        return decimal[1];
    } else {
        return '00';
    }
}

export function getInteger(value): any {
    return Math.floor(value);
}

export function genExpandArgs(expands): string {
    let expandArg = '';
    if (expands) {
        expandArg = '?expand=';
        for (let i = 0; i < expands.length; i++) {
            if (i !== 0) {
                expandArg += ',';
            }
            expandArg += expands[i];
        }
    }

    return expandArg;
}
