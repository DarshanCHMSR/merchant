import AWS from "aws-sdk";
import crypto from "crypto";

import dotenv from "dotenv";  
dotenv.config();


// * here we have explicitly assigned the region, access key id and secret access key because API key is not fetching our .env file
// AWS.config.update({
//   accessKeyId: "AKIA6K5V7UA5GGKHW3HH",
//   secretAccessKey: "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",
//   region: "ap-south-1",
// });

AWS.config.update({
  accessKeyId: "AKIA6K5V7UA5HJMQ5U5I",
  secretAccessKey: "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",
  region: "ap-south-1",
});
const s3 = new AWS.S3();

const generateUniqueFileName = (originalName) => {
  const fileExtension = originalName.split(".").pop(); // Extract the file extension
  const uniqueId = crypto.randomBytes(16).toString("hex"); // Generate a random 16-byte string
  return `${uniqueId}.${fileExtension}`;
};

//* this method is generting presigned URL
export const generatePreSignedURL = async (req, res) => {
  try {
    // * here we are getting file list and foldername from the body mean in which in a bucket in which folder the image should be saved.
    const { files, foldername } = req.body;

    // * This is used for storing the preSignedURl becuase we have to send them to the frontend.
    const urls = [];

    for (const file of files) {
      // * Extracting the file name and it's type i.e file extenstion
      const { fileName, fileType } = file;

      const uniqueFileName = generateUniqueFileName(fileName);

      if (!fileName || !fileType) {
        console.error("Invalid file data:", file);
        continue;
      }

      const params = {
        Bucket: "valuekarts-test-img-data",
        Key: `${foldername}/${uniqueFileName}`,
        Expires: 60,
        ContentType: fileType,
      };

      const uploadURL = await s3.getSignedUrlPromise("putObject", params);

      urls.push({
        fileName: uniqueFileName,
        uploadURL,
      });
    }
// console.log("pre signed URL = ",urls);
    res.status(200).send({
      urls,
      uploadfoldername: foldername,
    });
  } catch (error) {
    console.log("The error is", error.message);
    return;
  }
};

export const generatePreSignedURLForProductSheet = async (req, res) => {
  try {
    // * from here we have to generate the preSignedURL.

    const { vendorName, file } = req.body;
    // console.log(vendorName, file);
    // const fileType = file.type;

    const preSignedURL = [];

    if (!vendorName || !file) {
      console.error("Invalid file data:", req.body);
      return;
    }

    const params = {
      Bucket: "valuekarts-product-sheet",
      Key: `${vendorName}/${file}`, // * file refers to spreadsheet
      Expires: 60,
      ContentType: "xlsx",
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);

    preSignedURL.push({
      uploader: vendorName,
      uploadURL,
    });

    res.status(200).send({
      urls: preSignedURL,
      uploader: vendorName,
    });

  } catch (error) {
    console.log("The error is", error);
    res.status(500).send({ message: "Failed to generate product sheet pre-signed URL" });
  }
};
