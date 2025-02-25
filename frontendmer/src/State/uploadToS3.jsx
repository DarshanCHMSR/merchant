import axios from "axios";
import imageCompression from "browser-image-compression";
import { url } from "../Components/backend_link/data";
import toast from 'react-hot-toast';

const compressImage = async (file) => {
  if (!(file instanceof Blob || file instanceof File)) {
    console.error("Invalid file type:", file);
    return file; // Return original file if it's not a Blob or File
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return file; // Return original file if compression fails
  }
};   
   
export const UploadToS3 = async (fileList, foldername) => {
  try {
    // ? Convert FileList to Array
    const images = Array.from(fileList);

    // console.log("We came to the functions");

    const res = await axios.post(`${url}/api/v2/upload/get-presignedurl`, {
      files: images.map((file) => ({
        fileName: file.name,
        fileType: file.type,
      })),
      foldername,
    });

    const { urls, uploadfoldername } = res.data;

    // console.log("pre signed URL = ",res.data);

    // Compress images before uploading to S3
    const compressedImages = await Promise.all(
      images.map((image) => compressImage(image))
    );

    // Array to hold the constructed image URLs
    const imageUrls = await Promise.all(
      compressedImages.map(async (image, index) => {
        const uploadURL = urls[index]?.uploadURL;

        if (!uploadURL) {
          console.error("Invalid upload URL for image", index);
          return null;
        }

        // Perform the PUT request
        await axios.put(uploadURL, image, {
          headers: {
            "Content-Type": image.type,
          },
        });

        const bucketName = "valuekarts-test-img-data"; // Replace with your actual bucket name
        const key = urls[index].fileName; // Extract the file name from the pre-signed URL
        const s3Url = `https://s3.ap-south-1.amazonaws.com/${bucketName}/${uploadfoldername}/${key}`;
// console.log("s3Url = ",s3Url);
        return s3Url;
      })
    );

    return imageUrls.filter(Boolean);
  } catch (error) {
    console.error("Error in UploadToS3:", error);
    throw error;
  }
};

export const UploadProductSheet = async (file, uploader) => {
  try {
    // Check if the file is an Excel file
    const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validFileTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload an Excel file.");
    }

    // Step 1: Get the pre-signed URL from the backend
    const { data } = await axios.post(`${url}/api/v2/upload/upload-productSheet`, {
      vendorName: uploader,
      file: file.name, // Send the file name to the backend
    });

    const uploadURL = data.urls[0].uploadURL; // Get the pre-signed URL

    // Step 2: Upload the file to S3 using the pre-signed URL
    const uploadResponse = await axios.put(uploadURL, file, {
      headers: {
        "Content-Type": file.type, // Set the correct content type for the file
      },
    });

    // console.log("The upload response is", uploadResponse.data);

    return true; // Indicate success
  } catch (error) {
    console.error("Error uploading product sheet:", error);
    toast.error(error.response?.data?.message || "An error occurred");
    throw error;
  }
};

