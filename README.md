# YouTube Playlist Analyzer

This project provides an API to analyze YouTube playlists. It fetches the details of all videos in a playlist, calculates the total size and duration of the playlist, and provides adjusted times for different playback speeds.

## Features

- Fetches video details from a YouTube playlist using the YouTube Data API.
- Estimates the total size and duration of the playlist.
- Provides adjusted playback times for different speeds (1x, 1.25x, 1.5x, 1.75x, 2x).

## Prerequisites

- Node.js
- npm (Node Package Manager)
- A valid YouTube Data API key

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/playlist-youtube.git
   cd playlist-youtube
    ```
2. Install the dependencies:

   ```sh
   npm install
   ```
   ## Usage
   1. Set the YouTube Data API key in the `.env` file:

   ```sh
    echo "YOUTUBE_API_KEY=YOUR_API_KEY" > .env
    ``` 
    2. Run the application:

    ```sh
    npm start
    ```
    3. Open the following URL in your browser:

    ```
    http://localhost:3000
    ```
    4. Enter the YouTube playlist ID and click the "Analyze" button.

    ![Screenshot](screenshot.png)

    ## Project Structure

    - `playlist-youtube/`
        - `index.js`: The main file that contains the Express application.
        - `routes/`: Contains the route handlers for the application.
        - `services/`: Contains the service functions that interact with the YouTube Data API.
        - `views/`: Contains the HTML templates for the application.
        - `.env.example`: Example file for setting environment variables.
        - `package.json`: Contains the project dependencies and scripts.
        - `README.md`: Project documentation.
        