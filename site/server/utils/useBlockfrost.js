const config = useRuntimeConfig()

export const useBlockfrost = (network) => {
    try {
        const blockfrostConfig = config.blockfrost[network.toLowerCase()];

        return $fetch.create({
            baseURL: blockfrostConfig.BASE_URL,
            headers: {
              'project_id': blockfrostConfig.PROJECT_ID,
            },
        })
    } catch (error) {
        console.log(error)
        return new Response(error.message, { status: 500 })
    }
};
