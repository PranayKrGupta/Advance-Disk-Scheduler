export const themes = {
  dark: {
    bg: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    card: "bg-slate-900/60 backdrop-blur-2xl border-white/10",
    innerCard: "bg-white/5 border-white/10",
    input: "bg-slate-800/50 border-white/20 text-white placeholder-slate-500",
    button: {
      primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/20",
      secondary: "bg-white/10 hover:bg-white/20 text-slate-200 border-white/20",
      active: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    },
    chart: {
      grid: "#334155",
      text: "#94a3b8",
      tooltipBg: "#1e293b",
      tooltipBorder: "#334155",
      tooltipText: "#f8fafc"
    },
    disk: {
      platter: "url(#diskGradient-dark)",
      stroke: "#334155",
      spindle: "#475569"
    }
  },
  light: {
    bg: "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-indigo-100 to-purple-100",
    text: "text-slate-800",
    textMuted: "text-slate-500",
    card: "bg-white/60 backdrop-blur-2xl border-white/40 shadow-xl",
    innerCard: "bg-white/50 border-white/30",
    input: "bg-white/70 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-blue-400",
    button: {
      primary: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/30",
      secondary: "bg-white/60 hover:bg-white/80 text-slate-700 border-slate-200",
      active: "bg-blue-100 text-blue-700 border-blue-300",
    },
    chart: {
      grid: "#cbd5e1",
      text: "#64748b",
      tooltipBg: "rgba(255, 255, 255, 0.9)",
      tooltipBorder: "#e2e8f0",
      tooltipText: "#1e293b"
    },
    disk: {
      platter: "url(#diskGradient-light)",
      stroke: "#cbd5e1",
      spindle: "#e2e8f0"
    }
  }
};

export const safeNum = (val, fixed = 0) => {
  const num = Number(val);
  return isNaN(num) ? '0' : num.toFixed(fixed);
};