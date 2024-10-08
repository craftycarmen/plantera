// export const stars = (num) => {
//     let filledStars = [];
//     let unfilledStars = [];

//     for (let i = 0; i < parseInt(num); i++) {
//         filledStars.push(<span className="full-star">&#9733;</span>)
//     }

//     let remainingStars = 5 - num;
//     let remainder = num - parseInt(num)

//     if (remainder > 0.3 && remainder < 0.79) {
//         unfilledStars.push(<span className="half-star">&#9734;</span>)
//     } else if (remainder > 0.79) {
//         filledStars.push(<span className="full-star">&#9733;</span>)
//     }

//     if (unfilledStars.length === 0) {
//         for (let i = 0; i < (5 - filledStars.length); i++) {
//             unfilledStars.push(<span className="empty-star">&#9734;</span>)
//         }
//     } else {
//         for (let i = 0; i < parseInt(remainingStars); i++) {
//             unfilledStars.push(<span className="empty-star">&#9734;</span>)
//         }
//     }

//     // for (let i = 0; i < parseInt(remainingStars); i++) {
//     //     unfilledStars.push(<span className="stars">&#9734;</span>)
//     // }

//     return [filledStars, unfilledStars]
// }


export const stars = (num, listingId) => {
    let filledStars = [];
    let unfilledStars = [];

    // Add full stars
    for (let i = 0; i < Math.floor(num); i++) {
        filledStars.push(<span className="full-star" key={`full-${listingId}-${i}`}>&#9733;</span>);
    }

    // Check for half star
    let remainder = num - Math.floor(num);
    if (remainder >= 0.26 && remainder <= 0.74) {
        filledStars.push(<span className="half-star" key={`half-${listingId}`}>&#9734;</span>);
    } else if (remainder >= 0.75) {
        filledStars.push(<span className="full-star" key={`full-${listingId}-${filledStars.length}`}>&#9733;</span>);
    }

    // Add empty stars
    let totalStars = filledStars.length;
    for (let i = totalStars; i < 5; i++) {
        unfilledStars.push(<span className="empty-star" key={`empty-${listingId}-${i}`}>&#9734;</span>);
    }

    return (
        <span className="stars">
            {filledStars}
            {unfilledStars}
        </span>
    );
};
