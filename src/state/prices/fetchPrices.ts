import { fetchPricesV0 } from "./fetchPricesV0"
import { fetchPricesV2 } from "./fetchPricesV2"

const pricingType = process.env.PRICING_TYPE

export const fetchPrices = async () => {
    if (pricingType === '2') return fetchPricesV2()
    return fetchPricesV0()
}