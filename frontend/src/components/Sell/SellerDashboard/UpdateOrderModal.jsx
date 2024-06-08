import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { editOrder } from "../../../store/sell";
import { useState } from "react";

function UpdateOrderModal({ orderId, orderStatus }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [status, setStatus] = useState(orderStatus)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const order = {
            status
        }

        try {
            await dispatch(editOrder(orderId, order))
            closeModal();
        } catch (error) {
            console.error('Error updating order status:', error)
        }
    }
    return (
        <section className="modal deleteModal">
            <h1>Update Order Status for Order #{orderId}</h1>
            <div>Current Status: {orderStatus}</div>
            <>
                <div>New Status:
                    <form onSubmit={handleSubmit}>
                        <div className="radio">
                            <input type="radio"
                                value="confirmed"
                                name="status"
                                onClick={() => setStatus("confirmed")}
                            /><span>Confirmed</span>
                        </div>
                        <div className="radio">
                            <input type="radio"
                                value="shipped"
                                name="status"
                                onClick={() => setStatus("shipped")}
                            /><span>Shipped</span>
                        </div>

                    </form>
                </div>
                <button
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </>
        </section>
    )
}

export default UpdateOrderModal
