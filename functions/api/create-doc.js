export async function onRequest(context) {
  return new Response(
    JSON.stringify({
      ok: true,
      title: 'Cloudflare Functions 测试文档',
      url: 'https://example.com/doc/cloudflare',
    }),
    {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    },
  )
}
