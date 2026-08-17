import { Icon } from "../Icon";

type IconName = Parameters<typeof Icon>[0]["name"];

export function KpiCard({
  label,
  value,
  icon,
  iconBg,
  trend,
  trendDown,
}: {
  label: string;
  value: string;
  icon: IconName;
  iconBg: string;
  trend?: string;
  trendDown?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-[12px] border border-[#e2e8f0] bg-white p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-[#64748b]">{label}</p>
        <div
          className="flex size-[40px] items-center justify-center rounded-[10px]"
          style={{ background: iconBg }}
        >
          <Icon name={icon} size={20} alt="" />
        </div>
      </div>
      <p className="mt-[16px] font-[family-name:var(--font-epilogue)] text-[20px] font-bold text-[#1e293b]">
        {value}
      </p>
      {trend ? (
        <div className="mt-[4px] flex items-center gap-[4px]">
          <Icon name={trendDown ? "arrow-down-right" : "arrow-up-right"} size={14} alt="" />
          <p className={`text-[12px] ${trendDown ? "text-[#b91c1c]" : "text-[#15803d]"}`}>
            {trend}
          </p>
          <p className="text-[12px] text-[#94a3b8]">o&apos;tgan oydan</p>
        </div>
      ) : null}
    </div>
  );
}
