// imports
const express = require("express");
const video_live_stream = require("./liveStream");
const bodyParser = require("body-parser");

// create app
const app = express();
const PORT = 8000;
app.use(bodyParser.json());

// create app endpoint
app.post("/live", (req, res) => {
  // information coming as input
  const { CONTENT_URL, STREAM_URL } = req.body;

  // check for valid input
  if (CONTENT_URL == "" || CONTENT_URL == null) {
    console.log("CONTENT_URL missing");
    return res.send({ error_message: "content url is missing!" });
  }
  if (STREAM_URL == "" || STREAM_URL == null) {
    console.log("STREAM_URL missing");
    return res.send({ error_message: "stream url is missing!" });
  }

  // start video live stream
  video_live_stream(CONTENT_URL, STREAM_URL);

  // send response
  res.status(200).send("Stream started successfully");
});

// run app
app.listen(PORT, () =>
  console.log(`Server running on port : http://localhost:${PORT}`)
);
