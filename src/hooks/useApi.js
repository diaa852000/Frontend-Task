import { useCallback } from "react";

const useApi = () => {
    const useMock = import.meta.env.VITE_USE_MOCK_API === "true";

    const baseUrl = useMock
        ? import.meta.env.VITE_MOCK_API_BASE_URL
        : import.meta.env.VITE_API_BASE_URL;

    const request = useCallback(async (endpoint, options = {}) => {
        const res = await fetch(`${baseUrl}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
            },
            ...options,
        });

        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }

        return res.json();
    }, [baseUrl]);

    return { request, baseUrl };
};

export default useApi;
