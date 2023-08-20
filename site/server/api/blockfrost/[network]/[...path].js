// Because we need to keep secrets secret, blockfrost requests are proxied through here.
export default defineEventHandler(async (event) => {
  try {
    const lucidblockfrostFetch = await useBlockfrost(network); // From utils since can't access composable here?

    // body: await readBody(event)

    return await blockfrostFetch(`${event.context.params.path}`, { method: event.node.req.method } )
  } catch (error) {
    console.log(error)
    return new Response(error.message, { status: 500 })
  }
})
  