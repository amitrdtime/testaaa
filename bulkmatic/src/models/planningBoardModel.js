class PlanningBoard {
    // Have the parameter as per the need so that object creation shouldbe controlled from single place.
    // This will help us to avoid creating different structure across multiple pages.
    constructor() {

    }

    
    //This is to parse from API
    parseApiPlanningBoardObject(board) {
        let boardObject = {};

        // const dt = new Date();
        // const diff = dt.getTimezoneOffset();
        // 

        if (board === null || board === undefined)
            return boardObject;
        
        if (Object.keys(board).length === 0)
            return boardObject;
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        
        boardObject = {...board};
        return boardObject;
    }
}

export default PlanningBoard;
