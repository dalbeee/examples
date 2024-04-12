import { Button, Card, CardContent } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import googleLoginImage from "../assets/googleSignIn.png";

export default function SignIn() {
  const { user, handleSignIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/profile");
  }, [navigate, user]);

  return (
    <Card className="">
      <CardContent>
        <div className="card-title">로그인</div>
        <div className="flex justify-center py-20">
          <Button onClick={handleSignIn}>
            <img src={googleLoginImage} alt="logo" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
