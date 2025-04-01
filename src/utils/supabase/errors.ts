export function parseError(error: unknown) {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack ?? "No stack available",
        code: "code" in error ? (error as { code?: string }).code ?? "UNKNOWN_ERROR" : "UNKNOWN_ERROR",
      };
    }
    return {
      message: "알 수 없는 오류 발생",
      stack: "No stack available",
      code: "UNKNOWN_ERROR",
    };
  }