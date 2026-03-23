import { useState } from 'react'
import './App.css'

function App() {
  const [template, setTemplate] = useState('meeting-summary')
  const [projectName, setProjectName] = useState('')

  const handleGenerate = () => {
    const name = projectName.trim() || '未命名项目'
    const templateLabel =
      template === 'meeting-summary' ? '会议纪要模板' : '周报模板'

    window.alert(`暂不接后端。\n模板：${templateLabel}\n项目名：${name}`)
  }

  return (
    <main className="page">
      <section className="card">
        <div className="intro">
          <span className="badge">最小首页</span>
          <h1>飞书文档助手</h1>
          <p>选择模板并填写项目名，点击按钮后先弹出提示。</p>
        </div>

        <div className="form">
          <label className="field">
            <span>模板</span>
            <select
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
            >
              <option value="meeting-summary">会议纪要模板</option>
              <option value="weekly-report">周报模板</option>
            </select>
          </label>

          <label className="field">
            <span>项目名</span>
            <input
              type="text"
              placeholder="请输入项目名"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
          </label>

          <button type="button" className="primary-button" onClick={handleGenerate}>
            生成文档
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
