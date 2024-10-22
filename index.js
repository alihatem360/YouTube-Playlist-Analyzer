const ytdl = require("ytdl-core");
const axios = require("axios");

// Loader function
function startLoader() {
  const spinner = ["|", "/", "-", "\\"];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r Fetching data ... ${spinner[i++]}`);
    i &= 3;
  }, 250);
}

function stopLoader(loader) {
  clearInterval(loader);
  process.stdout.write("\r");
}

// Function to get playlist details using YouTube API
async function getPlaylistVideos(playlistId, apiKey) {
  try {
    let videos = [];
    let nextPageToken = "";
    let baseUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

    do {
      const response = await axios.get(baseUrl + `&pageToken=${nextPageToken}`);
      const data = response.data;
      nextPageToken = data.nextPageToken || "";
      videos = videos.concat(
        data.items.map((item) => item.contentDetails.videoId)
      );
    } while (nextPageToken);

    return videos;
  } catch (error) {
    console.error("Error fetching playlist:", error.message);
  }
}

// Function to estimate video size and duration
async function getVideoDetails(videoId) {
  try {
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { quality: "highest" });
    const videoDuration = parseInt(info.videoDetails.lengthSeconds); // Duration in seconds

    // Estimate size by bitrate (bps) and duration (seconds)
    const bitrate = format.bitrate || 500 * 1024; // Assume 500 kbps if bitrate is not available
    const sizeInBytes = (bitrate / 8) * videoDuration; // Size in bytes
    const sizeInMB = sizeInBytes / (1024 * 1024); // Convert to MB
    return { sizeInMB, videoDuration };
  } catch (error) {
    console.error(`Error fetching video ${videoId}:`, error.message);
  }
}

// Function to format time in hours, minutes, and seconds
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

// Main function to get total playlist size and time
async function getPlaylistSizeAndTime(playlistUrl, apiKey) {
  const loader = startLoader();
  try {
    const playlistId = playlistUrl.split("list=")[1];
    const videos = await getPlaylistVideos(playlistId, apiKey);
    let totalSize = 0;
    let totalDuration = 0;

    for (const videoId of videos) {
      const { sizeInMB, videoDuration } = await getVideoDetails(videoId);
      totalSize += sizeInMB || 0;
      totalDuration += videoDuration || 0;
    }

    const totalSizeInGB = totalSize / 1024; // Convert MB to GB
    stopLoader(loader);
    console.log(`Total Playlist Size: ${totalSizeInGB.toFixed(2)} GB`);
    console.log(`Total Playlist Time: ${formatTime(totalDuration)}`);

    const speeds = [1, 1.25, 1.5, 1.75, 2];
    speeds.forEach((speed) => {
      const adjustedTime = totalDuration / speed;
      console.log(
        `Total Playlist Time at ${speed}x speed: ${formatTime(adjustedTime)}`
      );
    });
  } catch (error) {
    stopLoader(loader);
    console.error("Error:", error.message);
  }
}

// Example usage
const playlistUrl =
  "https://youtube.com/playlist?list=PLesfn4TAj57WJFn86KXOInQAsCdJlp6vl&si=dchPnBhYbYks0gwr";
const apiKey = "AIzaSyCx2gkxCVPhzTsFtc4HYMYcislVVzRpW5I";
getPlaylistSizeAndTime(playlistUrl, apiKey);
