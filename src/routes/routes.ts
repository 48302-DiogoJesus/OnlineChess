import Express from 'express'
import GamesRoutes from './games/games'
const app = Express()

app.use(GamesRoutes)

export default app