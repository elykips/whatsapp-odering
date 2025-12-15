import { app } from './app'

const port = app.get('port') || process.env.PORT || 3030

app.listen(port).then(() => {
  console.log(`🚀 Feathers API running on http://localhost:${port}`)
})
