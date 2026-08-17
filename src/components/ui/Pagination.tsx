export function Pagination({
  label,
  page,
  pages,
  onPage,
}: {
  label: string;
  page: number;
  pages: number;
  onPage: (page: number) => void;
}) {
  const nums = Array.from({ length: Math.min(pages, 3) }, (_, i) => i + 1);
  return (
    <div className="flex flex-col items-start justify-between gap-[12px] p-[16px] sm:flex-row sm:items-center sm:p-[20px]">
      <p className="text-[13px] text-[#64748b] md:text-[14px]">{label}</p>
      <div className="flex flex-wrap items-start gap-[8px]">
        <button
          type="button"
          onClick={() => onPage(Math.max(1, page - 1))}
          className="rounded-[6px] border border-[#e2e8f0] bg-white px-[12px] py-[8px] text-[12px] font-semibold text-[#1e293b]"
        >
          Oldingi
        </button>
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPage(n)}
            className={`rounded-[6px] px-[12px] py-[8px] text-[12px] font-semibold ${
              n === page
                ? "bg-[#2563eb] text-[#f8fafc]"
                : "border border-[#e2e8f0] bg-white text-[#1e293b]"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPage(Math.min(pages, page + 1))}
          className="rounded-[6px] border border-[#e2e8f0] bg-white px-[12px] py-[8px] text-[12px] font-semibold text-[#1e293b]"
        >
          Keyingi
        </button>
      </div>
    </div>
  );
}
