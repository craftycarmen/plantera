function MeetTheSeller({ sellerInfo }) {
    return (
        <>
            <h1>Meet The Seller</h1>
            <div>{sellerInfo.username}</div>
            <div>{sellerInfo.UserImages && sellerInfo.UserImages[0].avatar === true && (
                <img src={sellerInfo.UserImages[0].url} />)}
            </div>
        </>
    )
}

export default MeetTheSeller
