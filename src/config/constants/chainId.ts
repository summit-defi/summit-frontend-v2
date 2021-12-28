export const getChainId = () => {
  return JSON.parse(localStorage.getItem('ChainId')) || '97'
}
