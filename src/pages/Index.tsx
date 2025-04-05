
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard on app load
    navigate("/");
  }, [navigate]);
  
  return null; // This page will redirect immediately
};

export default Index;
