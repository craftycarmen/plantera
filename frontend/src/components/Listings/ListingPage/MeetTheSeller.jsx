function MeetTheSeller({ sellerInfo }) {
    const memberSince = (createdAt) => {
        const newDate = new Date(createdAt)
        return newDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    }
    return (sellerInfo &&
        <div className="meetTheSeller">
            <h2>Meet {sellerInfo.username}</h2>
            <div className="meetTheSellerContainer">
                <div>{sellerInfo.UserImages && sellerInfo.UserImages[0].avatar === true && (
                    <>
                        <div className="sellerImageContainer">
                            <img className="sellerImage"
                                src={sellerInfo.UserImages[0].url} />
                        </div>
                    </>
                )}
                </div>
                <div>
                    <div>
                        <span style={{ fontWeight: "800" }}>Location:</span>
                        <div>San Francisco, CA ***</div>
                    </div>
                    <div>
                        <span style={{ fontWeight: "800" }}>Member Since:</span>
                        <div>{sellerInfo.createdAt && memberSince(sellerInfo.createdAt)}</div>
                    </div>
                    <p>{sellerInfo.shopDescription}</p>
                </div>
            </div>
        </div>
    )
}

export default MeetTheSeller
