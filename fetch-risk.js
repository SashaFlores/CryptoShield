var date = args[0]

const MLmodelData = Functions.makeHttpRequest({
  url: `https://cryptoshieldapi.netlify.app/api/risk/${date}`,
})
const [MLResponse] = await Promise.all([MLmodelData])
const result = MLResponse
const high = result.data.high * 10 ** 10
const low = result.data.low * 10 ** 10
const close = result.data.close * 10 ** 10

return Buffer.concat([Functions.encodeUint256(high), Functions.encodeUint256(low), Functions.encodeUint256(close)])
