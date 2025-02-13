import express from 'express'
import { StatusCodes } from 'http-status-codes';
import { boardValidattion } from '~/validations/boardValidation';

const Router = express.Router();

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post(boardValidattion.createNew)

export const boardRoute = Router;