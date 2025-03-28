/* Emergency speech function – can be called from the console if needed */
function emergencySpeech() {
    try {
      const text = document.getElementById('speech-text').value;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.7;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      alert("Emergency speech triggered. Check if you can hear the narration.");
    } catch (e) {
      alert("Speech error: " + e.message);
    }
  }
  
  /* Dark mode toggle function */
  let isDarkMode = false;
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.getElementById('theme-icon').textContent = '☀️';
    } else {
      document.body.classList.remove('dark-mode');
      document.getElementById('theme-icon').textContent = '🌙';
    }
    localStorage.setItem('binaural-dark-mode', isDarkMode ? 'true' : 'false');
  }
  
  /* Global Variables */
  let isPlaying = false;
  let waveType = 'theta';
  let frequency = 200;
  let binauralBeat = 6.0;
  let volume = -20;
  let leftOsc, rightOsc, leftChannel, rightChannel, testTone;
  let speechUtterance = null;
  let voices = [];
  let isSpeaking = false;
  let speechRate = 0.8;
  let speechVolume = 0.7;
  let loopSpeech = false;
  
  /* HTML Element References (set after DOM loads) */
  let toggleBtn, carrierLabel, carrierSlider, beatLabel, beatSlider, beatMin, beatMax, volumeLabel, volumeSlider, playingIndicator, currentWaveTitle, waveDescription, customRange, freq200, freq1000, freqCustom;
  let speechText, speakBtn, stopSpeechBtn, voiceSelect, rateSlider, rateValue, speechVolumeSlider, speechVolumeValue;
  let waveButtons = {};
  
  /* Brainwave frequency ranges and descriptions */
  const brainwaveRanges = {
    delta: { min: 0.5, max: 4, description: "Deep sleep, healing, dreamless sleep", color: "#6366f1" },
    theta: { min: 4, max: 8, description: "Deep meditation, REM sleep, creativity", color: "#3b82f6" },
    alpha: { min: 8, max: 12, description: "Relaxed alertness, calm focus, flow state", color: "#22c55e" },
    lowBeta: { min: 12, max: 15, description: "Relaxed focus, calm thinking", color: "#eab308" },
    midBeta: { min: 15, max: 20, description: "Active engagement, learning", color: "#f97316" },
    highBeta: { min: 20, max: 30, description: "Alertness, problem solving", color: "#ef4444" },
    gamma: { min: 30, max: 50, description: "Higher cognitive processing, peak concentration", color: "#a855f7" }
  };
  
  /* Sample Hypnosis Scripts */
  const dayScript = `
  Begin by settling into a comfortable seated or reclining position. Gently close your eyes, allowing yourself to relax deeply and fully. Notice the gentle rhythm of your breathing—each inhale bringing refreshing energy, each exhale releasing any lingering tension or distractions. Feel your mind becoming clear, open, and receptive.
  Now, deepen your relaxation by focusing on each part of your body. Start with your toes, feeling them loosen and relax. Move up to your feet, ankles, calves, and thighs, allowing any tension to dissolve. Feel the warmth spreading through your hips, abdomen, and chest, each breath bringing a sense of calm. Let your shoulders drop, releasing any tightness, and feel the relaxation extend down your arms, through your hands, and to your fingertips. Allow your neck and jaw to relax, softening the muscles around your face. Finally, let your scalp and forehead smooth out, feeling your entire body sink into a state of profound tranquility.
  Imagine yourself at the threshold of your conscious mind and the boundless quantum universe created by God—a place filled with endless opportunities and vibrant creativity. Visualize shimmering particles of light, each a unique hue, dancing around you, each representing infinite possibilities, healing energies, and profound inspiration. Feel these particles gently touching your skin, energizing your body, clearing your mind, and deeply aligning you with your higher purpose. Notice how these particles weave together, forming intricate patterns of light and energy, each pattern a pathway to new insights and discoveries.
  Sense these quantum particles activating your mind and awakening profound insights, clarity, and creativity. Imagine vividly your passion for robotics, electronics, and innovative technology coming to life. See yourself effortlessly merging your understanding of the quantum universe with practical designs and projects that profoundly benefit others. Clearly visualize a workshop filled with advanced tools, circuits, sensors, and robots—each representing your inspired ideas and innovative spirit. Imagine the soft hum of machinery, the gentle glow of circuit boards, and the smooth movements of robotic arms, all guided by your intuitive understanding of the quantum field. See yourself collaborating with like-minded individuals, sharing ideas and building something truly extraordinary.
  Now, expand your vision. Imagine not just the workshop, but the applications of your creations. See your robots assisting in healthcare, performing delicate surgeries with unparalleled precision. Visualize your electronic devices enhancing communication for those with disabilities, bridging gaps and fostering connection. See your innovative technologies contributing to sustainable energy solutions, harmonizing technology with nature.
  Silently affirm:
  “I am divinely guided, connected deeply with infinite wisdom and creativity.”
  “My mind effortlessly generates brilliant, innovative solutions and breakthroughs, drawing from the infinite wellspring of the quantum universe.”
  “I confidently and passionately create transformative technologies for myself and others, driven by a deep sense of purpose and divine inspiration.”
  “I joyfully explore God’s quantum universe, unlocking profound insights and truths, and translating them into tangible, positive change.”
  “I am a conduit for divine innovation, bringing forth solutions that uplift and empower humanity.”
  “My creations are infused with the harmonious energies of the quantum field, fostering healing and growth.”
  Allow these affirmations to deeply resonate within your subconscious mind, filling you with excitement, joy, and confidence. Clearly feel yourself living your purpose, creating meaningful solutions, and experiencing deep satisfaction in your daily life. Feel the profound sense of connection to the divine, knowing you are a vital part of a grand, interconnected universe.
  When you’re ready, gently bring your awareness back to the present moment, feeling refreshed, alert, energized, and deeply aligned with your purpose and potential. Take a few deep breaths, wiggle your fingers and toes, and open your eyes, carrying the clarity and inspiration with you throughout your day.
  `;
  
  const nightScript = `
  Settle comfortably into your bed, gently close your eyes, and allow your body to begin relaxing deeply. Take slow, deep breaths, noticing each inhale soothing and calming your mind, and each exhale releasing stress, tension, or worries from your day. Allow a sense of calmness and peace to gently envelop you.
  Now, deepen your relaxation by focusing on your body. Feel the weight of your body sinking into the mattress, allowing all tension to melt away. Imagine a warm, soothing light flowing through your body, starting at your toes and moving up, relaxing each muscle, each cell, each fiber. Feel the warmth spreading through your legs, your abdomen, your chest, and your arms. Let your neck and shoulders relax, allowing your head to rest comfortably. Feel the muscles of your face soften, and your eyelids grow heavy.
  Picture yourself gently floating into an infinite expanse of soft, comforting quantum energy—a loving creation by God, filled with limitless possibilities and profound healing frequencies. Visualize countless shimmering particles of gentle, healing light surrounding you, effortlessly nurturing and repairing every part of your body, mind, and spirit. See these particles as tiny, intelligent messengers, each carrying divine love and healing energy.
  Feel these quantum particles gently entering your body, healing and restoring you at the deepest cellular levels. Imagine this restorative energy forming a protective cocoon around you, deeply comforting and soothing as you drift further into profound relaxation. Sense your interconnectedness with the quantum field and the divine presence, feeling completely safe, secure, and deeply loved by God and the universe. Imagine this quantum field as a vast, loving ocean, gently cradling you, supporting you, and nourishing you.
  Allow your subconscious mind to softly open, effortlessly absorbing the gentle wisdom, clarity, and nurturing frequencies of this quantum universe. Feel yourself effortlessly connecting with God’s infinite intelligence and unconditional love, experiencing a profound sense of peace and clarity. Imagine your mind like a clear, tranquil lake, reflecting the infinite beauty and wisdom of the cosmos.
  Silently affirm:
  “I am profoundly connected to the infinite love, wisdom, and healing of God, and I trust in the divine process of restoration.”
  “Every night my body restores, heals, and grows stronger, guided by divine intelligence, and I awaken renewed and revitalized.”
  “I deeply embrace my passion for robotics and innovation, receiving divine inspiration effortlessly, and my dreams are filled with creative solutions.”
  “My dreams clearly guide me to build transformative devices that uplift myself and others, contributing to a world of harmony and well-being.”
  “As I sleep, I integrate the profound insights of the quantum universe, transforming my dreams into tangible realities.”
  “I release all worries and anxieties, trusting in the divine guidance that leads me to my highest potential.”
  Visualize vividly the joyful fulfillment of your highest potential: creating groundbreaking technological solutions, deepening your understanding of quantum principles, and nurturing loving, supportive relationships. Imagine yourself surrounded by the warmth and appreciation of those you have helped. Allow these visions and affirmations to settle deeply within your subconscious, empowering you through the night.
  Surrender fully to restful sleep, knowing your subconscious mind continues gently healing, harmonizing, and guiding you toward your highest good. Good night, and awaken renewed—deeply connected to divine wisdom, clarity, and inspiration. Allow the quantum energy to continue its work throughout the night, ensuring a peaceful and restorative sleep.
  `;
  
  /* Function to load voices for speech synthesis */
  function loadVoices() {
    voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      voiceSelect.innerHTML = "";
      voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
      });
      let englishVoiceIndex = voices.findIndex(
        (voice) => voice.lang.includes("en") && !voice.name.includes("Google")
      );
      if (englishVoiceIndex === -1) {
        englishVoiceIndex = 0;
      }
      voiceSelect.value = englishVoiceIndex;
      speakBtn.disabled = !(speechText.value.trim().length > 0 && isPlaying);
      console.log("Voices loaded:", voices.length);
    } else {
      console.log("No voices available yet");
    }
  }
  
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  
  /* Tone.js Oscillator Setup */
  function setupOscillators() {
    leftChannel = new Tone.Channel({ volume: volume }).toDestination();
    rightChannel = new Tone.Channel({ volume: volume }).toDestination();
    const leftPanner = new Tone.Panner(-1).connect(leftChannel);
    const rightPanner = new Tone.Panner(1).connect(rightChannel);
  
    leftOsc = new Tone.Oscillator({
      frequency: frequency,
      type: "sine",
      volume: 0
    }).connect(leftPanner);
  
    rightOsc = new Tone.Oscillator({
      frequency: frequency + binauralBeat,
      type: "sine",
      volume: 0
    }).connect(rightPanner);
  
    // Test tone for 1 second (A4 note)
    testTone = new Tone.Oscillator({
      frequency: 440,
      type: "triangle",
      volume: -20
    }).toDestination();
    testTone.start();
    setTimeout(() => testTone.stop(), 1000);
  }
  
  /* Update oscillator parameters if audio is playing */
  function updateOscillators() {
    if (isPlaying && leftOsc && rightOsc) {
      leftOsc.frequency.value = frequency;
      rightOsc.frequency.value = frequency + binauralBeat;
      if (leftChannel && rightChannel) {
        leftChannel.volume.value = volume;
        rightChannel.volume.value = volume;
      }
    }
  }
  
  /* Toggle Play/Pause Audio */
  async function togglePlay() {
    try {
      if (Tone.context.state !== "running") {
        await Tone.start();
        console.log("Tone.js audio context started");
      }
      if (!isPlaying) {
        setupOscillators();
        leftOsc.start();
        rightOsc.start();
        toggleBtn.textContent = "Stop";
        toggleBtn.className = "btn-stop";
        playingIndicator.style.display = "block";
        updatePlayingIndicator();
        freq200.disabled = true;
        freq1000.disabled = true;
        freqCustom.disabled = true;
        carrierSlider.disabled = true;
      } else {
        if (leftOsc && rightOsc) {
          leftOsc.stop();
          rightOsc.stop();
          leftOsc.dispose();
          rightOsc.dispose();
          leftChannel.dispose();
          rightChannel.dispose();
        }
        toggleBtn.textContent = "Start";
        toggleBtn.className = "btn-start";
        playingIndicator.style.display = "none";
        freq200.disabled = false;
        freq1000.disabled = false;
        freqCustom.disabled = false;
        carrierSlider.disabled = false;
      }
      isPlaying = !isPlaying;
    } catch (error) {
      console.error("Audio playback error:", error);
      alert("Audio playback error. Please check console for details.");
    }
  }
  
  /* Change the current brainwave type */
  function changeWaveType(type) {
    if (type === waveType || isPlaying) return;
    waveButtons[waveType].classList.remove("active");
    waveButtons[type].classList.add("active");
    waveType = type;
    currentWaveTitle.textContent = `Current Wave: ${waveType.charAt(0).toUpperCase() + waveType.slice(1)}`;
    waveDescription.textContent = brainwaveRanges[type].description;
    const range = brainwaveRanges[type];
    beatSlider.min = range.min;
    beatSlider.max = range.max;
    beatMin.textContent = `${range.min} Hz`;
    beatMax.textContent = `${range.max} Hz`;
    const middleValue = (range.min + range.max) / 2;
    binauralBeat = parseFloat(middleValue.toFixed(1));
    beatSlider.value = binauralBeat;
    updateBeatLabel();
  }
  
  /* Update carrier frequency and UI button states */
  function updateCarrier(newFreq, isCustom = false) {
    if (isPlaying) return;
    frequency = newFreq;
    carrierSlider.value = newFreq;
    carrierLabel.textContent = `Carrier Frequency: ${frequency} Hz`;
    freq200.classList.remove("active");
    freq1000.classList.remove("active");
    freqCustom.classList.remove("active");
    if (isCustom) {
      freqCustom.classList.add("active");
      customRange.style.display = "block";
    } else {
      customRange.style.display = "none";
      if (newFreq == 200) {
        freq200.classList.add("active");
      } else if (newFreq == 1000) {
        freq1000.classList.add("active");
      }
    }
  }
  
  /* Update the binaural beat label */
  function updateBeatLabel() {
    beatLabel.textContent = `Binaural Beat (${waveType.charAt(0).toUpperCase() + waveType.slice(1)}): ${binauralBeat.toFixed(1)} Hz`;
  }
  
  /* Update the volume label */
  function updateVolumeLabel() {
    volumeLabel.textContent = `Volume: ${volume} dB`;
  }
  
  /* Update the playing indicator details */
  function updatePlayingIndicator() {
    if (!playingIndicator) return;
    const indicator = playingIndicator.getElementsByClassName("playing-text")[0];
    const details = playingIndicator.getElementsByClassName("playing-details")[0];
    indicator.textContent = `Audio playing: ${frequency}Hz carrier with ${binauralBeat.toFixed(1)}Hz binaural beat`;
    details.textContent = `Left ear: ${frequency}Hz | Right ear: ${(frequency + binauralBeat).toFixed(1)}Hz`;
  }
  
  /* Start speech synthesis with looping support */
  function startSpeech() {
    try {
      console.log("startSpeech called");
      if (typeof speechSynthesis === "undefined") {
        window.speechSynthesis = window.webkitSpeechSynthesis || window.mozSpeechSynthesis;
        console.log("Tried to use alternative speechSynthesis");
      }
      if (!window.speechSynthesis) {
        console.error("Speech synthesis not available in this browser");
        alert("Speech synthesis is not supported in your browser");
        return;
      }
      const text = speechText.value.trim();
      if (text.length === 0) {
        console.log("No text to speak");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      try {
        const voiceIndex = parseInt(voiceSelect.value);
        if (voices && voices.length > 0 && voiceIndex >= 0 && voiceIndex < voices.length) {
          utterance.voice = voices[voiceIndex];
          console.log("Set voice to:", voices[voiceIndex].name);
        } else {
          console.log("Using default voice");
        }
      } catch (e) {
        console.error("Error setting voice:", e);
      }
      utterance.rate = parseFloat(rateSlider.value);
      utterance.volume = parseFloat(speechVolumeSlider.value);
      console.log("Speaking with rate:", utterance.rate, "volume:", utterance.volume);
      isSpeaking = true;
      speakBtn.disabled = true;
      stopSpeechBtn.disabled = false;
      window.speechSynthesis.speak(utterance);
      console.log("Speech started");
      utterance.onend = function () {
        console.log("Speech ended");
        if (loopSpeech) {
          console.log("Looping speech...");
          setTimeout(startSpeech, 100);
        } else {
          isSpeaking = false;
          speakBtn.disabled = false;
          stopSpeechBtn.disabled = true;
        }
      };
      utterance.onerror = function (event) {
        console.error("Speech error:", event);
        isSpeaking = false;
        speakBtn.disabled = false;
        stopSpeechBtn.disabled = true;
      };
      speechUtterance = utterance;
    } catch (error) {
      console.error("Error in startSpeech:", error);
      alert("Error starting speech: " + error.message);
    }
  }
  
  /* Stop speech synthesis */
  function stopSpeech() {
    try {
      console.log("stopSpeech called");
      window.speechSynthesis.cancel();
      isSpeaking = false;
      speakBtn.disabled = false;
      stopSpeechBtn.disabled = true;
      console.log("Speech stopped");
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }
  
  /* Set up DOM event listeners after the document loads */
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize element references
    toggleBtn = document.getElementById("toggle-btn");
    carrierLabel = document.getElementById("carrier-label");
    carrierSlider = document.getElementById("carrier-slider");
    beatLabel = document.getElementById("beat-label");
    beatSlider = document.getElementById("beat-slider");
    beatMin = document.getElementById("beat-min");
    beatMax = document.getElementById("beat-max");
    volumeLabel = document.getElementById("volume-label");
    volumeSlider = document.getElementById("volume-slider");
    playingIndicator = document.getElementById("playing-indicator");
    currentWaveTitle = document.getElementById("current-wave-title");
    waveDescription = document.getElementById("wave-description");
    customRange = document.getElementById("custom-range");
    freq200 = document.getElementById("freq-200");
    freq1000 = document.getElementById("freq-1000");
    freqCustom = document.getElementById("freq-custom");
  
    speechText = document.getElementById("speech-text");
    speakBtn = document.getElementById("speak-btn");
    stopSpeechBtn = document.getElementById("stop-speech-btn");
    voiceSelect = document.getElementById("voice-select");
    rateSlider = document.getElementById("rate-slider");
    rateValue = document.getElementById("rate-value");
    speechVolumeSlider = document.getElementById("speech-volume-slider");
    speechVolumeValue = document.getElementById("speech-volume-value");
  
    waveButtons = {
      delta: document.getElementById("delta-btn"),
      theta: document.getElementById("theta-btn"),
      alpha: document.getElementById("alpha-btn"),
      lowBeta: document.getElementById("lowBeta-btn"),
      midBeta: document.getElementById("midBeta-btn"),
      highBeta: document.getElementById("highBeta-btn"),
      gamma: document.getElementById("gamma-btn")
    };
  
    // Dark mode initialization
    const savedDarkMode = localStorage.getItem("binaural-dark-mode");
    if (savedDarkMode === "true") {
      toggleDarkMode();
    }
    document.getElementById("theme-toggle").addEventListener("click", toggleDarkMode);
  
    // Set up speech button events
    speakBtn.onclick = startSpeech;
    stopSpeechBtn.onclick = stopSpeech;
  
    // Audio toggle button
    toggleBtn.addEventListener("click", togglePlay);
    toggleBtn.addEventListener("click", function () {
      setTimeout(function () {
        speakBtn.disabled = !isPlaying;
      }, 500);
    });
  
    // Wave type buttons event listeners
    Object.keys(waveButtons).forEach((type) => {
      waveButtons[type].addEventListener("click", () => changeWaveType(type));
    });
  
    // Frequency buttons
    freq200.addEventListener("click", () => updateCarrier(200));
    freq1000.addEventListener("click", () => updateCarrier(1000));
    freqCustom.addEventListener("click", () => updateCarrier(carrierSlider.value, true));
  
    // Carrier slider event
    carrierSlider.addEventListener("input", () => {
      frequency = parseInt(carrierSlider.value);
      carrierLabel.textContent = `Carrier Frequency: ${frequency} Hz`;
    });
  
    // Beat slider event
    beatSlider.addEventListener("input", () => {
      binauralBeat = parseFloat(beatSlider.value);
      updateBeatLabel();
      updateOscillators();
      updatePlayingIndicator();
    });
  
    // Volume slider event
    volumeSlider.addEventListener("input", () => {
      volume = parseInt(volumeSlider.value);
      updateVolumeLabel();
      updateOscillators();
    });
  
    // Loop speech checkbox
    const loopCheckbox = document.getElementById("loop-speech-checkbox");
    loopCheckbox.addEventListener("change", function () {
      loopSpeech = this.checked;
      console.log("Speech loop set to:", loopSpeech);
    });
  
    // Set up Day and Night script buttons
    const dayScriptBtn = document.getElementById("day-script-btn");
    const nightScriptBtn = document.getElementById("night-script-btn");
  
    // Set initial script (night script)
    speechText.value = nightScript;
  
    dayScriptBtn.addEventListener("click", function () {
      speechText.value = dayScript;
      dayScriptBtn.classList.add("active");
      nightScriptBtn.classList.remove("active");
    });
  
    nightScriptBtn.addEventListener("click", function () {
      speechText.value = nightScript;
      nightScriptBtn.classList.add("active");
      dayScriptBtn.classList.remove("active");
    });
  
    // Load voices for speech synthesis
    setTimeout(() => {
      loadVoices();
      if (voices.length === 0) {
        setTimeout(loadVoices, 1000);
      }
    }, 100);
  
    // Initial UI updates
    updateBeatLabel();
    updateVolumeLabel();
  });
  
  /* Clean up on page unload */
  window.addEventListener("beforeunload", () => {
    if (isPlaying && leftOsc && rightOsc) {
      leftOsc.stop();
      rightOsc.stop();
      leftOsc.dispose();
      rightOsc.dispose();
      leftChannel.dispose();
      rightChannel.dispose();
    }
  });
  