export const stars = (num) => {
    let filledStars = [];
    let unfilledStars = [];

    for (let i = 0; i < parseInt(num); i++) {
        filledStars.push(<span className="stars">&#9733;</span>)
    }

    let remainingStars = 5 - num;

    for (let i = 0; i < parseInt(remainingStars); i++) {
        unfilledStars.push(<span className="stars">&#9734;</span>)
    }

    return [filledStars, unfilledStars]
}
