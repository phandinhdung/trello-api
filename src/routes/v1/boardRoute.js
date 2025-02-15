import express from 'express'
import { StatusCodes } from 'http-status-codes';
import { boardValidattion } from '~/validations/boardValidation';
import { boardController } from '~/controllers/boardController';

const Router = express.Router();

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post(boardValidattion.createNew, boardController.createNew)

Router.route('/:id')
.get(boardController.getDetails)
.put()

export const boardRoute = Router;