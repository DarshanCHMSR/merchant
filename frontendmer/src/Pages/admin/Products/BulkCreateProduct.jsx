import React from "react";
import Admin_Header from "../Components/Admin_Header";
import Backbutton from "../../../Components/Backbutton";
import FileUpload from "../Components/FileUpload";

const BulkCreateProduct = () => {
  return (
    <>
      <Admin_Header />
      <div className="" style={{ marginTop: "8vh" }}>
        <Backbutton path={"/dashboard/admin/product-list"} />
      </div>

      <div className="justify-between">
        <FileUpload filetype={"image"} />

        <FileUpload filetype={"excel"} />
      </div>
    </>
  );
};

export default BulkCreateProduct;
