export const useAPI = (request, opts) => {
    return useAsyncData(request, () => $fetch(request, { ...opts }));
};

