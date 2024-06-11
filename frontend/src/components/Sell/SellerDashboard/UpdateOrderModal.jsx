import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { editOrder, fetchOwnedShopOrders } from "../../../store/sell";
import { useState } from "react";
import './SellerDashboard.css';

function UpdateOrderModal({ orderId, itemId, status, name }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [orderStatus, setOrderStatus] = useState(status)

    console.log(orderId, itemId, status, name);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await dispatch(editOrder(orderId, itemId, orderStatus));
            if (result.errors) {
                console.error('Error updating order item status:', result.errors);
            } else {
                await dispatch(fetchOwnedShopOrders());
                closeModal();
            }
        } catch (error) {
            console.error('Error updating order item status:', error);
        }
    };

    return (
        <section className="modal orderModal">
            <h1 style={{ textAlign: "center" }}>Update Order Item Status</h1>
            <h2>Order #{orderId} - {name}</h2>
            <div style={{ marginTop: "10px" }}>Current Status: {status}</div>
            <div style={{ marginTop: "15px" }}>New Status:</div>
            <form onSubmit={handleSubmit}>
                <div className="orderStatusOptions">
                    <div className="radio">
                        <input type="radio"
                            value="Processing"
                            name="status"
                            defaultChecked={orderStatus === "Processing"}
                            onClick={() => setOrderStatus("Processing")}
                        /><span>Processing</span>
                    </div>
                    <div className="radio">
                        <input type="radio"
                            value="Shipped"
                            name="status"
                            defaultChecked={orderStatus === "Shipped"}
                            onClick={() => setOrderStatus("Shipped")}
                        /><span>Shipped</span>
                    </div>
                </div>
                <span className="deleteButtons" style={{ marginTop: "20px" }}><button onSubmit={handleSubmit}>Update Order Status</button>
                    <button
                        onClick={closeModal}
                    >
                        Cancel
                    </button></span>
            </form>

        </section>
    )
}

export default UpdateOrderModal
