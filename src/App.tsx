import { useState } from "react";
import { ScraperView } from "@/components/ScraperView";

const API_BASE = "https://backend.24.199.67.13.nip.io";
// const API_BASE = "http://localhost:8000";

interface ProcessResult {
  final_email: string;
  profile_data: string | null;
  target_url: string;
  run_id: string | null;
}

function App() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [selectedTone, setSelectedTone] = useState("Formal");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: url, company_tone: selectedTone }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error en el pipeline");
      }

      const data: ProcessResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      alert(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeTone = async () => {
    if (!result) return;
    setIsRegenerating(true);
    try {
      const response = await fetch(`${API_BASE}/regenerate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_data: result.profile_data ?? "",
          tone: selectedTone,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error regenerando email");
      }
      const data = await response.json();
      setResult({ ...result, final_email: data.final_email });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ScraperView
        url={url}
        onUrlChange={setUrl}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        result={result}
        selectedTone={selectedTone}
        onToneChange={setSelectedTone}
        onChangeTone={handleChangeTone}
        isRegenerating={isRegenerating}
      />
    </div>
  );
}

export default App;
