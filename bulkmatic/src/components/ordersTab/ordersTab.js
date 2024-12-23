import React, { useEffect, useState } from "react";
import OrderService from "../../services/OrderService";
import OrdersTable from "../ordersTable/ordersTable";

const OrdersTab = ({ orderDate, startdate }) => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    let subscribe = true;
    const getOrders = async () => {
      const orderService = new OrderService();
      try {
        if (orderDate) {
          const orders = await orderService.getOrdersByDate(orderDate);
          if (subscribe) {
            setAllOrders(orders);
          }
        } else {
          const orders = await orderService.getOrdersByDate(startdate);
          if (subscribe) {
            setAllOrders(orders);
          }
        }
      } catch (error) {
        
      }
    };
    getOrders();
    return () => {
      subscribe = false;
    };
  }, []);

  return (
    <div>
      <OrdersTable allOrdersArray={allOrders} />
    </div>
  );
};

export default OrdersTab;
