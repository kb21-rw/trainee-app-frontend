import { useEffect } from "react";

const useNavigateAfterSuccess = (path: string, dependency: boolean) => {
  useEffect(() => {
    if (dependency) {
      const timer = setTimeout(() => {
        window.location.href = path;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [dependency, path]);
};

export default useNavigateAfterSuccess
