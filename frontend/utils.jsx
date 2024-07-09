export const stars = (num) => {
    let filledStars = [];
    let unfilledStars = [];

    for (let i = 0; i < parseInt(num); i++) {
        filledStars.push(<span className="stars">&#9733;</span>)
    }

    let remainingStars = 5 - num;
    let remainder = num - parseInt(num)

    if (remainder > 0.3 && remainder < 0.79) {
        unfilledStars.push(<span className="stars">&#9734;</span>)
    } else if (remainder > 0.79) {
        filledStars.push(<span className="stars">x</span>)
    }

    if (unfilledStars.length === 0) {
        for (let i = 0; i < (5 - filledStars.length); i++) {
            unfilledStars.push(<span className="stars">&#9734;</span>)
        }
    } else {
        for (let i = 0; i < parseInt(remainingStars); i++) {
            unfilledStars.push(<span className="stars">&#9734;</span>)
        }
    }

    // for (let i = 0; i < parseInt(remainingStars); i++) {
    //     unfilledStars.push(<span className="stars">&#9734;</span>)
    // }

    return [filledStars, unfilledStars]
}
