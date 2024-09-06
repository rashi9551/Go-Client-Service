import React, { useState, useEffect } from "react";

interface TypingTextProps {
  text: string;
  speed: number;
  eraseSpeed: number;
  pauseDuration: number;
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed,
  eraseSpeed,
  pauseDuration,
}) => {
  const [displayText, setDisplayText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isTyping) {
      intervalId = setInterval(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
        if (index >= text.length - 1) {
          clearInterval(intervalId);
          setIsTyping(false);
          setPause(true);
        }
      }, speed);
    } else if (pause) {
      const pauseId = setTimeout(() => {
        setPause(false);
      }, pauseDuration);

      return () => clearTimeout(pauseId);
    } else {
      intervalId = setInterval(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length === 0) {
          clearInterval(intervalId);
          setIndex(0);
          setIsTyping(true);
        }
      }, eraseSpeed);
    }

    return () => clearInterval(intervalId);
  }, [isTyping, pause, index, displayText, text, speed, eraseSpeed, pauseDuration]);

  const renderWithColors = (text: string) => {
    const anywhereWithIndex = text.indexOf("Anywhere With");
    const goAndGoIndex = text.indexOf("Go & Go");

    return (
      <>
        {anywhereWithIndex !== -1 ? (
          <>
            {text.slice(0, anywhereWithIndex)}
            <span className="text-blue-500">Anywhere With</span>
            {goAndGoIndex !== -1 ? (
              <>
                {text.slice(anywhereWithIndex + "Anywhere With".length, goAndGoIndex)}
                <span className="text-yellow-700">Go & Go</span>
                {text.slice(goAndGoIndex + "Go & Go".length)}
              </>
            ) : (
              text.slice(anywhereWithIndex + "Anywhere With".length)
            )}
          </>
        ) : (
          text
        )}
      </>
    );
  };

  return (
    <h4 className="text-4xl font-bold mb-4">
      {/* Adjusted text size using 'text-4xl' */}
      <span className="text-white">R</span>
      {renderWithColors(displayText.slice(1))}
    </h4>
  );
};

export default TypingText;
