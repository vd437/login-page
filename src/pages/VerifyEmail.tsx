import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const correctCode = "123456"; // Demo purpose

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    // Only accept numeric digits
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setIsValid(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      const enteredCode = newCode.join("");
      if (enteredCode === correctCode) {
        setIsValid(true);
        setTimeout(() => {
          navigate("/setup-account");
        }, 1000);
      } else {
        setIsValid(false);
        setTimeout(() => {
          setCode(["", "", "", "", "", ""]);
          setIsValid(null);
          inputRefs.current[0]?.focus();
        }, 1000);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setCode(["", "", "", "", "", ""]);
    setIsValid(null);
    console.log("Resending code to:", email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <button
          onClick={() => navigate("/signup")}
          className="flex items-center text-foreground hover:text-muted-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Verify your email</h1>
          <p className="text-muted-foreground text-base">
            Check your email. We've sent a code to
          </p>
          <p className="text-foreground font-medium">{email}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold rounded-xl sm:rounded-2xl border-2 transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  isValid === true && "border-input-valid bg-success/10 text-success",
                  isValid === false && "border-input-invalid bg-destructive/10 text-destructive animate-shake",
                  isValid === null && "border-input focus:border-input-focus"
                )}
              />
            ))}
          </div>

          {isValid === true && (
            <p className="text-center text-success font-medium">Code verified successfully!</p>
          )}

          {isValid === false && (
            <p className="text-center text-destructive font-medium">
              Invalid code. Please enter a valid code.
            </p>
          )}

          <div className="flex items-center justify-center gap-2 text-sm">
            {!canResend ? (
              <p className="text-muted-foreground">
                Resend code in <span className="font-semibold text-foreground">{timer}s</span>
              </p>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                className="rounded-xl"
              >
                Resend code
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
