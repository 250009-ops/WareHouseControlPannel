type IconName =
  | "warehouse"
  | "warehouse-sm"
  | "mail"
  | "lock"
  | "eye-off"
  | "check"
  | "layout-dashboard"
  | "package"
  | "shopping-cart"
  | "receipt"
  | "bar-chart-2"
  | "settings"
  | "search"
  | "bell"
  | "package-kpi"
  | "arrow-up-right"
  | "shopping-bag"
  | "credit-card"
  | "arrow-down-right"
  | "trending-up"
  | "filter"
  | "chevron-down"
  | "download"
  | "plus"
  | "user-plus"
  | "edit-2"
  | "trash-2"
  | "chevron-left"
  | "chevron-right"
  | "x"
  | "image"
  | "menu";

export function Icon({
  name,
  size,
  alt = "",
  className,
}: {
  name: IconName;
  size: number;
  alt?: string;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <img
        src={`/assets/icons/${name}.svg`}
        alt={alt}
        width={size}
        height={size}
        className="block size-full max-w-none"
      />
    </span>
  );
}
