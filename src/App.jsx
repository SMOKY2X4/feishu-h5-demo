import { useState } from 'react'
import './App.css'

function App() {
  const [template, setTemplate] = useState('meeting-summary')
  const [projectName, setProjectName] = useState('')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    const trimmedProjectName = projectName.trim()

    if (!trimmedProjectName) {
      setMessage('请先输入项目名')
      setResult(null)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const templateName =
        template === 'meeting-summary' ? '会议纪要模板' : '周报模板'
      const query = new URLSearchParams({
        projectName: trimmedProjectName,
        templateName,
      })
      const response = await fetch(`/api/create-doc?${query.toString()}`)

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult(null)
      setMessage('接口调用失败，请检查后端服务是否启动')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <h1>飞书文档助手</h1>

        <label className="field">
          <span>模板</span>
          <select value={template} onChange={(event) => setTemplate(event.target.value)}>
            <option value="meeting-summary">会议纪要模板</option>
            <option value="weekly-report">周报模板</option>
          </select>
        </label>

        <label className="field">
          <span>项目名</span>
          <input
            type="text"
            value={projectName}
            placeholder="请输入项目名"
            onChange={(event) => setProjectName(event.target.value)}
          />
        </label>

        <button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? '生成中...' : '生成文档'}
        </button>

        {message && <p className="message">{message}</p>}

        {result && (
          <section className="result">
            <p>状态：生成成功</p>
            <p>文档标题：{result.title}</p>
            <p>
              文档链接：
              <a href={result.url} target="_blank" rel="noreferrer">
                {result.url}
              </a>
            </p>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
