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

  if (!response.ok || data.code !== 0) {
    throw new Error(data.msg || 'Failed to get tenant access token')
  }

  return data.tenant_access_token
}

async function createFeishuDoc(accessToken, title, env) {
  const body = {
    title,
  }

  if (env.FEISHU_FOLDER_TOKEN) {
    body.folder_token = env.FEISHU_FOLDER_TOKEN
  }

  const response = await fetch(
    'https://open.feishu.cn/open-apis/docx/v1/documents',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(body),
    },
  )

  const data = await response.json()

  if (!response.ok || data.code !== 0) {
    throw new Error(data.msg || 'Failed to create document')
  }

  const documentId =
    data.data?.document?.document_id || data.data?.document_id || ''
  const documentTitle = data.data?.document?.title || title

  return {
    ok: true,
    title: documentTitle,
    url: `https://feishu.cn/docx/${documentId}`,
  }
}

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (url.pathname !== '/api/create-doc') {
    return json({ ok: false, error: 'Not Found' }, 404)
  }

  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method Not Allowed' }, 405)
  }

  if (!env.FEISHU_APP_ID || !env.FEISHU_APP_SECRET) {
    return json(
      {
        ok: false,
        error: 'Missing FEISHU_APP_ID or FEISHU_APP_SECRET',
      },
      500,
    )
  }

  const projectName = url.searchParams.get('projectName') || '未命名项目'
  const templateName = url.searchParams.get('templateName') || '会议纪要模板'
  const title = `${projectName} - ${templateName}`

  try {
    const accessToken = await getTenantAccessToken(env)
    const result = await createFeishuDoc(accessToken, title, env)
    return json(result)
  } catch (error) {
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
}
