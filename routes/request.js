require('dotenv').config({
  path: './environment.env'
})
const {
  Configuration,
  OpenAIApi
} = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);
const sharp = require('sharp');
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var fs = require('fs')
var request = require('request');

const imageFolder = './generations';

if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder);
}



/* Generation completion */
router.post('/generation', async function (req, res, next) {
  var prompt = req.body;

  try {
    const response = await openai.createImage({
      "prompt": prompt.promptText,
      "n": 1,
      "size": "1024x1024",
      "response_format": "b64_json",
    });

    let dataURL = response.data.data[0].b64_json;
    // Convert the base64 data URL to a Buffer
    const imageBuffer = Buffer.from(dataURL, 'base64');

    // Calculate the dimensions for a 16:9 aspect ratio
    let targetAspectRatio = 0.0;
    switch (prompt.promptRes) {
      case "landscape":
        targetAspectRatio = 16 / 9;
        break;
      case "normal":
        targetAspectRatio = 4 / 3;
        break;
      case "classic":
        targetAspectRatio = 3 / 2;
        break;
      case "square":
        targetAspectRatio = 1 / 1;
        break;
      default:
        targetAspectRatio = 16 / 9;
        break;
    }

    const inputWidth = 1024;
    const inputHeight = 1024;

    const targetHeight = Math.round(inputWidth / targetAspectRatio);
    const offsetY = Math.round((inputHeight - targetHeight) / 2);

    // Load the image, crop it to the desired aspect ratio, and save the result
    sharp(imageBuffer)
      .extract({
        left: 0,
        top: offsetY,
        width: inputWidth,
        height: targetHeight,
      })
      .toBuffer((err, outputBuffer, info) => {
        if (err) {
          console.error('Error processing the image:', err);
        } else {
          const outputDataURL = 'data:image/png;base64,' + outputBuffer.toString('base64');
          res.send(outputDataURL)
        }
      });


  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong."
    });
  }

});


/* Edition completion */
router.post('/edits', async function (req, res, next) {
  var prompt = req.body;

  const base64 = prompt.imageData.split(",")[1];
  const buf = Buffer.from(base64, 'base64');
  buf.name = "image.png";

  try {
    const response = await openai.createImageEdit(
      buf,
      buf,
      prompt.promptText,
      1,
      "1024x1024",
      `b64_json`
    );

    let dataURL = response.data.data[0].b64_json;
    // Convert the base64 data URL to a Buffer
    const imageBuffer = Buffer.from(dataURL, 'base64');

    // Calculate the dimensions for a 16:9 aspect ratio
    let targetAspectRatio = 0.0;
    switch (prompt.promptRes) {
      case "landscape":
        targetAspectRatio = 16 / 9;
        break;
      case "normal":
        targetAspectRatio = 4 / 3;
        break;
      case "classic":
        targetAspectRatio = 3 / 2;
        break;
      case "square":
        targetAspectRatio = 1 / 1;
        break;
      default:
        targetAspectRatio = 16 / 9;
        break;
    }

    const inputWidth = 1024;
    const inputHeight = 1024;

    const targetHeight = Math.round(inputWidth / targetAspectRatio);
    const offsetY = Math.round((inputHeight - targetHeight) / 2);

    // Load the image, crop it to the desired aspect ratio, and save the result
    sharp(imageBuffer)
      .extract({
        left: 0,
        top: 0,
        width: inputWidth,
        height: targetHeight,
      })
      .toBuffer((err, outputBuffer, info) => {
        if (err) {
          console.error('Error processing the image:', err);
        } else {
          const outputDataURL = 'data:image/png;base64,' + outputBuffer.toString('base64');
          res.send(outputDataURL)
        }
      });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong."
    });
  }
});


module.exports = router;