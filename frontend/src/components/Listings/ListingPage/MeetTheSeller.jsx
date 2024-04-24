import { Link } from "react-router-dom"

function MeetTheSeller({ sellerInfo }) {
    const memberSince = (createdAt) => {
        const newDate = new Date(createdAt)
        return newDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    }
    return (sellerInfo &&
        <div className="meetTheSeller">
            <h2>Meet {sellerInfo.username}</h2>
            <div className="meetTheSellerContainer">
                <div>{sellerInfo.UserImages?.[0]?.avatar === true && (
                    <>
                        <div className="sellerImageContainer">
                            <Link to={`/user/${sellerInfo.id}`}><img className="sellerImage"
                                src={sellerInfo.UserImages[0].url} />
                                <div className="sellerImage-outline"></div></Link>
                        </div>
                    </>
                )}
                </div>
                <div className="listingsPageShop">
                    <div>
                        <span style={{ fontWeight: "800" }}>Location:</span>
                        <div>{sellerInfo.city}, {sellerInfo.state}</div>
                    </div>
                    <div>
                        <span style={{ fontWeight: "800" }}>Member Since:</span>
                        <div>{sellerInfo.createdAt && memberSince(sellerInfo.createdAt)}</div>
                    </div>
                    <div>
                        <span style={{ fontWeight: "800" }}>Shop Description:</span>
                        <div>{sellerInfo.shopDescription}</div>
                    </div>
                    {/* <div><Link to={`/user/${sellerInfo.id}`}>View Profile</Link></div> */}
                </div>
            </div>
        </div>
    )
}

export default MeetTheSeller
