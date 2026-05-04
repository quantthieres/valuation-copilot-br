import * as React from "react";

type LogoVariant = "full" | "compact";
type LogoTone = "dark" | "light";
type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  variant?: LogoVariant;
  tone?: LogoTone;
  size?: LogoSize;
  className?: string;
};

const sizeMap: Record<LogoSize, { icon: number; text: string; badge: string }> = {
  sm: { icon: 28, text: "text-sm", badge: "h-4 px-1 text-[8px]" },
  md: { icon: 32, text: "text-[15px]", badge: "h-5 px-1.5 text-[10px]" },
  lg: { icon: 40, text: "text-base", badge: "h-5 px-1.5 text-[10px]" },
};

export function Logo({
  variant = "full",
  tone = "dark",
  size = "md",
  className = "",
}: LogoProps) {
  const isDark = tone === "dark";
  const { icon, text, badge } = sizeMap[size];

  const iconBg = isDark ? "#0F172A" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";
  const badgeBg = isDark ? "#1E293B" : "#E5E7EB";
  const badgeText = isDark ? "#E5E7EB" : "#0F172A";

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      aria-label="Valuation Copilot BR"
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="vcb-logo-gradient" x1="6" y1="20" x2="34" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2563EB" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        <rect width="40" height="40" rx="10" fill={iconBg} />

        <g stroke="url(#vcb-logo-gradient)" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.6 32V24.2L13.9 19.5V14.7" />
          <path d="M21.4 32V24.2L26.1 19.5V14.7" />
          <path d="M13.9 19.5H9.4L6.8 17" />
          <path d="M13.9 14.7L10.6 12.1V8.9" />
          <path d="M13.9 14.7L17.1 12.2V8.4" />
          <path d="M9.4 19.5L6.5 22.2" />
          <path d="M6.8 17L4.7 15" />
          <path d="M6.8 17L4.8 18.9" />
          <path d="M10.6 8.9L8.5 7.4" />
          <path d="M10.6 8.9L12.5 7.2" />
          <path d="M17.1 8.4L15.1 6.7" />
          <path d="M17.1 8.4L19.2 6.7" />
          <path d="M6.5 22.2L4.4 20.6" />
          <path d="M6.5 22.2L4.4 24.1" />
          <path d="M26.1 19.5H30.6L33.2 17" />
          <path d="M26.1 14.7L29.4 12.1V8.9" />
          <path d="M26.1 14.7L22.9 12.2V8.4" />
          <path d="M30.6 19.5L33.5 22.2" />
          <path d="M33.2 17L35.3 15" />
          <path d="M33.2 17L35.2 18.9" />
          <path d="M29.4 8.9L31.5 7.4" />
          <path d="M29.4 8.9L27.5 7.2" />
          <path d="M22.9 8.4L24.9 6.7" />
          <path d="M22.9 8.4L20.8 6.7" />
          <path d="M33.5 22.2L35.6 20.6" />
          <path d="M33.5 22.2L35.6 24.1" />
        </g>
      </svg>

      {variant === "full" && (
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`${text} whitespace-nowrap font-semibold leading-none tracking-[-0.04em]`}
            style={{ color: textColor }}
          >
            Valuation Copilot
          </span>

          <span
            className={`inline-flex items-center rounded-md font-extrabold leading-none tracking-[0.08em] ${badge}`}
            style={{ backgroundColor: badgeBg, color: badgeText }}
          >
            BR
          </span>
        </div>
      )}
    </div>
  );
}
