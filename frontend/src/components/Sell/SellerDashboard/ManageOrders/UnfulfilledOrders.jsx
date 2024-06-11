import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ErrorHandling from "../../../ErrorHandling";
import Menu from "../Menu";
import { fetchOwnedShopOrders } from "../../../../store/sell";
import { price } from "../../../../../utils";
import { Link } from "react-router-dom";
import UpdateOrderModal from "../UpdateOrderModal";
import OpenModalMenuItem from "../../../Navigation/OpenModalMenuItem";
import './ManageOrders.css';

function UnfulfilledOrders({ unfulfilled, shopOrders, dateFormat }) {
    return (
        <>
            {
                shopOrders && (
                    <div className="manageListingsSection">
                        {shopOrders.length === 0 ? (
                            <div>No orders yet!</div>
                        ) : (
                            <div className="unfulfilledFulfilled">
                                <div>
                                    {unfulfilled && unfulfilled.length === 0 ? (
                                        <div>No unfulfilled orders!</div>
                                    ) : (
                                        <div>
                                            <div style={{ paddingBottom: "20px" }}>Please fulfill all orders within 3 business days from order date.</div>
                                            {unfulfilled.map(order => {
                                                let orderTotalEarnings = 0;
                                                let orderTotalItems = 0;
                                                order?.CartItems?.forEach(item => {
                                                    orderTotalEarnings += item.cartQty * item?.Listing?.price;
                                                    orderTotalItems += item?.cartQty;
                                                });
                                                return (
                                                    <div key={order.id} className="manageOrdersSection">
                                                        <h4>Order #{order.id}</h4>
                                                        <div className="orderInfo">
                                                            <div>
                                                                <div>Order Date: {order.createdAt && dateFormat(order.createdAt)}</div>
                                                            </div>
                                                            <div className="shipTo">
                                                                <div>Ship to:</div>
                                                                <div>
                                                                    <div>{order.firstName} {order.lastName}</div>
                                                                    <div>{order.address}</div>
                                                                    <div>{order.city}, {order.state} {order.zipCode}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="items">
                                                            <table>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Item</th>
                                                                        <th>Qty</th>
                                                                        <th>Price</th>
                                                                        <th>Order Item Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {order.CartItems?.map(item => (
                                                                        <tr key={item.Listing?.id}>
                                                                            <td><Link to={`/listings/${item.Listing?.id}`} target="_blank" rel="noopener noreferrer">{item.Listing?.plantName}</Link> ({price(item.Listing?.price)}/ea)</td>
                                                                            <td>{item.cartQty}</td>
                                                                            <td>
                                                                                <div>{price(item.cartQty * item.Listing?.price)}</div>
                                                                            </td>
                                                                            <td><OpenModalMenuItem
                                                                                itemText={<span>{item.orderStatus} <i className="fa-solid fa-pen" /></span>}
                                                                                modalComponent={<UpdateOrderModal orderId={order.id} status={item.orderStatus} name={item.Listing?.plantName} itemId={item.id} />} /></td>
                                                                        </tr>
                                                                    ))}
                                                                    <tr>
                                                                        <td>Total</td>
                                                                        <td>{orderTotalItems}</td>
                                                                        <td>{price(orderTotalEarnings)}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                        )}
                    </div>
                )}
        </>
    );
}

export default UnfulfilledOrders;
