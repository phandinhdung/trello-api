import express from 'express'
import { columnValidattion } from '~/validations/columnValidation';
import { columnController } from '~/controllers/columnController';

const Router = express.Router();

Router.route('/')
  .post(columnValidattion.createNew, columnController.createNew)

export const columnRoute = Router;