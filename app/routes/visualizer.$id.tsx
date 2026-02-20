import { useEffect, useState } from "react";
import { useParams } from "react-router";

const BASE64_DATA_URL_PREFIX = "data:";

function isValidBase64Image(value: string): boolean {
  return typeof value === "string" && value.startsWith(BASE64_DATA_URL_PREFIX) && value.length > BASE64_DATA_URL_PREFIX.length;
}

const VisualizerId = () => {
  const { id } = useParams<{ id: string }>();
  const [imageData, setImageData] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!id) {
      setMissing(true);
      return;
    }
    const stored = sessionStorage.getItem(`visualizer:${id}`);
    if (!stored || !isValidBase64Image(stored)) {
      setMissing(true);
      return;
    }
    setImageData(stored);
  }, [id]);

  if (missing || !id) {
    return (
      <div className="visualizer-fallback">
        <p>Image not found or invalid. Please upload a floor plan from the home page.</p>
      </div>
    );
  }

  if (!imageData) {
    return <div className="visualizer-loading">Loading...</div>;
  }

  return (
    <div className="visualizer">
      <img src={imageData} alt="Floor plan" />
    </div>
  );
};

export default VisualizerId;