import GuideForm from "./GuideForm";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchOneGuide } from "../../../store/guides";

function UpdateGuide() {
    const { guideId } = useParams();
    const guide = useSelector(state => state.guides[guideId]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchOneGuide(guideId))
    }, [dispatch, guideId]);

    if (!guide) return (<>No guides found</>)

    return (
        Object.keys(guide).length > 1 && (
            <GuideForm
                guide={guide}
                formType="Update Guide"
            />
        )
    )
}

export default UpdateGuide;
