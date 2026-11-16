import { Sparkles, ShieldCheck, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white py-24 px-4 sm:px-6 lg:px-8">
      {/* Decorative accent blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            AdvisorFlow AI
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-8">
          Reduce Financial Advisory Admin by{" "}
          <span className="text-accent">80%</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Turn meeting notes into client-ready follow-ups, advisor action lists
          and CRM summaries in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Compliant-aware summarisation</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span>No client data stored</span>
          </div>
        </div>
      </div>
    </section>
  );
}