declare module "ai/react" {
  export function useCompletion(options: {
    api: string;
    initialCompletion?: string;
  }): {
    complete: (prompt?: string) => void;
    completion: string;
    isLoading: boolean;
    error?: Error;
  };
}
