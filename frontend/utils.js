export const isNull = (value) => {
    if (typeof value === 'string') {
        return !value.trim();
    } else {
        return !value;
    }
}
