import express from 'express'
import { columnValidattion } from '~/validations/columnValidation';
import { columnController } from '~/controllers/columnController';

const Router = express.Router();

Router.route('/')
  .post(columnValidattion.createNew, columnController.createNew)

Router.route('/:id')
  .put(columnValidattion.update, columnController.update)


export const columnRoute = Router;