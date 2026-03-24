function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
  })
}

async function getTenantAccessToken(env) {
  const response = await fetch(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        app_id: env.FEISHU_APP_ID,
        app_secret: env.FEISHU_APP_SECRET,
      }),
    },
  )

  const data = await response.json()

  if (!response.ok || data.code !== 0 || !data.tenant_access_token) {
    throw new Error(data.msg || '获取 tenant_access_token 失败')
  }

  return data.tenant_access_token
}

async function createDoc(tenantAccessToken) {
  const response = await fetch('https://open.feishu.cn/open-apis/docx/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tenantAccessToken}`,
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      title: '测试文档',
    }),
  })

  const data = await response.json()

  if (!response.ok || data.code !== 0) {
    throw new Error(data.msg || '创建文档失败')
  }

  const documentId = data.data?.document?.document_id || data.data?.document_id
  const title = data.data?.document?.title || '测试文档'

  if (!documentId) {
    throw new Error('创建文档成功，但未拿到 document_id')
  }

  return {
    ok: true,
    title,
    url: `https://feishu.cn/docx/${documentId}`,
  }
}

export async function onRequest(context) {
  const { env } = context

  if (!env.FEISHU_APP_ID || !env.FEISHU_APP_SECRET) {
    return json(
      {
        ok: false,
        error: '缺少 FEISHU_APP_ID 或 FEISHU_APP_SECRET',
      },
      500,
    )
  }

  try {
    const tenantAccessToken = await getTenantAccessToken(env)
    const result = await createDoc(tenantAccessToken)
    return json(result)
  } catch (error) {
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      500,
    )
  }
}
