
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from '~/config/cors'

const START_SERVER = () => {
  const app = express();

  app.use(cors(corsOptions));
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

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Production: Hello ${env.AUTHOR}, I am running at Port: ${process.env.PORT}`)
    })
  } else {//môi trường local dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`Local DEV: Hello ${env.AUTHOR}, I am running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }


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