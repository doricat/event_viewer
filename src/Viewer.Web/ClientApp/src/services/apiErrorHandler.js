export const copyApiErrorToLocal = (apiError, localErrors) => {
    const details = apiError.error.details;

    if (details && Array.isArray(details)) {
        for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            if (detail.target && localErrors.hasOwnProperty(detail.target)) {
                localErrors[detail.target] = detail.message;
            }
        }
    }

    return localErrors;
};