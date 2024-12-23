import React, { useEffect, useState } from "react";
import TrailerService from "../../services/trailerService";
import TrailerspageTable from "../TrailerspageTable/TrailerspageTable";


const TrailersTab = () => {

    const [tabSelected, setTabSelected] = useState("");
    const [allTrailers, setAllTrailers] = useState([]);

    useEffect(async () => {
        const trailerService = new TrailerService();
        try {
            await trailerService.getAllTrailers().then((trailers) => {
                setAllTrailers(trailers);
            });
        } catch (error) {
            
        }
    }, []);

    return (
        <div>
            <TrailerspageTable allTrailersArray={allTrailers} />
        </div>
    );
};

export default TrailersTab;
