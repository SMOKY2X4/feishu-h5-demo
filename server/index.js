import express from 'express'

const app = express()
const port = 3000

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/api/create-doc', (req, res) => {
  res.json({
    ok: true,
    title: '后端生成的文档',
    url: 'https://example.com/doc/backend',
  })
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
