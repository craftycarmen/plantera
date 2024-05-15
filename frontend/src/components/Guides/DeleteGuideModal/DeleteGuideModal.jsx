import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { removeGuide } from "../../../store/guides";

function DeleteGuideModal({ guideId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const yes = async () => {
        try {
            await dispatch(removeGuide(guideId))
            closeModal()
        } catch (error) {
            console.error("Error deleting guide:", error)
        }
    }

    return (
        <section className="modal">
            <h1>Confirm Delete</h1>
            <>
                <p>Are you sure you want to delete this guide?</p>
                <span><button
                    id="yes"
                    onClick={yes}
                    style={{ width: "190px" }}
                >
                    Delete Guide
                </button>&nbsp;
                    <button
                        id="no"
                        onClick={closeModal}
                        style={{ width: "190px" }}
                    >
                        Cancel
                    </button></span>
            </>
        </section>
    )
}

export default DeleteGuideModal
