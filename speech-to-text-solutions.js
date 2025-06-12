// Option 1: Web Speech API (Browser-based)
const extractSpeechWebAPI = async (videoBlob) => {
  return new Promise((resolve, reject) => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    // Extract audio from video
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoBlob);
    video.muted = false;

    let transcript = "";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
    };

    recognition.onend = () => resolve(transcript.trim());
    recognition.onerror = (error) => reject(error);

    // Start recognition when video plays
    video.onloadeddata = () => {
      video.play();
      recognition.start();
    };
  });
};

// Option 2: Google Speech-to-Text API
const extractSpeechGoogleAPI = async (videoBlob) => {
  // First extract audio from video
  const audioBlob = await extractAudioFromVideo(videoBlob);

  // Convert to base64
  const audioBase64 = await blobToBase64(audioBlob);

  const response = await fetch("/api/speech-to-text/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      audio: { content: audioBase64 },
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-US",
      },
    }),
  });

  const result = await response.json();
  return result.results.map((r) => r.alternatives[0].transcript).join(" ");
};

// Option 3: Azure Speech Services
const extractSpeechAzureAPI = async (videoBlob) => {
  const audioBlob = await extractAudioFromVideo(videoBlob);

  const response = await fetch("/api/speech-to-text/azure", {
    method: "POST",
    headers: {
      "Content-Type": "audio/wav",
      Authorization: `Bearer ${azureToken}`,
    },
    body: audioBlob,
  });

  const result = await response.json();
  return result.DisplayText;
};

// Utility function to extract audio from video
const extractAudioFromVideo = async (videoBlob) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const audioContext = new AudioContext();

    video.src = URL.createObjectURL(videoBlob);
    video.onloadeddata = async () => {
      const source = audioContext.createMediaElementSource(video);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);

      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        resolve(audioBlob);
      };

      mediaRecorder.start();
      video.play();

      video.onended = () => mediaRecorder.stop();
    };
  });
};

// Utility function to convert blob to base64
const blobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });
};
