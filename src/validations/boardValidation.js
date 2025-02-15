
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { boardService } from '~/services/boardService';

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(255).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false }); //{ abortEarly: false } để kiểm tra toàn bộ lỗi

    //đẩy qua tầng tiếp theo
    next()
  } catch (error) {
    // const errorMessage = new Error(error).message;
    // const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    // next(customError);

    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));


    //console.log(error)
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    //   errors: new Error(error).message
    // })
  }
}

export const boardValidattion = {
  createNew
}