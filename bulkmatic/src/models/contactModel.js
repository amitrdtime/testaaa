class Contact {
    // Have the parameter as per the need so that object creation shouldbe controlled from single place.
    // This will help us to avoid creating different structure across multiple pages.
    constructor() {

    }

    sampleContacts = [
        {
            name:"test",
            title:"test title",
            phone:"8481945556",
            email:"test@demo.com",
            id:"1"
        },
        {
            name:"test 2",
            title:"test title 2",
            phone:"8496489835",
            email:"testemail@demo.com",
            id:"2"
        },
        
    ];

    //This is to parse from API
    parseApiContactObject(contact) {
        const contactObj = {};

        if (contact === null || contact === undefined)
            return contactObj;
        
        if (Object.keys(contact).length === 0)
            return contactObj;
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        contactObj.id= contact.id;
        contactObj.name= contact.name;
        contactObj.title = contact.title;
        contactObj.phone = contact.phone;
        contactObj.Email = contact.email;
        
       return contactObj;
    }
}

export default Contact;
