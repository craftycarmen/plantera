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
    if (text?.length > 25) {
        return text?.substring(0, 25) + "..."
    } else {
        return text
    }
}

export const listingName = (text) => {
    if (text?.length > 21) {
        return text?.substring(0, 21) + "..."
    } else {
        return text
    }
}

export const titleCase = (string) => {
    return string?.replace(
        /\w\S*/g,
        function (txt) {
            return txt?.charAt(0).toUpperCase() + txt?.substr(1).toLowerCase();
        }
    );
}

export const upperCaseFirst = (string) => {
    return string?.charAt(0).toUpperCase() + string?.substr(1)
}

export const monthYear = (date) => {
    const newDate = new Date(date)
    return newDate.toLocaleString('default', { month: 'long', year: 'numeric' })
}

export const monthDayYear = (date) => {
    const newDate = new Date(date)
    return newDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })
}
