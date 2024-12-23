class Yard {
    constructor(){


    }
    sampleYard=[
        {
            id:"9e152643-5905-4795-8f29-6323a17be414",
            status:"open",
            startTs:"2021-09-22T14:39:42.582Z",
            endTs:"2021-09-22T14:39:42.606Z",
            terminalid:"10",
            name:"",
            code:"",
            isActive:true,
            address:"",
            city:"",
            state:"",
            zip:"",
            fax:"",
            phone:"",
            email:"",
            trailers:[
               
            ]
         },
         {
            id:"3b26aacc-046f-4c2e-80b5-14ad416e12a1",
            status:"close",
            startTs:"2021-09-22T14:45:05.520Z",
            endTs:"2021-09-22T15:27:28.800Z",
            terminalid:"1",
            name:"",
            code:"",
            isActive:true,
            address:"",
            city:"",
            state:"",
            zip:"",
            fax:"",
            phone:"",
            email:"",
            trailers:[
               {
                  id:"3ff54159-ceef-40ef-b238-4baf5353a254",
                  trailerId:"1",
                  isStatus:true,
                  isConfirm:false,
                  isRedFlag:false,
                  eqmake:"",
                  eqmodel:"",
                  eqdescription:""
                  
               }
            ]
         }
    ]
    parseApiYardObject(yard){
      
        const yardObject = {};
        yardObject.id = yard.id;
        yardObject.name = yard.name;
        yardObject.code = yard.code;
        yardObject.isActive = yard.is_active;
        yardObject.address = yard.address;
        yardObject.city = yard.city;
        yardObject.state = yard.state;
        yardObject.zip = yard.zip;
        yardObject.phone = yard.phone;
        yardObject.email = yard.email;
        yardObject.endTs = yard.check_end_ts;
        yardObject.startTs = yard.check_start_ts;
        yardObject.status = yard.check_status;
        yardObject.username = yard.check_user;
        yardObject.comment = yard.check_comments;
        yardObject.region = yard.terminal.region;

        yardObject.terminal_name = yard?.terminal?.code.trim() + " - " + yard?.terminal?.city.trim();

        yardObject.terminalid = yard.terminal_id?yard.terminal_id.toString():yard.terminalid.toString();
      

        


        return yardObject;
    }
}

export default Yard;