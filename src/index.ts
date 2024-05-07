import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

type Book = {
  id: number
  title: string
  author: string
  imageURL: string
}
const app = new Hono<{Bindings: Bindings}>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/book',  async (c) => {
  const {results} = await c.env.DB.prepare('SELECT * FROM book;').all<Book>()
  if (results.length === 0) {
    return c.text('Not Found', 404)
  }
  return c.json(results)
})

app.get('/book/:id', async (c) => {
  const {results} = await c.env.DB.prepare('SELECT * FROM book WHERE id = ?').bind(c.req.param('id')).all<Book>()
  if (results.length === 0) {
    return c.text('Not Found', 404)
  }
  return c.json(results)
})

export default app
