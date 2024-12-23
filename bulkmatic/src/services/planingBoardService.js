import axios from "axios";
import { DateTime } from 'luxon'
import * as fflate from 'fflate';

// Application Specific
import PlanningBoard from "../models/planningBoardModel";
import BaseService from "./baseService";
class PlanningBoardService extends BaseService {
  constructor() {
    super();
    // set the base URL & API Key if required.
    this.isIntegrated = true; // Make it true when the integration will be in place.
  }

  groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, {});
  }
  async getPlanningBoardData(searchData) {
    const planningBoard = new PlanningBoard();
    let planningDecompressedObject;
    // let planningObjByDriver = {};
    try {
      let data = {}
      // if (reload) {
      if (searchData.view === "carrier") {
        data = {
          date: new Date(searchData.date).getTime().toString(),
          // search: searchData.search === undefined ? "" : searchData.search,
        }
      }
      else {
        data = {
          date: new Date(searchData.date).getTime().toString(),
          cgs: searchData.cgs === undefined ? [] : searchData.cgs,
          terminals: searchData.terminal === undefined ? [] : searchData.terminal,
          search: searchData.search === undefined ? "" : searchData.search,
          // plannerterminals: searchData.userplanners,
        }
      }
      const url = this.ApiEndPoint + "/planningboard";
      // const planningApiData = await axios.post(url, data);

      const planningApiResponse = await axios.post(url, data);
      const planningApiData = await planningApiResponse.data;
      
      //locationApiData = zlib.inflateSync(Buffer.from(locationApiData.data, 'base64')).toString();
      const strData = atob(planningApiData);
      // Convert binary string to character-number array
      const charData = strData.split("").map((x) => { return x.charCodeAt(0); });
      // Turn number array into byte-array
      const binData = new Uint8Array(charData);
      // Use this Code to Decode the String

      //Uncompress API Call//
      let planningApiDataUnCompressed = fflate.unzlibSync(binData);
      let planningApiDataUnCompressedString = fflate.strFromU8(planningApiDataUnCompressed)
      planningDecompressedObject = JSON.parse(planningApiDataUnCompressedString)
    } catch (err) {
      throw err;
    }
    return planningDecompressedObject;
  }

  async getBoardByDriverFormatted(planningBoardData, searchData) {
    const planningBoard = new PlanningBoard();
    let planningObj = [];
    let planners = [];
    try {
      let filteredPlanningArray = [];
      if (planningBoardData?.data.length > 0) {
        filteredPlanningArray = planningBoardData?.data?.filter(order => order.movement.brokerage == 'N')
      }
      let planningObjByDriver = filteredPlanningArray.reduce((r, a) => {
        r[a.movement.driver.driver_id] = [...(r[a.movement.driver.driver_id] || []), a];
        //  
        return r;
      }, {});
      planningObj = planningBoardData.data.map((it) =>
        planningBoard.parseApiPlanningBoardObject(it)
      );
      if (planningObj === null) return planners;

      for (
        let loop = 0;
        loop < Object.keys(planningObjByDriver).length;
        loop++
      ) {
        const block = {};
        block.driverId = Object.keys(planningObjByDriver)[loop];
       // block.terminal_id = planningObjByDriver[block.driverId][0]?.movement.driver.terminal_id
        block.driver_full_name = planningObjByDriver[block.driverId][0]
        block.samsara_id = planningObjByDriver[block.driverId][0]?.movement.driver.samsara_id
        block.driver_type_class = planningObjByDriver[block.driverId][0]?.movement.driver.driver_type_class
        block.hire_date = planningObjByDriver[block.driverId][0]?.movement.driver.hire_date
        block.driver_full_name=planningObjByDriver[block.driverId][0]?.movement.driver.driver_full_name
        block.terminal_id = planningObjByDriver[block.driverId][0]?.movement.driver.terminal.terminal_id
        block.terminal_city = planningObjByDriver[block.driverId][0]?.movement.driver.terminal.city 
        block.utilization = planningObjByDriver[block.driverId][0]?.movement?.driver?.bpadriverutilization?.utilization

        const data = this.DriverViewBlocksInMinutes(
          planningObjByDriver[block.driverId],
          new Date(searchData.date)
        );
        block.planner = data;
        // 
        planners.push(block);
      }
    } catch (err) {
      return "";
    }
    return planners;
  }

  async getBoardByTrailerFormatted(planningBoardData, searchData) {
    const planningBoard = new PlanningBoard();
    let planningObj = [];
    let planners = [];
    try {

      let planningObjByTrailer = planningBoardData.data.reduce((r, a) => {
        r[a.movement.trailer_id] = [...(r[a.movement.trailer_id] || []), a];
        return r;
      }, {});
      planningObj = planningBoardData.data.map((it) =>
        planningBoard.parseApiPlanningBoardObject(it)
      );
      if (planningObj === null) return planners;

      for (
        let loop = 0;
        loop < Object.keys(planningObjByTrailer).length;
        loop++
      ) {
        const block = {};
        block.trailerId = Object.keys(planningObjByTrailer)[loop];
        block.type = planningObjByTrailer[block.trailerId][0]?.movement.trailer.equip_type;
        block.terminal = planningObjByTrailer[block.trailerId][0]?.movement.terminal_id;
        block.terminal_city = planningObjByTrailer[block.trailerId][0]?.movement.pickup.location.city;
        block.license_plate = planningObjByTrailer[block.trailerId][0]?.movement.trailer.license_plate;
        block.year = planningObjByTrailer[block.trailerId][0]?.movement.trailer.model_year;
        block.state = planningObjByTrailer[block.trailerId][0]?.movement.trailer.license_state;
        block.make = planningObjByTrailer[block.trailerId][0]?.movement.trailer.make;
        block.model = planningObjByTrailer[block.trailerId][0]?.movement.trailer.model;
        block.shipper_pool = planningObjByTrailer[block.trailerId][0]?.movement.pickup.location.code;
        block.dedicated = planningObjByTrailer[block.trailerId][0]?.movement.pickup.location.code;
        block.movement_status = planningObjByTrailer[block.trailerId][0]?.movement.status;
        block.tare_weight = planningObjByTrailer[block.trailerId][0]?.movement.trailer.tare_weight;
        block.pm_due_date_utc = planningObjByTrailer[block.trailerId][0]?.movement.trailer.pm_due_date_utc;
        const data = this.TrailerViewBlocksInMinutes(
          planningObjByTrailer[block.trailerId],
          new Date(searchData.date)
        );
        block.planner = data;
        planners.push(block);
      }
    } catch (err) {
      return Promise.reject(
        "There is a problem on retrieving planning board data. Please try again!"
      );
    }
    return Promise.resolve(planners);
  }

  async getBoardByCarrierFormatted(planningBoardData, searchData) {
    const planningBoard = new PlanningBoard();
    let planningObj = [];
    let filteredPlanningArray = [];
    let planningObjByMovement;
    // let planningObjByDriver = {};
    let planners = [];
    try {
      // if (reload) {
      const data = {
        date: new Date(searchData.date).getTime().toString(),
        // terminals: searchData.userterminals,
        // plannerterminals: searchData.userplanners,
      };
      
      if (planningBoardData?.data.length > 0) {
        filteredPlanningArray = planningBoardData?.data?.filter(order => order.movement.brokerage == 'Y')
      }
      if (filteredPlanningArray?.length > 0) {
        planningObjByMovement = filteredPlanningArray.reduce((r, a) => {
          r[a.movement.load_id] = [...(r[a.movement.load_id] || []), a];
          return r;
        }, {});
    
        for (
          let loop = 0;
          loop < Object.keys(planningObjByMovement).length;
          loop++
        ) {
          const block = {};
          block.movementId = Object.keys(planningObjByMovement)[loop];
          const data = this.CarrierViewBlocksInMinutes(
            planningObjByMovement[block.movementId],
            new Date(searchData.date)
          );
          block.driverId = "Bulkmatic Solutions"
          block.planner = data;
          planners.push(block);
        }
      }
      
    } catch (err) {
      return "";
    }
    
    return planners;
  }

  DriverViewBlocksInMinutes(orders, planningDate) {
    let blockData = [];
    // { start: 0, length: 1, type: "", orderid: "", trailerid: "", driverid: "", hasOnTime: true, actionValue: ""}
    try {
      planningDate = new Date(
        planningDate.getFullYear(),
        planningDate.getMonth(),
        planningDate.getDate()
      );[]
      const planningTs = planningDate.getTime();
      const blocks = [];
      if (orders) {
        if (orders.length > 0) {
          if (orders[0].movement.driver.schedule) {
            if (orders[0].movement.driver.schedule.offduty) {
              for (
                let index = 0;
                index < orders[0].movement.driver.schedule.offduty.length;
                index++
              ) {
                let obj1 = {
                  start: 0,
                  drawStart: 0,
                  isBlock: 0,
                  PU: 0,
                  DEL: 0,
                  MV: 0,
                  OF: 0,
                  LEN: 0,
                  orderid: "",
                  trailerid: "",
                  driverid: "",
                  hasReachedOnTime: false,
                  has_pickup_on_time: false,
                  has_departed_on_time: false,
                  has_delivery_on_time: false,
                  has_unloaded_on_time: false,
                  pickup_type: "",
                  delivery_type: "",
                  move_type:""
                };

                try {
                  let startOffduty = new Date(orders[0].movement.driver.schedule.offduty[index].startTs)
                  let startOffdutyUtc = DateTime.fromJSDate(startOffduty).toMillis();
                  let startOffDutyTime = parseInt((startOffdutyUtc - planningTs) / 60000);
                  let endOffduty = new Date(orders[0].movement.driver.schedule.offduty[index].endTs)
                  let endOffdutyUtc = DateTime.fromJSDate(endOffduty).toMillis();
                  let offDutyDuration = parseInt(endOffdutyUtc - startOffdutyUtc);
                  let endOffDutyTime = parseInt(offDutyDuration / 60000)
                  obj1.OF = endOffDutyTime;
                  obj1.LEN = endOffDutyTime;
                  obj1.isBlock = 1;
                  obj1.start = startOffDutyTime;
                  obj1.drawStart = startOffDutyTime
                  blocks.push(obj1);
                }
                catch (error) {

                }
              }
            }
          }

        }
      }
      for (let loop = 0; loop < orders.length; loop++) {
        let order = orders[loop];
       
        let pickup_type, delivery_type;
        let pickup_eta_utc = order.movement.pickup.eta_utc;
        let delivery_eta_utc = order.movement.delivery.eta_utc;
        let pickup_status, delivery_status, has_delivery_on_time, has_unloaded_on_time;
        let move_type, zmitStatus;
        let pickup_planned_depart = order.movement.pickup.planned_depart_utc;
        let pickup_planned_arrive = order.movement.pickup.planned_arrive_utc;
        let pickup_timezone = order.movement.pickup.pickup_timezone;
        let pickup_actual_depart = order.movement.pickup.actual_departure_utc;
        let pickup_actual_arrive = order.movement.pickup.actual_arrival_utc;
        let delivery_timezone = order.movement.delivery.delivery_timezone;
        let delivery_planned_arrive = order.movement.delivery.planned_arrive_utc;
        let delivery_planned_depart = order.movement.delivery.planned_depart_utc;
        let delivery_actual_depart = order.movement.delivery.actual_departure_utc;
        let delivery_actual_arrive = order.movement.delivery.actual_arrival_utc;
        let pickup_sched_arrive_early_utc = order.movement.pickup.sched_arrive_early_utc;
        let pickup_sched_arrive_late_utc = order.movement.pickup.sched_arrive_late_utc;
        let delivery_sched_arrive_early_utc = order.movement.delivery.sched_arrive_early_utc;
        let delivery_sched_arrive_late_utc = order.movement.delivery.sched_arrive_late_utc;
        let distance = order.movement.distance;
        let brokerage = order.movement.brokerage;
        let movement_type = order.movement.movement_type;
        let movement_status =  order.movement.status;
        let stop_pickup__type = order.movement.pickup.type
        let stop_delivery_type = order.movement.delivery.type
        let company_location_id = order.movement.pickup.location.company_location_id
        let location_name = order.movement.pickup.location.location_name
        let address1 = order.movement.pickup.location.address1
        let city = order.movement.pickup.location.city
        let state = order.movement.pickup.location.state
        let zip = order.movement.pickup.location.zip
        let move_id = order.movement.load_id
        let company_location_id1 = order.movement.delivery.location.company_location_id
        let location_name1 = order.movement.delivery.location.location_name
        let address11 = order.movement.delivery.location.address1
        let city1 = order.movement.delivery.location.city
        let state1 = order.movement.delivery.location.state
        let zip1 = order.movement.delivery.location.zip
        let order_status=order.status
        let bol_received=order.bol_received
        let customer_name=order.customer_name
        let consignee_refno=order.consignee_refno
        let ordered_wt=order.ordered_wt
        let on_hold =order.on_hold
        let delivery_driver_load_unload=order.movement.delivery.driver_load_unload
        let pickup_driver_load_unload=order.movement.pickup.driver_load_unload
        let pickup_appt_required=order.movement.pickup.appt_required
        let picup_confirmed = order.movement.pickup.confirmed
       
       
        if (order.movement?.pickup?.type === "pickup") {
          pickup_type = "PU"
        }
        else if (order.movement?.pickup?.type === "split pickup") {
          pickup_type = "SP"
        }
        if (order.movement?.delivery?.type === "delivery") {
          delivery_type = "DEL"
        }
        if (order.movement?.delivery?.type === "split delivery") {
          delivery_type = "SD"
        }
        // color coding for pickup block
        if (pickup_eta_utc > order.movement.pickup.sched_arrive_late_utc) {
          pickup_status = "red"
        }
        else if ((pickup_eta_utc > pickup_planned_arrive) && (
          pickup_eta_utc <= order.movement.pickup.sched_arrive_late_utc)) {
          pickup_status = "yellow"
        }
        else if (pickup_eta_utc <= pickup_planned_arrive) {
          pickup_status = "green"
        }

        // color coding for delivery block
        if (delivery_eta_utc > order.movement.delivery.sched_arrive_late_utc) {
          delivery_status = "red"
        }
        else if ((delivery_eta_utc > delivery_planned_arrive) && (
          delivery_eta_utc <= order.movement.delivery.sched_arrive_late_utc)) {
          delivery_status = "yellow"
        }
        else if (delivery_eta_utc <= delivery_planned_arrive) {
          delivery_status = "green"
        }
        if (order.movement.xmit_accepted == "Y") {
          zmitStatus = "green"
        }
        else if (order.movement.xmitted2driver != null) {
          if ((order.movement.xmit_accepted == 'N') || (order.movement.xmit_accepted == null)) {
            zmitStatus = "orange"
          }
        }
        else {
          zmitStatus = "white"
        }

        //Movetype logic. Handles returns, redeliveries, load, empty
        if (order.movement.is_return) {
          move_type = "R"
        }
        else if (order.movement.is_redelivery) {
          move_type = "RD"
        }
        else if (order.movement.loaded) {
          move_type = "L"
        }
        else {
          move_type = "E"
        }

        let obj = {
          start: 0,
          drawStart: 0,
          isBlock: 0,
          PU: 0,
          DEL: 0,
          MV: 0,
          OF: 0,
          LEN: 0,
          orderid: order.lm_order_id,
          commodity: order.commodity,
          trailerid: order.movement.trailer_id,
          driverid: order.movement.driver.driver_id,
          hasReachedOnTime: false,
          has_pickup_on_time: (pickup_actual_depart <= pickup_actual_depart) ? true : false,
          pickup_status: pickup_status,
          delivery_status: delivery_status,
          zmitStatus: zmitStatus,
          has_departed_on_time: false,
          has_unloaded_on_time: false,
          has_delivery_on_time: (delivery_actual_arrive <= delivery_planned_arrive) ? true : false,
          pickup_type: pickup_type,
          delivery_type: delivery_type,
          loaded: order.movement.loaded,
          move_type: move_type,
          pickup_planned_arrive: pickup_planned_arrive,
          pickup_timezone : pickup_timezone,
          pickup_planned_depart: pickup_planned_depart,
          pickup_actual_arrive: pickup_actual_arrive,
          pickup_actual_depart: pickup_actual_depart,
          delivery_timezone : delivery_timezone,
          delivery_planned_arrive: delivery_planned_arrive,
          delivery_planned_depart: delivery_planned_depart,
          delivery_actual_arrive: delivery_actual_arrive,
          delivery_actual_depart: delivery_actual_depart,
          pickup_eta_utc: pickup_eta_utc,
          delivery_eta_utc: delivery_eta_utc,
          pickup_sched_arrive_early_utc: pickup_sched_arrive_early_utc,
          pickup_sched_arrive_late_utc: pickup_sched_arrive_late_utc,
          delivery_sched_arrive_early_utc: delivery_sched_arrive_early_utc,
          delivery_sched_arrive_late_utc: delivery_sched_arrive_late_utc,
          distance : distance,
          brokerage:brokerage,
          movement_type:movement_type,
          movement_status:movement_status,
          stop_pickup__type:stop_pickup__type,
          stop_delivery_type:stop_delivery_type,
          company_location_id :company_location_id,
          location_name : location_name,
          address1 : address1,
          city:city,
          state:state,
          zip:zip,
          move_id:move_id,
          company_location_id1 :company_location_id1,
          location_name1 : location_name1,
          address11 : address11,
          city1:city1,
          state1:state1,
          zip1:zip1,
          terminalId:order.movement.driver.terminal.terminal_id,
          terminal_city:order.movement.driver.terminal.city,
          commodity_Id:order.commodity_id,
          order_status:order_status,
          bol_received:bol_received,
          customer_name:customer_name,
          consignee_refno:consignee_refno,
          ordered_wt:ordered_wt,
          commoditygroupid:order.order_commodity.commoditygroupid,
          commoditygroup_description:order.order_commodity.description,
          on_hold:on_hold,
          commodity_id:order.order_commodity.commodity_id,
          delivery_driver_load_unload:delivery_driver_load_unload,
          pickup_driver_load_unload:pickup_driver_load_unload,
          pickup_appt_required:pickup_appt_required,
          picup_confirmed:picup_confirmed,
          commodity: order.commodity,          
          license_plates:order.movement.trailer.license_plate,
          equip_types:order.movement.trailer.equip_type,
          license_state:order.movement.trailer.license_state,
          makes:order.movement.trailer.make,
          models:order.movement.trailer.model,
          model_year:order.movement.trailer.model_year,
          tare_weights:order.movement.trailer.tare_weight,
          state:state,
          terminalId:order.movement.driver.terminal.terminal_id,
          terminal_city:order.movement.driver.terminal.city,
          shipper_pool : order.movement.pickup.location.code,
        dedicated :order.movement.pickup.location.code,
        pm_due_date_utc:order.movement.trailer.pm_due_date_utc,
        order_type_id: order.order_type_id,
        commodity_desc: order.commodity_desc,
        blnum: order.blnum
        };
       
        let nextStartTs = 0;
        const dispatch_ts = new Date(order.pickup_dispatch_ts);
        const dispatch_ts_utc = new Date(
          Date.UTC(
            dispatch_ts.getFullYear(),
            dispatch_ts.getMonth(),
            dispatch_ts.getDate(),
            dispatch_ts.getHours(),
            dispatch_ts.getMinutes(),
            dispatch_ts.getSeconds()
          )
        );

        // If block starts previous day
        if (pickup_planned_arrive < planningDate.getTime()) {
          let previousStartTs = DateTime.fromMillis(planningTs).minus({ days: 1 }).toMillis();
          let previousStart = parseInt((pickup_planned_arrive - previousStartTs) / 60000)
          let start_pk_ts = parseInt((pickup_planned_arrive - planningTs) / 60000);
          obj.isBlock = 1;
          obj.start = start_pk_ts;
          obj.drawStart = start_pk_ts;
          obj.PU = (pickup_planned_depart - pickup_planned_arrive) / 60000;
          obj.MV = (delivery_planned_arrive - pickup_planned_depart) / 60000;
          obj.DEL = (delivery_planned_depart - delivery_planned_arrive) / 60000;
          obj.LEN = obj.PU + obj.MV + obj.DEL;

          if ((previousStart + obj.LEN) > 1440) {
            obj.start = 0;
            obj.drawStart = 0;
            let new_DEL, new_MV, new_PU
            if ((previousStart + obj.PU) > 1440) {
              let previousPU = 1440 - (previousStart);
              new_PU = obj.PU - previousPU;
              new_MV = obj.MV;
              new_DEL = obj.DEL;
            }
            else if ((previousStart + obj.PU + obj.MV) > 1440) {
              let previous_MV = 1440 - (start_pk_ts + obj.PU);
              new_PU = 0;
              new_MV = obj.MV - previous_MV
              new_DEL = obj.DEL
            }
            else if ((previousStart + obj.PU + obj.MV + obj.DEL) > 1440) {
              new_PU = 0;
              new_MV = 0;
              let previous_DEL = 1440 - (start_pk_ts + obj.PU + obj.MV);
              new_DEL = obj.DEL - previous_DEL;
            }
            obj.PU = new_PU;
            obj.MV = new_MV;
            obj.DEL = new_DEL;
            obj.LEN = obj.PU + obj.MV + obj.DEL;
            blocks.push(obj);
          }
          let driver;
        } else {
          // In case the block starts in the same day and continue till next day

          let start_pk_ts = parseInt((pickup_planned_arrive - planningTs) / 60000);
          obj.isBlock = 1;
          obj.start = start_pk_ts;
          obj.drawStart = start_pk_ts;
          obj.PU = (pickup_planned_depart - pickup_planned_arrive) / 60000;
          obj.MV = (delivery_planned_arrive - pickup_planned_depart) / 60000;
          obj.DEL = (delivery_planned_depart - delivery_planned_arrive) / 60000;
          obj.LEN = obj.PU + obj.MV + obj.DEL;

          if ((start_pk_ts + obj.LEN) > 1440) {
            if ((start_pk_ts + obj.PU) > 1440) {
              obj.PU = 1440 - start_pk_ts;
              obj.MV = 0;
              obj.DEL = 0;
              obj.LEN = 1440 - start_pk_ts;
              obj.start = 0;
            }
            else if ((start_pk_ts + obj.PU + obj.MV) > 1440) {
              obj.MV = 1440 - (start_pk_ts + obj.PU);
              obj.DEL = 0;
              obj.LEN = 1440 - start_pk_ts;
            }
            else if ((start_pk_ts + obj.PU + obj.MV + obj.DEL) > 1440) {
              obj.DEL = 1440 - (start_pk_ts + obj.PU + obj.MV);
              obj.LEN = 1440 - start_pk_ts;
            }
          }
          let driver;
          blocks.push(obj);
        }
      }
      blockData = blocks;

      // 
    } catch (err) {
    }

    return blockData;
  }
  TrailerViewBlocksInMinutes(orders, planningDate) {
    let blockData = [];
    // { start: 0, length: 1, type: "", orderid: "", trailerid: "", driverid: "", hasOnTime: true, actionValue: ""}
    try {
      planningDate = new Date(
        planningDate.getFullYear(),
        planningDate.getMonth(),
        planningDate.getDate()
      );[]
      const planningTs = planningDate.getTime();
      const blocks = [];

      if (orders) {
        if (orders.length > 0) {
          if (orders[0].movement.trailer?.maintworkorder) {
           
            let maintworkorder = orders[0]?.movement.trailer?.maintworkorder;
        
            let planningTs_end = DateTime.fromMillis(planningTs).plus({days: 1}).toMillis();
            try {
              let in_service_ts_millis = maintworkorder.in_service_ts_utc * 1000
              let out_of_service_ts_millis = maintworkorder.out_of_service_ts_utc * 1000
              if ((in_service_ts_millis > planningTs) && (in_service_ts_millis < planningTs_end)) {
                let obj1 = {
                  start: 0,
                  drawStart: 0,
                  isBlock: 1,
                  PU: 0,
                  DEL: 0,
                  MV: 0,
                  OF: 0,
                  LEN: 0,
                  orderid: "",
                  trailerid: maintworkorder.unit_code,
                  driverid: "",
                  hasReachedOnTime: false,
                  has_pickup_on_time: false,
                  has_departed_on_time: false,
                  has_delivery_on_time: false,
                  has_unloaded_on_time: false,
                  pickup_type: "",
                  delivery_type: "",
                  move_type: "MNT: " + maintworkorder.work_order_nbr
                };
                let start_out_of_service = parseInt((out_of_service_ts_millis - planningTs) / 60000);
                let service_duration = parseInt(in_service_ts_millis - out_of_service_ts_millis);
                let service_duration_minutes = parseInt(service_duration / 60000)
                obj1.OF = service_duration_minutes;
                obj1.LEN = service_duration_minutes;
                obj1.start = start_out_of_service;
                obj1.drawStart = start_out_of_service
                blocks.push(obj1);
              }
            }
            catch (error) {
            }
          }
          if (orders[0].movement.trailer?.trailerwashwo) {
            let trailer_wash_wo = orders[0].movement.trailer?.trailerwashwo;
            let planningTs_end = DateTime.fromMillis(planningTs).plus({days: 1}).toMillis();
            try {
              let in_date_utc = trailer_wash_wo.in_date_utc * 1000
              let out_date_utc = trailer_wash_wo.out_date_utc * 1000
              if ((in_date_utc > planningTs) && (in_date_utc < planningTs_end)) {
                let obj2 = {
                  start: 0,
                  drawStart: 0,
                  isBlock: 1,
                  PU: 0,
                  DEL: 0,
                  MV: 0,
                  OF: 0,
                  LEN: 0,
                  orderid: "",
                  trailerid: "",
                  driverid: "",
                  hasReachedOnTime: false,
                  has_pickup_on_time: false,
                  has_departed_on_time: false,
                  has_delivery_on_time: false,
                  has_unloaded_on_time: false,
                  pickup_type: "",
                  delivery_type: "",
                  move_type: "TW: " + trailer_wash_wo.wash_id
                };
                let start_in_date = parseInt((in_date_utc - planningTs) / 60000);
                let wash_duration = parseInt(out_date_utc - in_date_utc);
                let wash_duration_minutes = parseInt(wash_duration / 60000);
                obj2.OF = wash_duration_minutes;
                obj2.LEN = wash_duration_minutes;
                obj2.start = start_in_date;
                obj2.drawStart = start_in_date;
                blocks.push(obj2);
              }
            }
            catch (error) {
            }
          }
        }
      }
      for (let loop = 0; loop < orders.length; loop++) {
        let order = orders[loop];
        // if(order.lm_order_id=="3858600"){
        //   console.log("order",order)
        let pickup_type, delivery_type;
        let pickup_eta_utc = order.movement.pickup.eta_utc;
        let delivery_eta_utc = order.movement.delivery.eta_utc;
        let pickup_status, delivery_status, has_delivery_on_time, has_unloaded_on_time;
        let pickup_planned_depart = order.movement.pickup.planned_depart_utc;
        let pickup_planned_arrive = order.movement.pickup.planned_arrive_utc;
        let pickup_actual_depart = order.movement.pickup.actual_departure_utc;
        let pickup_actual_arrive = order.movement.pickup.actual_arrival_utc;
        let delivery_planned_arrive = order.movement.delivery.planned_arrive_utc;
        let delivery_planned_depart = order.movement.delivery.planned_depart_utc;
        let delivery_actual_depart = order.movement.delivery.actual_departure_utc;
        let delivery_actual_arrive = order.movement.delivery.actual_arrival_utc;
        let pickup_sched_arrive_early_utc = order.movement.pickup.sched_arrive_early_utc;
        let pickup_sched_arrive_late_utc = order.movement.pickup.sched_arrive_late_utc;
        let delivery_sched_arrive_early_utc = order.movement.delivery.sched_arrive_early_utc;
        let delivery_sched_arrive_late_utc = order.movement.delivery.sched_arrive_late_utc;
        let pickup_timezone = order.movement.pickup.pickup_timezone;
        let delivery_timezone = order.movement.delivery.delivery_timezone;
        let move_type, zmitStatus;
        
        if (order.movement?.pickup?.type === "pickup") {
          pickup_type = "PU"
        }
        else if (order.movement?.pickup?.type === "split pickup") {
          pickup_type = "SP"
        }
        if (order.movement?.delivery?.type === "delivery") {
          delivery_type = "DEL"
        }
        if (order.movement?.delivery?.type === "split delivery") {
          delivery_type = "SD"
        }
        // color coding for pickup block

        if (pickup_eta_utc > order.movement.pickup.sched_arrive_late_utc) {
          pickup_status = "red"
        }
        else if ((pickup_eta_utc > pickup_planned_arrive) && (
          pickup_eta_utc <= order.movement.pickup.sched_arrive_late_utc)) {
          pickup_status = "yellow"
        }
        else if (pickup_eta_utc <= pickup_planned_arrive) {
          pickup_status = "green"
        }

        // color coding for delivery block
        if (delivery_eta_utc > order.movement.delivery.sched_arrive_late_utc) {
          delivery_status = "red"
        }
        else if ((delivery_eta_utc > delivery_planned_arrive) && (
          delivery_eta_utc <= order.movement.delivery.sched_arrive_late_utc)) {
          delivery_status = "yellow"
        }
        else if (delivery_eta_utc <= delivery_planned_arrive) {
          delivery_status = "green"
        }

        if (order.movement.xmit_accepted == "Y") {
          zmitStatus = "green"
        }
        else if (order.movement.xmitted2driver != null) {
          if ((order.movement.xmit_accepted == 'N') || (order.movement.xmit_accepted == null)) {
            zmitStatus = "orange"
          }
        }
        else {
          zmitStatus = "white"
        }

        //Movetype logic. Handles returns, redeliveries, load, empty
        if (order.movement.is_return) {
          move_type = "R"
        }
        else if (order.movement.is_redelivery) {
          move_type = "RD"
        }
        else if (order.movement.loaded) {
          move_type = "L"
        }
        else {
          move_type = "E"
        }
        
        let obj = {
          start: 0,
          drawStart: 0,
          isBlock: 0,
          PU: 0,
          DEL: 0,
          MV: 0,
          OF: 0,
          LEN: 0,
          orderid: order.lm_order_id,
          trailerid: order.movement.trailer_id,
          driverid: order.movement.driver.driver_id,
          hasReachedOnTime: false,
          has_pickup_on_time: (pickup_actual_depart <= pickup_actual_depart) ? true : false,
          pickup_status: pickup_status,
          delivery_status: delivery_status,
          has_departed_on_time: false,
          has_unloaded_on_time: false,
          has_delivery_on_time: (delivery_actual_arrive <= delivery_planned_arrive) ? true : false,
          pickup_type: pickup_type,
          delivery_type: delivery_type,
          loaded: order.movement.loaded,
          zmitStatus: zmitStatus,
          move_type: move_type,
          stop_pickup__type :order.movement.pickup.type,
          stop_delivery_type :order.movement.delivery.type,
          pickup_planned_arrive: pickup_planned_arrive,
          pickup_planned_depart: pickup_planned_depart,
          pickup_actual_arrive: pickup_actual_arrive,
          pickup_actual_depart: pickup_actual_depart,
          delivery_planned_arrive: delivery_planned_arrive,
          delivery_planned_depart: delivery_planned_depart,
          delivery_actual_arrive: delivery_actual_arrive,
          delivery_actual_depart: delivery_actual_depart,
          pickup_eta_utc: pickup_eta_utc,
          delivery_eta_utc: delivery_eta_utc,
          pickup_sched_arrive_early_utc: pickup_sched_arrive_early_utc,
          pickup_sched_arrive_late_utc: pickup_sched_arrive_late_utc,
          delivery_sched_arrive_early_utc: delivery_sched_arrive_early_utc,
          delivery_sched_arrive_late_utc: delivery_sched_arrive_late_utc,
          pickup_timezone : pickup_timezone,
          delivery_timezone : delivery_timezone,
          driver_name :order.movement.driver.driver_full_name,
         terminalId:order.movement.driver.terminal.terminal_id,
          terminal_city:order.movement.driver.terminal.city,
          samseraid :order.movement.driver.samsara_id,
          Hiredate :order.movement.driver.hire_date,
          drivertypeclass :order.movement.driver.driver_type_class,
          customer_name:order.customer_name,
           order_status:order.status,
           bol_received:order.bol_received,
           consignee_refno:order.consignee_refno,
           ordered_wt:order.ordered_wt,
           on_hold:order.on_hold,
           delivery_driver_load_unload:order.movement.delivery.driver_load_unload,
           pickup_driver_load_unload:order.movement.pickup.driver_load_unload,
           pickup_appt_required:order.movement.pickup.appt_required,
           picup_confirmed :order.movement.pickup.confirmed,
          move_id : order.movement.load_id,
           company_location_id :order.movement.pickup.location.company_location_id,
         location_name : order.movement.pickup.location.location_name,
         address1:order.movement.pickup.location.address1,
         city:order.movement.pickup.location.city,
         state:order.movement.pickup.location.state,
         zip:order.movement.pickup.location.zip,
         move_id : order.movement.load_id,
         company_location_id1 :order.movement.delivery.location.company_location_id,
         location_name1:order.movement.delivery.location.location_name,
         address11:order.movement.delivery.location.address1,
         city1:order.movement.delivery.location.city,
         state1: order.movement.delivery.location.state,
         zip1:order.movement.delivery.location.zip,
         brokerage: order.movement.brokerage,
         order_type_id: order.order_type_id,
         commodity_desc: order.commodity_desc,
         blnum: order.blnum
        };
      
        // If block starts previous day
        if (pickup_planned_arrive < planningDate.getTime()) {
          let previousStartTs = DateTime.fromMillis(planningTs).minus({ days: 1 }).toMillis();
          let previousStart = parseInt((pickup_planned_arrive - previousStartTs) / 60000)
          let start_pk_ts = parseInt((pickup_planned_arrive - planningTs) / 60000);
          obj.isBlock = 1;
          obj.start = start_pk_ts;
          obj.drawStart = start_pk_ts;
          obj.PU = (pickup_planned_depart - pickup_planned_arrive) / 60000;
          obj.MV = (delivery_planned_arrive - pickup_planned_depart) / 60000;
          obj.DEL = (delivery_planned_depart - delivery_planned_arrive) / 60000;
          obj.LEN = obj.PU + obj.MV + obj.DEL;

          if ((previousStart + obj.LEN) > 1440) {
            obj.start = 0;
            obj.drawStart = 0;
            let new_DEL, new_MV, new_PU
            if ((previousStart + obj.PU) > 1440) {
              let previousPU = 1440 - (previousStart);
              new_PU = obj.PU - previousPU;
              new_MV = obj.MV;
              new_DEL = obj.DEL;
            }
            else if ((previousStart + obj.PU + obj.MV) > 1440) {
              let previous_MV = 1440 - (start_pk_ts + obj.PU);
              new_PU = 0;
              new_MV = obj.MV - previous_MV
              new_DEL = obj.DEL
            }
            else if ((previousStart + obj.PU + obj.MV + obj.DEL) > 1440) {
              new_PU = 0;
              new_MV = 0;
              let previous_DEL = 1440 - (start_pk_ts + obj.PU + obj.MV);
              new_DEL = obj.DEL - previous_DEL;
            }
            obj.PU = new_PU;
            obj.MV = new_MV;
            obj.DEL = new_DEL;
            obj.LEN = obj.PU + obj.MV + obj.DEL;
            blocks.push(obj);
          }
          let driver;
        } else {
          // In case the block starts in the same day and continue till next day
          let start_pk_ts = parseInt((pickup_planned_arrive - planningTs) / 60000);
          obj.isBlock = 1;
          obj.start = start_pk_ts;
          obj.drawStart = start_pk_ts;
          obj.PU = (pickup_planned_depart - pickup_planned_arrive) / 60000;
          obj.MV = (delivery_planned_arrive - pickup_planned_depart) / 60000;
          obj.DEL = (delivery_planned_depart - delivery_planned_arrive) / 60000;
          obj.LEN = obj.PU + obj.MV + obj.DEL;

          if ((start_pk_ts + obj.LEN) > 1440) {
            if ((start_pk_ts + obj.PU) > 1440) {
              obj.PU = 1440 - start_pk_ts;
              obj.MV = 0;
              obj.DEL = 0;
              obj.LEN = 1440 - start_pk_ts;
              obj.start = 0;
            }
            else if ((start_pk_ts + obj.PU + obj.MV) > 1440) {
              obj.MV = 1440 - (start_pk_ts + obj.PU);
              obj.DEL = 0;
              obj.LEN = 1440 - start_pk_ts;
            }
            else if ((start_pk_ts + obj.PU + obj.MV + obj.DEL) > 1440) {
              obj.DEL = 1440 - (start_pk_ts + obj.PU + obj.MV);
              obj.LEN = 1440 - start_pk_ts;
            }
          }
          let driver;
          blocks.push(obj);
        }
      }
      blockData = blocks;
    } catch (err) {
    }

    return blockData;
  }

  CarrierViewBlocksInMinutes(orders, planningDate) {
    let blockData = [];
    // { start: 0, length: 1, type: "", orderid: "", trailerid: "", driverid: "", hasOnTime: true, actionValue: ""}
    try {
      planningDate = new Date(
        planningDate.getFullYear(),
        planningDate.getMonth(),
        planningDate.getDate()
      );[]
      const planningTs = planningDate.getTime();
      const blocks = [];

      for (let loop = 0; loop < orders.length; loop++) {
        let order = orders[loop];
        let pickup_type, delivery_type;
        let pickup_eta_utc = order.movement.pickup.eta_utc;
        let delivery_eta_utc = order.movement.delivery.eta_utc;
        let pickup_status, delivery_status, has_delivery_on_time, has_unloaded_on_time;
        let pickup_planned_depart = order.movement.pickup.planned_depart_utc;
        let pickup_planned_arrive = order.movement.pickup.planned_arrive_utc;
        let pickup_actual_depart = order.movement.pickup.actual_departure_utc;
        let delivery_planned_arrive = order.movement.delivery.planned_arrive_utc;
        let delivery_planned_depart = order.movement.delivery.planned_depart_utc;
        let delivery_actual_arrive = order.movement.delivery.actual_arrival_utc;
        if (order.movement?.pickup?.type === "pickup") {
          pickup_type = "PU"
        }
        else if (order.movement?.pickup?.type === "split pickup") {
          pickup_type = "SP"
        }
        if (order.movement?.delivery?.type === "delivery") {
          delivery_type = "DEL"
        }
        if (order.movement?.delivery?.type === "split delivery") {
          delivery_type = "SD"
        }
        // color coding for pickup block
        if (pickup_eta_utc > order.movement.pickup.sched_arrive_late_utc) {
          pickup_status = "red"
        }
        else if ((pickup_eta_utc > pickup_planned_arrive) && (
          pickup_eta_utc <= order.movement.pickup.sched_arrive_late_utc)) {
          pickup_status = "yellow"
        }
        else if (pickup_eta_utc <= pickup_planned_arrive) {
          pickup_status = "green"
        }

        // color coding for delivery block
        if (delivery_eta_utc > order.movement.delivery.sched_arrive_late_utc) {
          delivery_status = "red"
        }
        else if ((delivery_eta_utc > delivery_planned_arrive) && (
          delivery_eta_utc <= order.movement.delivery.sched_arrive_late_utc)) {
          delivery_status = "yellow"
        }
        else if (delivery_eta_utc <= delivery_planned_arrive) {
          delivery_status = "green"
        }
        let obj = {
          start: 0,
          drawStart: 0,
          isBlock: 0,
          PU: 0,
          DEL: 0,
          MV: 0,
          OF: 0,
          LEN: 0,
          orderid: order.lm_order_id,
          trailerid: order.movement.trailer_id,
          driverid: "Bulkmatic Solutions",
          hasReachedOnTime: false,
          has_pickup_on_time: (pickup_actual_depart <= pickup_actual_depart) ? true : false,
          pickup_status: pickup_status,
          delivery_status: delivery_status,
          has_departed_on_time: false,
          has_unloaded_on_time: false,
          has_delivery_on_time: (delivery_actual_arrive <= delivery_planned_arrive) ? true : false,
          pickup_type: pickup_type,
          delivery_type: delivery_type,
          // loaded: order.movement.loaded,
          // zmitStatus: "carrierView"
          
        };
      
        // If block starts previous day
        let time = planningDate.getTime();
        if (pickup_planned_arrive < planningDate.getTime()) {

          let previousStartTs = DateTime.fromMillis(planningTs).minus({ days: 1 }).toMillis();
          let previousStart = parseInt((pickup_planned_arrive - previousStartTs) / 60000)
          let start_pk_ts = parseInt((pickup_planned_arrive - planningTs) / 60000);
          obj.isBlock = 1;
          obj.start = start_pk_ts;
          obj.drawStart = start_pk_ts;
          obj.PU = (pickup_planned_depart - pickup_planned_arrive) / 60000;
          obj.MV = (delivery_planned_arrive - pickup_planned_depart) / 60000;
          obj.DEL = (delivery_planned_depart - delivery_planned_arrive) / 60000;
          obj.LEN = obj.PU + obj.MV + obj.DEL;

          if ((previousStart + obj.LEN) > 1440) {
            obj.start = 0;
            obj.drawStart = 0;
            let new_DEL, new_MV, new_PU
            if ((previousStart + obj.PU) > 1440) {
              let previousPU = 1440 - (previousStart);
              new_PU = obj.PU - previousPU;
              new_MV = obj.MV;
              new_DEL = obj.DEL;
            }
            else if ((previousStart + obj.PU + obj.MV) > 1440) {
              let previous_MV = 1440 - (start_pk_ts + obj.PU);
              new_PU = 0;
              new_MV = obj.MV - previous_MV
              new_DEL = obj.DEL
            }
            else if ((previousStart + obj.PU + obj.MV + obj.DEL) > 1440) {
              new_PU = 0;
              new_MV = 0;
              let previous_DEL = 1440 - (start_pk_ts + obj.PU + obj.MV);
              new_DEL = obj.DEL - previous_DEL;
            }
            obj.PU = new_PU;
            obj.MV = new_MV;
            obj.DEL = new_DEL;
            obj.LEN = obj.PU + obj.MV + obj.DEL;
            blocks.push(obj);
          }
          let driver;
        } else {
          // In case the block starts in the same day and continue till next day

          let start_pk_ts = parseInt((pickup_planned_arrive - planningTs) / 60000);
          obj.isBlock = 1;
          obj.start = start_pk_ts;
          obj.drawStart = start_pk_ts;
          obj.PU = (pickup_planned_depart - pickup_planned_arrive) / 60000;
          obj.MV = (delivery_planned_arrive - pickup_planned_depart) / 60000;
          obj.DEL = (delivery_planned_depart - delivery_planned_arrive) / 60000;
          obj.LEN = obj.PU + obj.MV + obj.DEL;

          if ((start_pk_ts + obj.LEN) > 1440) {
            if ((start_pk_ts + obj.PU) > 1440) {
              obj.PU = 1440 - start_pk_ts;
              obj.MV = 0;
              obj.DEL = 0;
              obj.LEN = 1440 - start_pk_ts;
              obj.start = 0;
            }
            else if ((start_pk_ts + obj.PU + obj.MV) > 1440) {
              obj.MV = 1440 - (start_pk_ts + obj.PU);
              obj.DEL = 0;
              obj.LEN = 1440 - start_pk_ts;
            }
            else if ((start_pk_ts + obj.PU + obj.MV + obj.DEL) > 1440) {
              obj.DEL = 1440 - (start_pk_ts + obj.PU + obj.MV);
              obj.LEN = 1440 - start_pk_ts;
            }
          }
          let driver;

          blocks.push(obj);
        }
     
      }
      blockData = blocks;
     
      // 
    } catch (err) {
    }
    return blockData;
  }
  getOfffDutyBlocks(orders, date) {
    let obj = {
      start: 0,
      drawStart: 0,
      isBlock: 0,
      PU: 0,
      DEL: 0,
      MV: 0,
      LEN: 0,
      orderid: "",
      trailerid: "",
      driverid: "",
      hasReachedOnTime: false,
      has_pickup_on_time: false,
      has_departed_on_time: false,
      has_delivery_on_time: false,
      has_unloaded_on_time: false,
      pickup_type: "",
      delivery_type: "",
    };

    return obj;
  }

  async getAlerts() {
    try {
      const url = this.ApiEndPoint + "/alerts";
      const alertsResponse = await axios.get(url);
      return alertsResponse;
    } catch (err) {
      throw err;
    }
  }

  async dismissAlert(alert_id) {
    try {
      const url = this.ApiEndPoint + "/dismissalert";
      const requestBody = {
        alert_id: alert_id
      };
      const alertsResponse = await axios.post(url, requestBody);
      return alertsResponse;
    } catch (err) {
      throw err;
    }
  }

  async getOrderById(id){
    try {
      const url = this.ApiEndPoint + "/orders/" + id;
      const  orderResponse = await axios.get(url);
      return orderResponse;
    } catch (error) {
      throw error;
    }
  }
  async getImapctView(input_date, driver_id, trailer_id) {
    let impactViewApiData = []
    try {
      let data = {
        inputDate: input_date / 1000,
        driver_id: driver_id,
        trailer_id: trailer_id
      }
      const url = this.ApiEndPoint + "/impactview";
      try {
        impactViewApiData = await axios.post(url, data);
      } catch (error) {
         throw err;
      }

    } catch (err) {
      throw err;
    }
    return await Promise.resolve(impactViewApiData.data);
  }
}
export default PlanningBoardService;