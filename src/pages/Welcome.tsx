import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();
  const fullText = "Welcome to our website";

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeWriter = () => {
      if (!isDeleting && currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeWriter, 100);
      } else if (!isDeleting && currentIndex > fullText.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, 1500);
      } else if (isDeleting && currentIndex > 0) {
        currentIndex--;
        setText(fullText.slice(0, currentIndex));
        timeoutId = setTimeout(typeWriter, 50);
      } else {
        setTimeout(() => navigate("/auth"), 500);
      }
    };

    typeWriter();

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(cursorInterval);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">
          {text}
          <span className={`ml-1 inline-block w-0.5 h-10 bg-foreground align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
        </h1>
      </div>
    </div>
  );
};

export default Welcome;
