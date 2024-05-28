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
        <section className="modal deleteModal">
            <h1>Confirm Delete</h1>
            <>
                <p>Are you sure you want to delete this guide?</p>
                <span className="deleteButtons"><button
                    id="yes"
                    onClick={yes}
                >
                    Delete Guide
                </button>
                    <button
                        id="no"
                        onClick={closeModal}
                    >
                        Cancel
                    </button></span>
            </>
        </section>
    )
}

export default DeleteGuideModal
