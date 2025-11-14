import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleRecover = () => {
    if (email) {
      navigate("/verify-reset", { state: { email } });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center text-foreground hover:text-muted-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Forgot password?</h1>
          <p className="text-muted-foreground text-base">
            Enter your email to receive a recovery code
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-base rounded-2xl border-2"
            />
          </div>

          <Button
            size="lg"
            className="w-full h-14 text-base rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleRecover}
          >
            Recover
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
