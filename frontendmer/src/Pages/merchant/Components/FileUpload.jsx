import React, { useState } from "react";
// import { useHistory } from 'react-router-dom'; // Import useHistory for navigation // Assuming you have a CSS file for styling
import toast from "react-hot-toast";
import { UploadProductSheet, UploadToS3 } from "../../../State/uploadToS3";
import CopyToClipboard from "./CopyToClipboard";
import { useSelector } from "react-redux";

// * This component is for taking input of the excel and the image
const FileUpload = ({ filetype, onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);
  const [loading, setloading] = useState(false);
  const [isexcelUploaded, setIsexcelUploaded] = useState(false);

  const auth = useSelector((state) => state.auth);

  // * this variable is for handling the image files
  var productImages = [];

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setloading(true);

    if (filetype === "image") {
      // Call the function to handle image files
      productImages = [...productImages, ...selectedFiles];
      let imageLink = await UploadToS3(productImages, "Products-Images");

      console.log(productImages);
      setImageLinks(imageLink);
      setloading(false);
    }

    if (filetype === "excel") {
      // Process the Excel file and navigate to a new page
      // Assuming you have a function to process the Excel file
      processExcelFile(selectedFiles[0]);
    }
  };

  const handleSubmit = async () => {
    if (filetype === "image") {
    } else if (filetype === "excel") {
      // Process the Excel file and navigate to a new page
      // Assuming you have a function to process the Excel file
      console.log("Excel is pushed");
      processExcelFile(files[0]); // Pass the first file (Excel)
    }
  };

  const processExcelFile = async (file) => {
    let vendorName = auth.user.name;

    let res = await UploadProductSheet(file, vendorName);
    if (res) {
      setIsexcelUploaded(true);
      setloading(false);
    } else {
      toast.error("Failed to upload Excel file");
    }
  };

  return (
    <div className="file-upload-container">
      <h2 className="upload-title">
        {filetype === "excel" ? "Upload Excel File" : "Upload Image Files"}
      </h2>
      <label className="file-upload-label">
        <input
          type="file"
          accept={filetype === "excel" ? ".xlsx, .xls" : "image/*"}
          onChange={handleFileChange}
          className="file-input"
          multiple={filetype === "image"} // Allow multiple files if filetype is image
        />
        <span className="upload-button">Choose Files</span>
      </label>
      {files.length > 0 && (
        <div className="selected-files">
          <p>Selected files:</p>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {imageLinks.length > 0 && (
        <div className="copied-links">
          <p className="mt-2 text-danger">
            Note: Please don't refresh the page or close the tab before you copy
            the links.
          </p>

         <div className="mb-3">
           {/* Button to Copy All Links */}
           <p className="mb-3 text-success">
            Copy All Links [Note: Before uploading to the excel you have to remove the "" double quotes from the links and square brackets] 
          </p>
          <CopyToClipboard text={JSON.stringify(imageLinks)}></CopyToClipboard>
         </div>

          <ul>
            <h7 className="text-danger">Copy the Links one by one</h7>
            {imageLinks.map((link, index) => (
              <li key={index}>
                <CopyToClipboard text={link}>
                  <span>{link}</span>
                </CopyToClipboard>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isexcelUploaded && (
        <>
          <h3 className="text-danger">
            Successfully the file uploaded so please wait for upto 30 minutes
            before uploading the next data sheet
          </h3>
        </>
      )}
    </div>
  );
};

export default FileUpload;
