export const price = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

export const hideErrorInProd = (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(message, ...args);
    }
}

export const plantName = (text) => {
    if (text.length > 21) {
        return text.substring(0, 21) + "..."
    } else {
        return text
    }
}
