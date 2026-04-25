import { ReactNode } from "react";

type StatsCardProps = {
  icon: ReactNode;
  value: string;
  title: string;
  subtitle: string;
  subtitleColor?: string;
};

export default function StatsCard({
  icon,
  value,
  title,
  subtitle,
  subtitleColor = "text-slate-500",
}: StatsCardProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        {icon}
      </div>

      <h3 className="mb-3 text-5xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>

      <p className="mb-2 text-[20px] text-slate-600">{title}</p>

      <p className={`text-[18px] ${subtitleColor}`}>{subtitle}</p>
    </div>
  );
}