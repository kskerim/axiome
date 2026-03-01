import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PointSolde } from "@/lib/calculs";
import { formaterMontant } from "@/lib/calculs";

// props du graphique d'evolution
interface SoldeChartProps {
  donnees: PointSolde[];
}

// tooltip personnalise pour le graphique
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#0a0a0c] px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-medium tracking-wide text-white/50">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor:
                entry.dataKey === "solde"
                  ? "#a78bfa"
                  : entry.dataKey === "revenus"
                    ? "#34d399"
                    : "#f87171",
            }}
          />
          <span className="text-xs text-white/40">{entry.dataKey}</span>
          <span className="text-xs font-medium text-white/80">
            {formaterMontant(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// graphique area chart de l'evolution du solde sur 12 mois
export function SoldeChart({ donnees }: SoldeChartProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
      <h2 className="mb-5 text-base font-medium tracking-widest text-white/40 uppercase sm:mb-6">
        \u00c9volution du solde
      </h2>

      <div className="h-64 w-full sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={donnees}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientSolde" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientRevenus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />

            <XAxis
              dataKey="mois"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 12 }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="revenus"
              stroke="#34d399"
              strokeWidth={1.5}
              fill="url(#gradientRevenus)"
            />

            <Area
              type="monotone"
              dataKey="solde"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="url(#gradientSolde)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
