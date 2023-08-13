import { createFetch } from '@vueuse/core'

// https://api.koios.rest/
export const useKoios = (network) => {
  // Config koios
  const KOIOS_BASE_URL = network.toLowerCase() === 'preprod' ? 'https://preprod.koios.rest' : 'https://api.koios.rest'

  const fullPath = (path, params) => {
    let fullPath = `/api/v0${path}`
    if (params) fullPath = `${fullPath}?${new URLSearchParams(params).toString()}`
    return fullPath
  }

  const koiosSvc = createFetch({
    baseUrl: KOIOS_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json'
    }
  })

  const getAssetInfo = (policy_id, asset_name) => {
    try {
      const params = {
        _asset_policy: policy_id,
        _asset_name: asset_name
      }

      return koiosSvc(fullPath('/asset_info', params))
    } catch (e) {
      console.error(e)
      return null
    }
  }

  // TODO: Really need to store these in a cache or perhaps on server?
  const getAssetInfoBulk = async (asset_list, params = {}) => {
    if (!params.offset) params.offset = 0
    let results = []

    const {data, response} = await koiosSvc(fullPath('/asset_info', params)).post({ _asset_list: asset_list }).json()

    results = results.concat(data.value)
    // NOTE: This is a hack to get around the fact that the API only returns 1000 results at a time
    if (data.length >= 1000) {
      const range = response.value.headers.get('content-range') // 0-0/*
      let [start, end] = range.split('-')
      start = parseInt(start)
      end = parseInt(end)

      if (start !== end) {
        params.offset = end
        const nextPage = await getAssetInfoBulk(asset_list, params)
        results = results.concat(nextPage)
      }
    }

    return results
  }

  // Return
  return {
    koiosSvc,

    // Assets
    getAssetInfo,
    getAssetInfoBulk
  }
}
