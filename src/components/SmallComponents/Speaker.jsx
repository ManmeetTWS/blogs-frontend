import React, { useState, useEffect } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import './Speaker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Speaker({ text }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesisUtterance, setSpeechSynthesisUtterance] = useState(null);

  const temp = document.createElement('div');
  temp.innerHTML = text;
  const textContent = temp.textContent;

  useEffect(() => {
    if (isSpeaking) {
      startSpeech();
    } else {
      stopSpeech();
    }
  }, [isSpeaking, text]);

  function startSpeech() {
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(textContent);

      setSpeechSynthesisUtterance(utterance);

      synth.speak(utterance);

      utterance.onstart = () => {
        console.log('Speech started');
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };

      utterance.onerror = (error) => {
        console.error('Speech error:', error);
        toast.error(error);
      };
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast.error(error);
    }
  }

  function stopSpeech() {
    if (speechSynthesisUtterance) {
      window.speechSynthesis.cancel();
    }
  }

  const handleToggleSpeech = () => {
    setIsSpeaking((prevIsSpeaking) => !prevIsSpeaking);
  };

  return (
    <div className="textospeech">
      {isSpeaking ? (
        <HiSpeakerWave
          onClick={handleToggleSpeech}
          className="speaker-icon-on"
          style={{ fontSize: '30px', margin: '15px 0', cursor: 'pointer' }}
        />
      ) : (
        <HiSpeakerXMark
          onClick={handleToggleSpeech}
          className="speaker-icon-off"
          style={{ fontSize: '30px', margin: '15px 0', cursor: 'pointer' }}
        />
      )}
      {/* <div className="speakerInfo">
        <p>Click to {isSpeaking ? 'Pause' : 'Listen to'} this Blog</p>
      </div> */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Speaker;
