import React, { useState } from "react";
import { Line} from 'rc-progress';


const AutoMemeGenerator = () => {
  const [input, setInput] = useState("");
  const [memeCount, setMemeCount] = useState(0);
  const [generatedMeme, setGeneratedMeme] = useState(null);

  // Fetch memes from Google Drive with the keyword in the name
  const fetchMemesFromDrive = async (keywords) => {
    const folderId = "1y6vnmGJirAOOlyv_2b3rgy-5nW95DPT4"; // Replace with your folder ID
    const apiKey = "AIzaSyDdy9EebzUeZYBt6ERb_m_3vo0d9bFqHPs"; // Replace with your API key

    let allFiles = [];

    // For each word in the keywords array, search Google Drive for matching files
    for (let keyword of keywords) {
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name+contains+'${keyword}'&key=${apiKey}&fields=files(id,name,mimeType)`;
      const response = await fetch(url);
      const data = await response.json();

      // Filter out non-image files
      const imageFiles = data.files.filter(file => file.mimeType.startsWith("image/"));
      allFiles = [...allFiles, ...imageFiles];
    }

    if (allFiles.length > 0) {
      // Randomly select a meme from the collected files
      const randomImage = allFiles[Math.floor(Math.random() * allFiles.length)];
      // Use the file ID to construct the direct URL
      // const imageUrl = `http://localhost:4000/proxy-image?id=${randomImage.id}`;
    //   const imageUrl = `https://stonks-backend-sandy.vercel.app/api/proxy-image?id=${randomImage.id}`;
      const imageUrl = `https://stonks-backend-sandy.vercel.app/api/proxy-image?id=${randomImage.id}&t=${new Date().getTime()}`;

      console.log(imageUrl)
      const caption = `When "${keywords.join(', ')}" happens...`;

      // Set meme from Google Drive
      setGeneratedMeme({
        url: imageUrl,
        text: caption,
        source: "drive", // Indicate source is from Google Drive
      });
    } else {
      console.log("No matching image found.");
    }
    setInput("")
  };

  // Fetch memes from the external API (e.g., Imgflip)
  // const fetchMemeFromAPI = async (keywords) => {
  //   const response = await fetch("https://api.imgflip.com/get_memes");
  //   const data = await response.json();
    
  //   // Filter memes based on keyword in the name
  //   const filteredMemes = data.data.memes.filter(meme =>
  //     keywords.some(keyword => meme.name.toLowerCase().includes(keyword.toLowerCase()))
  //   );

  //   if (filteredMemes.length > 0) {
  //     const template = filteredMemes[Math.floor(Math.random() * filteredMemes.length)];
  //     const caption = `When "${keywords.join(', ')}" happens...`;

  //     // Set meme from API
  //     setGeneratedMeme({
  //       url: template.url,
  //       text: caption,
  //       source: "api", // Indicate source is from Imgflip API
  //     });
  //   } else {
  //     console.log("No matching memes found.");
  //   }
  // };

  // Combined function to fetch meme (either from Google Drive or API)
  const fetchMeme = async () => {
    const inputWords = input.trim().split(/\s+/); // Split input into words based on whitespace
    if (inputWords.length === 0) {
      alert("Please enter a valid keyword");
      return;
    }

    // Call both functions with the list of keywords (words from the input)
    // if (Math.random() > 0.5) { // Randomly decide which source to fetch from
    //   fetchMemeFromAPI(inputWords);
    // } else {
    //   fetchMemesFromDrive(inputWords);
    // }
    fetchMemesFromDrive(inputWords)
    setMemeCount(memeCount + 1); // Always increase the meter regardless of the input
  };

  const getBrainrotLabel = (count) => {
    switch (true) {
      case count <= 5:
        return "noob peasant";
      case count <= 10:
        return "Bussin' content. u GYATT to make more!";
      case count <= 15:
        return "Blud thinks he's Carti";
      case count <= 20:
        return "Chat is this real? Bro is COOKED";
      case count <= 25:
        return "If u produced this much, just put the fries in the bag lil bro 😭";
      case count <= 30:
        return "Memes are Life";
      case count <= 35:
        return "Meme Fiend";
      case count <= 40:
        return "The Memerati";
      case count <= 450:
        return "Skibidi memer";
      default:
        return "The Rizzler type shi";
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold ">Meme Out Your Way</h1>
      <p>Whatever situation you are in, there's always a meme for that.</p>
      <input
        type="text"
        placeholder="What's the situation?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border rounded p-2 w-full"
      />
      <button
        onClick={fetchMeme}
        className="bg-purple-600 text-white rounded p-2 mt-2"
      >
        Generate Meme
      </button>
      {generatedMeme && (
        <div className="mt-4 flex justify-center flex-col border border-red-600">
          <img src={generatedMeme.url} alt="Generated Meme" className="m-auto" height={200} width={500} onError={() => console.log("Failed to load image")}/>
          <p className="text-center mt-2 font-bold">{generatedMeme.text}</p>
          <p className="text-center text-sm">Source: {generatedMeme.source === "drive" ? "Yo mama" : "some random public APIs"}</p>
        </div>
      )}
      <div className="text-center mt-4">
        <p className="text-lg font-semibold">Brainrot Meter: {memeCount}</p>
        <Line percent={memeCount} strokeWidth={1} strokeColor="#D3D3D3" />
        <p className="text-sm text-gray-600">
          Status: {getBrainrotLabel(memeCount)}
        </p>
      </div>
    </div>
  );
};

export default AutoMemeGenerator;
