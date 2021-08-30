const express = require('express');
const fileupload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const PPTX2Json = require('pptx2json');
const flatten = require('flat');
const toPdf = require('custom-soffice-to-pdf');
const pdf = require('pdf-parse');
const gm = require('gm');

const pptx2json = new PPTX2Json();
const app = express();

app.use(cors());
app.use(fileupload());
app.use(express.static('files'));

app.post('/upload', (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No Files',
      });
    } else {
      processPPTX(req.files.pptx.data, 'bigboy')
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
      res.send({
        status: true,
        message: 'File is uploaded',
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }

  console.log(req.files.pptx.data);
});

app.listen(5000, () => {
  console.log(`Brain backend server is listening at http://localhost:5000`);
});

const processPPTX = async (pptBuffer, name) => {
  // Convert PPT Buffer to Text

  const extractTextFromPPTBuffer = async (pptBuffer) => {
    try {
      const json = await pptx2json.buffer2json(pptBuffer);
      // const json = await pptx2json.buffer2json(pptBuffer);

      // Object.keys to list all properties in raw (the original data), then
      // Array.prototype.filter to select keys that are present in the allowed list, using
      // Array.prototype.includes to make sure they are present
      // Array.prototype.reduce to build a new object with only the allowed properties.

      // Filter XML structure to only slides
      const filtered = Object.keys(json)
        .filter((key) => key.substring(0, 16) === 'ppt/slides/slide')
        .reduce((obj, key) => {
          obj[key] = json[key];
          return obj;
        }, {});

      // Correctly sort XML structure based on slide order
      const sorted = Object.keys(filtered)
        .sort((a, b) => {
          const getId = (str) => {
            return parseInt(str.substring(0, str.length - 4).substring(16, str.length));
          };
          if (getId(a) < getId(b)) {
            return -1;
          }
          if (getId(a) > getId(b)) {
            return 1;
          }
          return 0;
        })
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: filtered[key],
          }),
          {}
        );

      // Flatten XML Structure
      const flattened = [];
      for (const property in sorted) {
        const flatChild = flatten(filtered[property]);
        const text = Object.keys(flatChild)
          .filter((key) => key.endsWith('a:t.0'))
          .reduce((obj, key) => {
            obj[key] = flatChild[key];
            return obj;
          }, {});
        flattened.push(text);
      }

      // Concatenate XML structure
      const concatenated = flattened.map((entry) => {
        const concatFilter = Object.keys(entry)
          .filter((key) => entry[key].length > 5)
          .reduce((obj, key) => {
            obj[key] = entry[key];
            return obj;
          }, {});
        const arr = Object.values(concatFilter).join(', ');
        return arr;
      });
      return concatenated;
    } catch (error) {
      console.log(error);
    }
  };

  const text = await extractTextFromPPTBuffer(pptBuffer);

  // Convert PPT Buffer to PNGs

  const extractPNGFromPPTBuffer = async (pptBuffer) => {
    const pdfBuffer = await toPdf(pptBuffer)
      .then((data) => {
        return data;
      })
      .catch((error) => console.log(error));

    const numPages = await pdf(pdfBuffer)
      .then((data) => {
        return data.numrender;
      })
      .catch((error) => console.log(error));

    const asyncGM = (frame) => {
      return new Promise((resolve, reject) => {
        gm(pdfBuffer)
          .selectFrame(frame)
          .toBuffer('PNG', function (err, buffer) {
            if (err) reject(err);
            resolve(buffer);
          });
      });
    };

    let frames = [];
    for (let i = 0; i < numPages; i++) {
      frames.push(await asyncGM(i));
    }

    return {
      pdfBuffer,
      numPages,
      frames,
    };
  };

  const images = await extractPNGFromPPTBuffer(pptBuffer);

  const dataOutput = text.map((entry, key) => {
    return {
      text: entry,
      image: images.frames[key],
    };
  });
  const output = {
    name: name,
    pdf: images.pdfBuffer,
    ppt: pptBuffer,
    count: images.numPages,
    slides: dataOutput,
  };
  return output;
};
