import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import ProgressBar from "react-bootstrap/ProgressBar";
import TrailerService from "../../services/trailerService";

const TrailerBodyForDetails = (props) => {
  const { trailer } = props;
  const [trailerSpecification, setTrailerSpecification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });

  const [dataResult, setDataResult] = useState(
    process(trailerSpecification, dataState)
  );

  useEffect(async () => {
    if (trailer.trailer_id) {
      setLoading(true);
      const trailerService = new TrailerService();
      let trailerSpecificationResult =
        await trailerService.gettrailerSpecificationsbytrailerid(
          trailer.trailer_id
        );
      setDataResult(process(trailerSpecificationResult, dataState));
      setTrailerSpecification(trailerSpecificationResult);
      setLoading(false);
    }
  }, []);

  const dataStateChange = (event) => {
    setDataResult(process(trailerSpecification, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(trailerSpecification, dataState));
  }, [trailerSpecification]);

  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            {/* <h2 className="header-title">Additional Details </h2> */}
            <div className="container special_container_padding">
              {trailerSpecification?.length > 0 ? (
                <Grid
                  filter={dataState.filter}
                  filterable={true}
                  sort={dataState.sort}
                  sortable={true}
                  pageable={{
                    pageSizes: [5, 10, 20, 25, 50, 100],
                    info: true,
                    previousNext: true,
                    buttonCount : 10
                  }}
                  resizable={true}
                  skip={dataState.skip}
                  take={dataState.take}
                  data={dataResult}
                  onDataStateChange={dataStateChange}
                  onRowClick={(e) => props.parentcallback(true, e.dataItem)}
                >
                  <GridColumn field="eqgroupcode" title="Group" width="300px" />
                  <GridColumn
                    field="eqgroupparameter"
                    title="Parameter"
                    width="300px"
                  />
                  <GridColumn
                    field="groupdescr"
                    title="Description"
                    width="300px"
                  />
                </Grid>
              ) : loading ? (
                <div>
                  <ProgressBar animated now={100} />
                  <div className="middle loader--text1"> </div>
                </div>
              ) : (
                <div className="text-center">No data found</div>

              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerBodyForDetails;
