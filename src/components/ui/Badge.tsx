const styles = {
  sold: "bg-[#dcfce7] text-[#15803d]",
  unsold: "bg-[#fef3c7] text-[#b45309]",
  paid: "bg-[#dcfce7] text-[#15803d]",
  unpaid: "bg-[#fee2e2] text-[#b91c1c]",
  cash: "bg-[#dcfce7] text-[#15803d]",
  card: "bg-[rgba(37,99,235,0.1)] text-[#2563eb]",
  debt: "bg-[#fef3c7] text-[#b45309]",
  confirmed: "bg-[#dcfce7] text-[#15803d]",
  cancelled: "bg-[#fee2e2] text-[#b91c1c]",
  progress: "bg-[#fef3c7] text-[#b45309]",
  overdue: "bg-[#fee2e2] text-[#b91c1c]",
  super: "bg-[#f3e8ff] text-[#6b21a8]",
  admin: "bg-[#dbeafe] text-[#1d4ed8]",
  moderator: "bg-[#e2e8f0] text-[#334155]",
  active: "bg-[#dcfce7] text-[#15803d]",
  inactive: "bg-[#fee2e2] text-[#b91c1c]",
} as const;

export function Badge({
  tone,
  children,
}: {
  tone: keyof typeof styles;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-[8px] py-[4px] text-[11px] font-semibold whitespace-nowrap ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
