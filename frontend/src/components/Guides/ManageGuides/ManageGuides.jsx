import { useDispatch, useSelector } from 'react-redux';
import './ManageGuides.css';
import { useEffect } from 'react';
import { fetchOwnedGuides } from '../../../store/guides';
import ErrorHandling from '../../ErrorHandling';
import { Link } from 'react-router-dom';
import OpenModalButton from '../../OpenModalButton';

function ManageGuides() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const userId = sessionUser?.id;
    const guides = Object.values(useSelector(state => state.guides)).filter(guide => guide.userId === userId);
    console.log(guides);

    useEffect(() => {
        dispatch(fetchOwnedGuides())
    }, [dispatch])

    return (
        <>
            <h1>Manage Guides</h1>
            {!sessionUser ? (
                <ErrorHandling />
            ) : (guides &&
                <>
                    <div className='currentGuides'>
                        <Link to={`/guides/new`}><button style={{ width: "fit-content" }}>Create New Guide</button></Link>
                    </div>
                    <div className="guidesContainer">
                        {guides.map((guide) => (
                            <div key={guide.id}>
                                <Link to={`/guides/${guide.id}`}>
                                    <div className="ownedGuideImageContainer">
                                        <img
                                            className="ownedGuideImage"
                                            src={guide.GuideImages?.[0]?.url} />
                                        <div className="guideInfo">
                                            <h2>{guide.title}</h2>
                                        </div>
                                    </div>
                                </Link>
                                <div className='guideButtons'>
                                    <Link to={`/guides/${guide.id}/edit`}><button>Edit</button></Link>
                                    <OpenModalButton
                                        buttonText="Delete"
                                    // modalComponent={<DeleteGuideModal guideId={guide.id}}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default ManageGuides
