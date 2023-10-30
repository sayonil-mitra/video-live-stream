//imports
const { launch, getStream } = require("puppeteer-stream");
const { executablePath } = require("puppeteer");
const { exec } = require("child_process");

// function to launch browser and create stream
async function video_live_stream(content_url, stream_url) {
  // launch headless browser
  const browser = await launch({
    headless: true,
    args: [
      "--fast-start",
      "--disable-extensions",
      "--start-fullscreen",
      //"--headless",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
    ignoreHTTPSErrors: true,
    executablePath: executablePath(),
    defaultViewport: {
      deviceScaleFactor: 1,
      width: 1280,
      height: 720,
    },
  });

  // navigate to provided url
  const page = await browser.newPage();
  await page.goto(content_url);

  // create stream
  const stream = await getStream(page, { audio: true, video: true });
  console.log("content being recorded");

  // configure ffmpeg
  const ffmpeg = exec(
    'ffmpeg -re -i - -vf scale=852:480 -c:v libx264 -pix_fmt yuv420p -profile:v main -preset slow -x264opts "nal-hrd=cbr:no-scenecut" -g 60 -bufsize 3968k -c:a aac -b:a 160k -ac 2 -ar 44100 -avoid_negative_ts make_zero -max_interleave_delta 0 -max_muxing_queue_size 4096 -filter:v fps=25 -f flv -flvflags no_duration_filesize "' +
      stream_url +
      '"'
  );
  // ffmpeg.stderr.on("data", (chunk) => {
  //   console.log(chunk.toString());
  // });
  console.log("ffmpeg running");

  // send stream
  stream.pipe(ffmpeg.stdin);
  console.log("stream is being sent");
}

module.exports = video_live_stream;
