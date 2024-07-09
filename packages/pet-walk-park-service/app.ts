import { createExpressServer } from 'routing-controllers'
import { json, urlencoded } from 'body-parser'
import 'reflect-metadata'
import ds from './data-source'
import { UserController } from './src/controllers/user.controller'
import { ParkController } from './src/controllers/park.controller'

// 新增：初始化 DataSource
ds.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((e: any) => {
    console.log('Error during Data Source initialization:', e)
  })

const app = createExpressServer({
  // 新增：添加 UserController、ParkController
  controllers: [UserController, ParkController],
  cors: true, // 启用 CORS，允许跨域请求
})

// body 解析相关中间件
// 解析 json 格式
app.use(json())
// 解析 urlencoded body
// 会在 request 对象上挂载 body 属性，包含解析后的数据。
// 这个新的 body 对象包含 key-value 键值对，若设置 extended 为 true，则键值可以是任意累心个，否则只能是字符串或数组。
app.use(urlencoded({ extended: true }))


// 全局错误处理中间件
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log(`  App is running at http://localhost:3000\n`)
  console.log('  Press CTRL-C to stop\n')
})