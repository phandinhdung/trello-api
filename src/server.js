
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express();

  //bật cho phép dùng req.body json data
  app.use(express.json());

  //Sử dụng đầu api V1
  app.use('/v1', APIs_V1);

  //Middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  // app.get('/', async (req, res) => {
  //   console.log(await GET_DB().listCollections().toArray());
  //   res.end('<h1>Hello World!</h1><hr>');
  // })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  exitHook(() => {
    CLOSE_DB();
  })
}

CONNECT_DB()
  .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
  .then(() => START_SERVER())
  .catch(error => {
    console.error(error);
    process.exit(0); //Dừng sever lại
  });