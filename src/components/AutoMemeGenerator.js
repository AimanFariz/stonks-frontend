import React, { useState, useRef } from "react";
import {Typewriter} from "react-simple-typewriter"
import {Line } from "rc-progress";
import { toPng } from 'html-to-image';
import { exportComponentAsPNG } from "react-component-export-image";
import html2canvas from "html2canvas"; // Import html2canvas

const AutoMemeGenerator = () => {
  const [input, setInput] = useState("");
  const [memeCount, setMemeCount] = useState(0);
  const [generatedMeme, setGeneratedMeme] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Track image loading status

  const audios = [
    "../audios/Anime.mp3",
    "../audios/Bruh.mp3",
    "../audios/Cash.mp3",
    "../audios/Cheer.mp3",
    "../audios/MarioJump.mp3",
    "../audios/MetalGear.mp3",
    "../audios/haiya.mp3",
    "../audios/Don_Pollo_1.mp3"
  ];
  const images = [
    "../image/don-arrow.jpg",
    "../image/don-asi-no.jpg",
    "../image/don-call.jpg",
    "../image/don-calll.jpg",
    "../image/don-crown.jpg",
    "../image/don-eyes.jpg",
    "../image/don-stretch.webp",
    "../image/kai-tweak.jpg",
    "../image/speed-huh.jpg",

  ]

  const playRandomAudio = () => {
    // Pick a random audio from the array
    const randomAudio = audios[Math.floor(Math.random() * audios.length)];
    // Create a new Audio object and play the selected audio
    const audio = new Audio(randomAudio);
    audio.volume = 0.5;
    audio.play();
  };
  const memeRef = useRef(null);
  const handleImageLoad = () => {
    setIsImageLoaded(true); // Set the state when the image is loaded
  };
  // const handleExport = () => {
  //   if (memeRef.current) {
  //     // Use html2canvas to capture the content of memeRef
  //     // console.log(memeRef.current)
  //     html2canvas(memeRef.current)
  //       .then((canvas) => {
  //         // Convert the canvas to an image URL
  //         const dataUrl = canvas.toDataURL("image/png");

  //         // Create an invisible link to trigger download
  //         const link = document.createElement("a");
  //         link.download = "stonks-meme.png";
  //         link.href = dataUrl;
  //         link.click();
  //       })
  //       .catch((error) => {
  //         console.error("Error exporting meme:", error);
  //       });
  //   } else {
  //     console.error("Meme container not found!");
  //   }
  // };

  const fetchMemesFromDrive = async (keywords) => {
    const folderId = "1y6vnmGJirAOOlyv_2b3rgy-5nW95DPT4" || "1HA9w4OwQvbPb_-RgcfNRwp0WbpzbSah0";
    const apiKey = "AIzaSyDdy9EebzUeZYBt6ERb_m_3vo0d9bFqHPs";
    let allFiles = [];
    setLoading(true); // Start loading

    for (let keyword of keywords) {
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name+contains+'${keyword}'&key=${apiKey}&fields=files(id,name,mimeType)`;
      const response = await fetch(url);
      const data = await response.json();

      const imageFiles = data.files.filter((file) => file.mimeType.startsWith("image/"));
      allFiles = [...allFiles, ...imageFiles];
    }

    if (allFiles.length > 0) {
      const randomImage = allFiles[Math.floor(Math.random() * allFiles.length)];
      const imageUrl = `https://stonks-back.vercel.app/api/proxy-image?id=${randomImage.id}&t=${new Date().getTime()}`;
      const caption = `When "${keywords.join(", ")}" happens...`;

      setGeneratedMeme({
        // switch(url:){
        // case for each language
        // }
        url: imageUrl,
        text: caption,
        source: "drive",
      });
    } else {
      console.log("No matching image found.");
    }

    setLoading(false); // End loading
    setInput("");
  };
  function showFlyingText(text) {
    const container = document.getElementById('flying-text-container');
    const flyingText = document.createElement('div');

    // Set text content and styles
    flyingText.textContent = text;
    flyingText.style.position = 'absolute';
    flyingText.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color
    flyingText.style.fontSize = `${Math.random() * 20 + 20}px`; // Random font size
    flyingText.style.fontWeight = 'bold';
    flyingText.style.zIndex = '1000';

    // Random start position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    flyingText.style.left = `${startX}px`;
    flyingText.style.top = `${startY}px`;

    // Append to container
    container.appendChild(flyingText);
  
    // Animate the text
    const animationDuration = 1000; // 1 second
    flyingText.animate(
      [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-100px)', opacity: 0 },
      ],
      {
        duration: animationDuration,
        easing: 'ease-out',
      }
    );
  
    // Remove text after animation
    setTimeout(() => {
      container.removeChild(flyingText);
    }, animationDuration);
  }
  function showFlyingImage(imageUrl) {
    const container = document.getElementById('flying-text-container'); 
    const flyingImage = document.createElement('img');

    // Set image source and styles
    flyingImage.src = imageUrl;
    flyingImage.style.position = 'absolute';
    flyingImage.style.width = `${Math.random() * 100 + 100}px`; // Random width between 50px and 150px
    flyingImage.style.zIndex = '1000';

    // Random start position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    flyingImage.style.left = `${startX}px`;
    flyingImage.style.top = `${startY}px`;

    // Append to container
    container.appendChild(flyingImage);

    // Animate the image
    const animationDuration = 1500; // 1.5 seconds
    flyingImage.animate(
        [
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-100px)', opacity: 0 },
        ],
        {
            duration: animationDuration,
            easing: 'ease-out',
        }
    );

    // Remove image after animation
    setTimeout(() => {
        container.removeChild(flyingImage);
    }, animationDuration);
}

  const fetchMeme = async () => {
    const inputWords = input.trim().split(/\s+/);
    if (inputWords.length === 0) {
      alert("Please enter a valid keyword");
      return;
    } else {
      // alert(`${memeCount - 1} iq points`); this shi annoying af for the UX, so I took it out lol
      showFlyingText(`${memeCount - 1} iq points`)
      const randomImg = images[Math.floor(Math.random() * images.length)];
      showFlyingImage(randomImg);
    }

    fetchMemesFromDrive(inputWords);
    setMemeCount(memeCount - 1);
    playRandomAudio();
  };

  const getBrainrotLabel = (count) => {
    switch (true) {
      case count >= -5:
        return "Baby gronk";
      case count >= -10:
        return "I ain't tryna glaze, but ur COOKING";
      case count >= -15:
        return "Bro thinks he's Carti";
      case count >= -20:
        return "Certified Yapper";
      case count >= -25:
        return "If u produced this much, just put the fries in the bag lil bro 😭";
      case count >= -40:
        return "u GYATT to make more 🗿";
      case count >= -50:
        return "approved for the tik tok rizz party";
      default:
        return "Sigma Grindset";
    }
  };


  return (
    <div className="px-5 pt-20 overflow-auto h-screen flex-grow bg-gradient-to-r from-slate-700 via-gray-900 to-slate-700 text-white flex flex-col">

      <div className="py-5">
      <h1 className="text-xl font-bold text-yellow-300" style={{fontFamily:"monospace"}}>Find Your Meme</h1>
      <span className="text-white">
      <Typewriter
         words = {[
          "Crashing out over your classes? ",
          "Tired of hearing your boss yap? ",
          "Mind went blank while flirting? ",
          "Need a meme break in between shifts? ",
          "Can't handle that group project anymore? ",
          "Your sports team loses (again)? ",
          "Have trouble sleeping? ",
          "Just got roasted by your friend again? ",
          "Trying to adult but everything’s a mess? ",
          "Just got dumped by the love of your life? "
        ]}
        loop={false}
        cursor
        cursorStyle='☝️🤓'
        typeSpeed={20}
        deleteSpeed={40}
        delaySpeed={2000}
        />
         There will always be a meme for that.
      </span>
      </div>
      
      <div className="w-3/4 flex flex-col" style={{margin:'0 auto'}}>
      <input
        type="text"
        placeholder="What's the situation?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border rounded p-2 w-full text-gray-500"
      />

      <button
        onClick={fetchMeme}
        className="bg-purple-600 text-white rounded p-3 mt-2"
        disabled={loading} // Disable button while loading
      >
        {loading ? "Loading..." : "Generate Meme"}
      </button>
      </div>

      {loading && (
        <div className="flex justify-center mt-4">
          {/* Spinner or Animation */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-cyan-400"></div>
        </div>
      )}

      {generatedMeme && !loading && (
        <div
        className="mt-4 flex justify-center flex-col border border-cyan-600"
        >
          <img
            src={generatedMeme.url}
            ref={memeRef}
            alt="Generated Meme"
            className="m-auto object-cover"
            height={200}
            width={300}
            onLoad={handleImageLoad}
            onError={() => console.log("Failed to load image")}
          />
        </div>
      )}
      {/* <p className="text-center mt-2 font-bold">{generatedMeme.text}</p>
          <p className="text-center text-sm">
            Source: {generatedMeme.source === "drive" ? "Yo mama's hard drive" : "some random public APIs"}
          </p> */}

      <div id="flying-text-container">
        <p className="text-lg p-5 font-semibold text-white">IQ Points: {memeCount}</p>
        <div style={{ width: "300px", margin: "0 auto" }}>
        <Line percent={Math.abs(memeCount)} strokeWidth={1} strokeColor="#3b82f6"
          style={{
            transform: "rotateY(180deg)",
            animation: "ease-in-out"
          }}/>
          <p className="text-cyan-400 p-3">
          <span className="text-white">Level:</span> {getBrainrotLabel(memeCount)}
        </p>
        </div>
        {generatedMeme?
        <a className="bg-green-600 text-white px-4 py-2 mt-4" target="__blank" href="https://drive.google.com/file/d/1AjHca3ziekcFfpWYxETU6OET5U6CkYI1/view?usp=sharing">Export Meme</a>:null}
      </div>
      <footer className="p-20 flex flex-col justify-end items-center h-full">
        <p className="">Empowering 𝓯𝓻𝓮𝓪𝓴𝔂𝓷𝓮𝓼𝓼 👅 on <span className='font-mono'>teh interwebz</span>, one brainrot at a time.</p>
        <p>Made during a very chilly and lonely Thanksgiving break in 2024 by <a target="_blank" href='https://www.instagram.com/aimanfz05/' className='underline'>The Rizzler himself</a></p>
      </footer>
<p className="italic text-xs py-2">Disclaimer: The purpose of this website is to spread positivity and for fun. If you find any memes offensive, it ain't my problem that you're soft. just suck it up, say womp womp, and move on.</p>

    </div>
  );
};

export default AutoMemeGenerator;
