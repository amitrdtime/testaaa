class Driver {
    constructor(){

    }

    nodesSample = [
        {
           value: 'Griffith',
           label: 'Griffith',
           children:
              [
                 { value: 'CommodityGroup1', label: 'Commodity Group' },
                 { value: 'Shippers1', label: 'Shippers' },
              ],
        },
        {
           value: 'Indiana',
           label: 'Indiana',
           children:
              [
                 {
                    value: 'CommodityGroup2',
                    label: 'Commodity Group',
                    children:
                       [
                          { value: 'Edible', label: 'Edible' },
                          { value: 'Plastic', label: 'Plastic' },
                       ],
                 },
                 {
                    value: 'Shippers2',
                    label: 'Shippers',
                    children:
                       [
                          { value: 'Shipper1', label: 'Shipper 1' },
                          { value: 'Shipper2', label: 'Shipper 2' },
                       ],
                 },
              ],
        }
     ];

    parseApiAccessProfileObject(aprofile){
        
         const apObject = aprofile;
        
        return apObject;
    }

    getObjectValues(aprofile) {
        const obj = [];
        
        for(let loop =0; loop < aprofile.length; loop++)
        {
             
             const dataObj = {};
             dataObj.value = aprofile[loop].code;
             dataObj.label = aprofile[loop].name;
             if (aprofile[loop].children.length)
                dataObj.children = this.getObjectValues(aprofile[loop].children);
             else
                dataObj.children = [];

             obj.push(dataObj);
        }
        

        return obj;
    }
}

export default Driver;