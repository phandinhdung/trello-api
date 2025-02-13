
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

const createNew = (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(50).trim().strict()
  })

  try {
    console.log(req.body);


    
    res.status(StatusCodes.CREATED).json({ message: 'POST form validation: API create new board' })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const boardValidattion = {
  createNew
}