import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { RightPanel } from "@/components/RightPanel";
import { ScraperView } from "@/components/ScraperView";

const API_BASE = "https://backend.24.199.67.13.nip.io";

interface ProcessResult {
  final_email: string;
  profile_data: string | null;
  target_url: string;
  run_id: string | null;
}

function App() {
  const [activeNav, setActiveNav] = useState("scraper");
  const [url, setUrl] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [headers, setHeaders] = useState("");
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
        body: JSON.stringify({ target_url: url }),
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
      <Sidebar activeItem={activeNav} onNavigate={setActiveNav} />

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

      <RightPanel
        apiToken={apiToken}
        onApiTokenChange={setApiToken}
        headers={headers}
        onHeadersChange={setHeaders}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
