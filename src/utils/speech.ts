// Speech synthesis utility for kids phonics & word recitation

export function playAudioText(text: string, lang: "hi-IN" | "en-US" = "hi-IN") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser");
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Slightly slower for primary school children
    utterance.pitch = 1.1; // Cheerful friendly pitch

    // Try finding matched voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) =>
      lang.startsWith("hi") ? v.lang.includes("hi") || v.lang.includes("HI") : v.lang.includes("en")
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Speech error", err);
  }
}

export function stopAudioText() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
