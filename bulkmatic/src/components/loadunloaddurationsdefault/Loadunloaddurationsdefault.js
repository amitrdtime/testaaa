import React, { useState } from "react";
import Table from "./Table";

const Loadunloaddurationsdefault = ({ tablelist ,  isDataloaded , setTablelist , parentCallBackForDuration  }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <div className="table-responsive">
              <Table
                tablelist={tablelist[0]?.loadunload}
                modalShow={modalShow}
                isDataloaded={isDataloaded}
                setModalShow={setModalShow}
                setTablelist={setTablelist}
                parentCallBackForDuration={parentCallBackForDuration}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loadunloaddurationsdefault;
