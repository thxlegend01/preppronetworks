import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PasswordGate from "@/components/PasswordGate";

const ViewerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state?.url || "";
  const title = location.state?.title || "App Viewer";
  
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check if user already has access this session
    const access = sessionStorage.getItem("preppro_access");
    if (access === "granted") {
      setHasAccess(true);
    }
  }, []);

  // Open externally once access is granted
  useEffect(() => {
    if (hasAccess && url) {
      window.open(url, "_blank");
      navigate("/");
    }
  }, [hasAccess, url, navigate]);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <h1 className="text-xl font-bold mb-4">No URL provided</h1>
          <button 
            onClick={() => navigate("/")} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Show password gate if no access
  if (!hasAccess) {
    return (
      <PasswordGate 
        title={title}
        onSuccess={handleAccessGranted}
        onCancel={() => navigate("/")}
      />
    );
  }

  // This will briefly show while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Opening {title}...</p>
    </div>
  );
};

export default ViewerPage;
