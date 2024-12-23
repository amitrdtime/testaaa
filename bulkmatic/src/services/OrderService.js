import axios from "axios";
import Order from "../models/orderModel";

import BaseService from "./baseService";

class OrderService extends BaseService {
  constructor() {
    super();
    // set the base URL & API Key if required.
    this.isIntegrated = true; // Make it true when the integration will be in place.
  }

  async getOrder(orderId) {
    const order = new Order();
    let orderObj = [];
    try {
      // API object call.
      const url = this.ApiEndPoint + "/orders/" + orderId;
      const orderApiData = await axios.get(url);
      orderObj = order.parseApiOrderObject(orderApiData.data.data);
    } catch (err) {
      return Promise.reject(
        "There is a problem on retrieving Order data. Please try again!"
      );
    }

    return Promise.resolve(orderObj);
  }

  async getAllOrders(reload) {
    const order = new Order();
    let orderObj = [];
    try {
      // if (reload) {
      // API object call.
      const url = this.ApiEndPoint + "/orders";
      const orderApiData = await axios.get(url);
      orderObj = order.parseApiOrderObject(orderApiData.data.data);

      // Put the object into storage
      // localStorage.setItem('OrderListObject', JSON.stringify(orderObj));
      // }

      // Retrieve the object from storage
      // const retrievedOrderObject = localStorage.getItem('OrderListObject');
      // orderObj = JSON.parse(orderObj);
    } catch (err) {
      return Promise.reject(
        "There is a problem on retrieving Order data. Please try again!"
      );
    }

    return Promise.resolve(orderObj);
  }

//   ## -> This is a api for getting all orders by date.
  async getOrdersByDate(searchData) {
    const order = new Order();
    let orderObj = [];
    try {
      const  data = {
        orderDate: searchData.date,
        terminals: searchData.terminal
      }
      const url = this.ApiEndPoint + "/ordersbydate";
      const orderApiData = await axios.post(url, data);
      let withDotString = JSON.stringify(orderApiData.data.data)
      let withoutDotString = withDotString.replaceAll('.', '');
      let OrderTableObject = JSON.parse(withoutDotString);
      return Promise.resolve(OrderTableObject);
    } catch (err) {
      return Promise.reject(
        "There is a problem on retrieving Order data. Please try again!"
      );
    }
    
  }

  /// ordertab useing in planner board
  async getordertabinplanners(filterData) {
    const order = new Order();
    let orderObject = [];
    try {
      if (!this.isIntegrated) {
       
      } else {
         // API object call.
         let data = {
          date: filterData.date,
          terminal_id: filterData.terminal
        };
        // API object call.
        const url = this.ApiEndPoint + "/getorderstabdata";
        try {
          const orderApiData = await axios.post(url,data);
        
          orderObject = orderApiData.data.data
        } catch (error) {}
      }
    } catch (err) {
      return Promise.resolve(
        "There is a problem on retrieving trailer data. Please try again!"
      );
    }
  
    return await Promise.resolve(orderObject);
  }
  ///end

  async getAllOrderByFilter(filterObj, reload) {
    const order = new Order();
    let orderObj = [];
    try {
      // if (reload) {
      // API object call.
      const url = this.ApiEndPoint + "/plannerbydate";
      const orderApiData = await axios.post(url, filterObj);
      orderObj = order.parseApiOrderObject(orderApiData.data.data);

      // Put the object into storage
      // localStorage.setItem('OrderListObject', JSON.stringify(orderObj));
      // }

      // Retrieve the object from storage
      // const retrievedOrderObject = localStorage.getItem('OrderListObject');
      // orderObj = JSON.parse(orderObj);
    } catch (err) {
      return Promise.reject(
        "There is a problem on retrieving Order data. Please try again!"
      );
    }

    return Promise.resolve(orderObj);
  }
}

export default OrderService;
