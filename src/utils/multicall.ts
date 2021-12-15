import { Interface } from '@ethersproject/abi'
import { getWeb3 } from 'utils/web3'
import { abiItem } from './abi'
import { getMulticallAddress } from './addressHelpers'
import { retryDecorator } from './callHelpers'
import { chunkArray } from './helpers'

export interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (exemple: balanceOf)
  params?: any[] // Function params
}

export const multicall = async (abi: any[], calls: Call[]) => {
  const web3 = getWeb3()
  const multi = new web3.eth.Contract(abiItem.multicall, getMulticallAddress())
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}

export const chunkedMulticall = async (abi: any[], calls: Call[], chunk: number) => {
  const chunkedCalls = chunkArray(chunk, calls)
  const res = []
  for (let i = 0; i < chunkedCalls.length; i++) {
    console.log({ i, call: chunkedCalls[i] })
    const chunkedRes = await multicall(abi, chunkedCalls[i])
    console.log({ chunkedRes })
    res.push(...chunkedRes)
  }
  console.log({ finalRes: res })
  return res
}

export const retryableMulticall = async (abi: any[], calls: Call[], functionName: string): Promise<null | any[]> => {
  const multicallTx = retryDecorator(async () => multicall(abi, calls), 0)

  const res = (await multicallTx()) as any

  if (res.err != null) {
    console.error(`${functionName}:\n\t${res.err.join('\n')}`)
    return null
  }

  return res as any
}
