function LinkedGuides({ guides }) {
    return (
        <div>
            <h2>Linked Guides</h2>
            <div className="linkedGuidesContainer">
                {guides &&
                    guides.map((guide) => (
                        <div key={guide.id}>

                            <div className="listingGuideCoverContainer">
                                <img
                                    className="listingGuideCover"
                                    src={guide.GuideImages[0].url} />
                                <div className="linkedGuideHeader">
                                    <h3>{guide.title}</h3>
                                    <div>by {guide.User?.username}</div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default LinkedGuides
