import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (value: string) => {
    let strength = 0;
    if (value.length >= 8) strength += 25;
    if (value.length >= 12) strength += 25;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength += 25;
    if (/\d/.test(value)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(value)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
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

  const handleSave = () => {
    if (password.length >= 8 && password === confirmPassword) {
      console.log("Password reset successfully");
      navigate("/login");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/verify-reset")}
            className="flex items-center text-foreground hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </button>
          <button
            onClick={handleSkip}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
            <X className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Create new password</h1>
          <p className="text-muted-foreground text-base">
            Your new password must be different from previous passwords
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-semibold">New Password</Label>
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

          <Button
            size="lg"
            className="w-full h-14 text-base rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
            disabled={password.length < 8 || password !== confirmPassword}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
