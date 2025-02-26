import React from "react";
import Backbutton from "../../../Components/Backbutton";
import FileUpload from "../Components/FileUpload";
import Merchant_Header from "../Components/Merchant_Header";

const BulkCreateProduct = () => {
  return (
    <>
      <Merchant_Header />
      <div className="" style={{ marginTop: "8vh" }}>
        <Backbutton path={"/dashboard/merchant/product-list"} />
      </div>

      <div className="justify-between">
        <FileUpload filetype={"image"} />

        <FileUpload filetype={"excel"} />
      </div>
    </>
  );
};

export default BulkCreateProduct;
