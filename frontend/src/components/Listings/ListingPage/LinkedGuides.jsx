import { Link } from "react-router-dom"


function LinkedGuides({ guides }) {
    return (guides && guides.length >= 1 &&
        <div className="linkedGuides">
            <h2>Get Inspired</h2>
            <div>Check out these guides hand-selected by the seller for this listing!</div>
            <div className="linkedGuidesContainer">
                {guides.map((guide) => (
                    <div key={guide.id}>
                        <Link to={`/guides/${guide.id}`}>
                            <div className="listingGuideCoverContainer">
                                {guide.GuideImages && guide.GuideImages[0] &&
                                    <img
                                        className="listingGuideCover"
                                        src={guide.GuideImages?.[0]?.url} />
                                }
                                <div className="linkedGuideHeader">
                                    <h3>{guide.title}</h3>
                                    <div>by {guide.Author?.username}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default LinkedGuides
