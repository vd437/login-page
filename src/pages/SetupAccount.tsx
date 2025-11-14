import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const SetupAccount = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateUsername = (value: string) => {
    const isValid = value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value);
    setUsernameValid(value.length > 0 ? isValid : null);
  };

  const calculatePasswordStrength = (value: string) => {
    let strength = 0;
    if (value.length >= 8) strength += 25;
    if (value.length >= 12) strength += 25;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength += 25;
    if (/\d/.test(value)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(value)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    validateUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    calculatePasswordStrength(value);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-destructive";
    if (passwordStrength < 60) return "bg-yellow-500";
    return "bg-success";
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Medium";
    return "Strong";
  };

  const handleSubmit = () => {
    if (usernameValid && password.length >= 8 && password === confirmPassword && agreedToTerms) {
      console.log("Account setup complete");
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <button
          onClick={() => navigate("/verify-email")}
          className="flex items-center text-foreground hover:text-muted-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Set up your account</h1>
          <p className="text-muted-foreground text-base">Complete your profile</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-base font-semibold">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={cn(
                "h-14 text-base rounded-2xl border-2 transition-all",
                usernameValid === true && "border-input-valid",
                usernameValid === false && "border-input-invalid"
              )}
            />
            {usernameValid === false && (
              <p className="text-xs text-destructive">
                Username must be at least 3 characters and contain only letters, numbers, and underscores
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-semibold">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min. 8 characters)"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="h-14 text-base rounded-2xl border-2"
            />
            {password && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength</span>
                  <span className={cn("font-semibold", getStrengthColor().replace("bg-", "text-"))}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-300", getStrengthColor())}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-semibold">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(
                "h-14 text-base rounded-2xl border-2 transition-all",
                confirmPassword && password === confirmPassword && "border-input-valid",
                confirmPassword && password !== confirmPassword && "border-input-invalid"
              )}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <button className="font-semibold underline hover:text-muted-foreground">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="font-semibold underline hover:text-muted-foreground">
                Privacy Policy
              </button>
            </label>
          </div>

          <Button
            size="lg"
            className="w-full h-14 text-base rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={!usernameValid || password.length < 8 || password !== confirmPassword || !agreedToTerms}
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetupAccount;
