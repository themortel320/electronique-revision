import { ProgressDashboard } from "@/components/progress-dashboard";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Tableau de bord
        </h1>
        <p className="text-white/50">Suis ta progression et identifie tes points faibles.</p>
      </div>
      <ProgressDashboard />
    </div>
  );
}
