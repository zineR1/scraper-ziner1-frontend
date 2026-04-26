import { useState } from "react";
import {
  Mail,
  Building2,
  Copy,
  Check,
  Globe,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const TONE_OPTIONS = ["Formal", "Amigable", "Directo", "Persuasivo"] as const;

interface ScraperViewProps {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  result: {
    final_email: string;
    profile_data: string | null;
    target_url: string;
    run_id: string | null;
  } | null;
  selectedTone: string;
  onToneChange: (tone: string) => void;
  onChangeTone: () => void;
  isRegenerating: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md bg-indigo-900/50 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-900"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

export function ScraperView({
  url,
  onUrlChange,
  onSubmit,
  isLoading,
  result,
  selectedTone,
  onToneChange,
  onChangeTone,
  isRegenerating,
}: ScraperViewProps) {
  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      {/* Hero full width */}
      <img
        src="/hero.png"
        alt="Agentes IA generando reportes y mensajes"
        className="w-full object-cover max-h-64 shrink-0"
      />

      {/* Contenido centrado en el espacio restante */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-155 w-full mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-foreground leading-tight text-center">
            Aumentá tus ventas con IA
          </h1>
          <p className="mt-4 text-base text-muted-foreground text-center leading-snug">
            Escribí la web de tu cliente potencial y nuestros agentes escribirán
            un reporte del negocio y un mensaje listo para que puedas contactarlos
          </p>

          <div className="mt-8 flex items-stretch rounded-xl bg-slate-800 border border-border overflow-hidden focus-within:ring-2 focus-within:ring-indigo-600/50">
          <input
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none pl-4 py-3.5"
            placeholder="Ej: https://ejemplo.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.trim() && !isLoading) onSubmit();
            }}
          />
          <button
            onClick={onSubmit}
            disabled={isLoading || !url.trim()}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold px-5 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin" />
                Procesando...
              </span>
            ) : (
              "Iniciar Web Scraping"
            )}
          </button>
        </div>

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8"
            >
              <div className="rounded-xl border border-indigo-900 bg-indigo-950/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900/50">
                    <Loader2
                      size={20}
                      className="animate-spin text-indigo-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-200">
                      Ejecutando pipeline de agentes...
                    </p>
                    <p className="text-xs text-indigo-400 mt-0.5">
                      Scraping &rarr; Analisis de negocio &rarr; Generacion de
                      email
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {["Scraper", "Profiler", "Copywriter"].map((agent, i) => (
                    <div
                      key={agent}
                      className="flex-1 rounded-lg bg-slate-800/60 border border-indigo-900/50 px-3 py-2 text-center"
                    >
                      <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-wide">
                        Agente {i + 1}
                      </p>
                      <p className="text-xs font-semibold text-indigo-200 mt-0.5">
                        {agent}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        </div>{/* cierre max-w-155 */}

        {/* Results */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-5 pb-10"
            >
              {/* Header de resultados */}
              <div className="flex items-center gap-2 border-b border-border pb-3 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/50">
                  <Check size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Pipeline completado
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Globe size={11} />
                    {result.target_url}
                    {result.run_id && (
                      <span className="ml-2 text-muted-foreground/60">
                        ID: {result.run_id}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Tone customization */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 px-6"
              >
                <label className="text-sm font-medium text-slate-400 whitespace-nowrap">
                  Tono
                </label>
                <select
                  value={selectedTone}
                  onChange={(e) => onToneChange(e.target.value)}
                  disabled={isRegenerating}
                  className="flex-1 rounded-md border border-border bg-slate-800 px-3 py-2 text-sm text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
                >
                  {TONE_OPTIONS.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={onChangeTone}
                  disabled={isRegenerating}
                  className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm shadow-indigo-900/40 disabled:opacity-50"
                >
                  {isRegenerating ? (
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                  ) : (
                    <RefreshCw size={14} className="mr-1.5" />
                  )}
                  Cambiar estilo
                </Button>
              </motion.div>

              {/* Cold Email + Análisis side by side */}
              <div className="flex gap-6 px-6 items-start">
                {/* Cold Email */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex-1 min-w-0 rounded-xl border border-indigo-900 bg-slate-800/50 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-indigo-900/50 bg-indigo-950/40 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-900/60">
                        <Mail size={14} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-indigo-200">
                          Cold Email Generado
                        </p>
                        <p className="text-[11px] text-indigo-400">
                          Agente Copywriter
                        </p>
                      </div>
                    </div>
                    <CopyButton text={result.final_email} />
                  </div>
                  <div className="p-5">
                    <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-[inherit]">
                      {isRegenerating ? (
                        <div className="flex items-center gap-2 text-indigo-400">
                          <Loader2 size={14} className="animate-spin" />
                          <span>Regenerando email...</span>
                        </div>
                      ) : (
                        result.final_email
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Análisis del Negocio */}
                {result.profile_data && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex-1 min-w-0 rounded-xl border border-amber-900/50 bg-slate-800/50 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-amber-900/40 bg-amber-950/30 px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-900/50">
                          <Building2 size={14} className="text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-amber-200">
                            Análisis del Negocio
                          </p>
                          <p className="text-[11px] text-amber-400">
                            Agente Profiler &mdash; Puntos de dolor, tecnologia,
                            oportunidades
                          </p>
                        </div>
                      </div>
                      <CopyButton text={result.profile_data} />
                    </div>
                    <div className="p-5">
                      <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-[inherit]">
                        {result.profile_data}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
