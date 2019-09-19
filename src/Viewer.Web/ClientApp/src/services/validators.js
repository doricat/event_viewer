export const required = (value, name) => {
    if (value === "") {
        return {
            message: `${name}不能为空`,
            succeeded: false
        };
    }

    return {
        succeeded: true
    };
};

export const regexExpression = (value, pattern, name) => {
    const reg = new RegExp(pattern, "i")
    if (!reg.test(value)) {
        return {
            message: `${name}格式不正确`,
            succeeded: false
        };
    }

    return {
        succeeded: true
    };
};

export const stringLength = (value, min, max, name) => {
    if (typeof value !== "string") {
        throw new Error(`${value} 不是字符串类型`);
    }

    if (value.length < min || value.length > max) {
        return {
            message: `${name}的长度必须在${min}和${max}之间`,
            succeeded: false
        };
    }

    return {
        succeeded: true
    };
};

export const maxLength = (value, max, name) => {
    if (typeof value !== "string") {
        throw new Error(`${value} 不是字符串类型`);
    }

    if (value.length > max) {
        return {
            message: `${name}的长度必须小于${max}`,
            succeeded: false
        };
    }

    return {
        succeeded: true
    };
};

export const compare = (value, anotherName, valueObj, name, descriptor) => {
    if (value !== valueObj[anotherName]) {
        return {
            message: `${name}和${descriptor[anotherName].displayName}不匹配`,
            succeeded: false
        };
    }

    return {
        succeeded: true
    };
};

const copyMessages = (validationResult, target, ignoredProps) => {
    for (const key in validationResult) {
        if (validationResult.hasOwnProperty(key) && ignoredProps.findIndex(x => x === key) === -1) {
            const message = validationResult[key];
            target[key] = message;
        }
    }
};

export const validate = (model, descriptor) => {
    let validationResult = {
        hasError: false,
        copyMessages: (validationResult, target) => copyMessages(validationResult, target, ["hasError", "copyMessages"])
    };

    for (const key in model) {
        if (model.hasOwnProperty(key)) {
            const value = model[key];
            const validators = descriptor[key].validators;

            for (let i = 0; i < validators.length; i++) {
                const validator = validators[i];
                const result = validator(value, model);

                if (!result.succeeded) {
                    validationResult[key] = result.message;
                    validationResult.hasError = true;
                    break;
                }
            }
        }
    }

    return validationResult;
};