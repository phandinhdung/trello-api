import express from 'express'
import { cardValidattion } from '~/validations/cardValidation';
import { cardController } from '~/controllers/cardController';

const Router = express.Router();

Router.route('/')
  .post(cardValidattion.createNew, cardController.createNew)

export const cardRoute = Router;