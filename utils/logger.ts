type LogLevel = "info" | "warn" | "error";

export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[INFO]: ${message}`, data || "");
    }
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN]: ${message}`, data || "");
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR]: ${message}`, error || "");
    // Future: Integrate with Sentry or Datadog
  }
};
