import { isString, isNumber, isEqual } from 'lodash';

export function createRequired() {
    return function (value: any, displayName: string): string | undefined {
        if ((value === undefined || value === null)
            || (isString(value) && (value as string).length === 0)) {
            return `${displayName}不能为空`;
        }

        return undefined;
    }
}

export function createRegularExpression(pattern: string, message?: string) {
    return function (value: any, displayName: string): string | undefined {
        if ((value === undefined || value === null) || (isString(value) && !new RegExp(pattern).test(value as string))) {
            return message !== undefined ? message : `${displayName}不满足约束`;
        }

        return undefined;
    }
}

export function createMinLength(length: number) {
    return function (value: any, displayName: string): string | undefined {
        if ((value === undefined || value === null) || (isString(value) && (value as string).length < length)) {
            return `${displayName}不能少于${length}个字符`;
        }

        return undefined;
    }
}

export function createMaxLength(length: number) {
    return function (value: any, displayName: string): string | undefined {
        if (value === undefined || value === null) {
            return undefined;
        }

        if (isString(value) && (value as string).length >= length) {
            return `${displayName}不能大于${length}个字符`;
        }

        return undefined;
    }
}

export function createRange(min: number, max: number) {
    return function (value: any, displayName: string): string | undefined {
        if (!isNumber(value)) {
            return `${displayName}不是一个数字`;
        }

        const num = value as number;
        if (num <= min || num > max) {
            return `${displayName}必须在${min}和${max}之间`;
        }

        return undefined;
    }
}

export function createCompare(getOther: () => {name: string, value: any}) {
    return function (value: any, displayName: string): string | undefined {
        const other = getOther();
        if (!isEqual(value, other.value)) {
            return `${displayName}和${other.name}不匹配`;
        }
        
        return undefined;
    }
}
