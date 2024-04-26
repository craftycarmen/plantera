// export const price = (price) => {
//     return price.toFixed(2).toLocaleString('en-US', { maximumFractionDigits: 2 })
// }


export const price = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};
