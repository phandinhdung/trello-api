
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { BOARD_TYPES } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Tiêu đề là được yêu cầu phải có',
      'string.empty': 'Tiêu đề phải khác rỗng',
      'string.min': 'tiêu đề phải có ít nhất .. kí tự',
      'string.max': 'Tiêu đề phải <= 50 kí tự',
      'string.trim': 'Tiêu đề phải không có khoảng trắng đầu và cuối'
    }),
    description: Joi.string().required().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
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

const update = async (req, res, next) => {
  // không dung required() trong trường hợp update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    //{ abortEarly: false } để kiểm tra toàn bộ lỗi
    //allowUnknown: true,  để cho phép không cần đẩy lên một số field lên
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    });

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),

    nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().required().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    //{ abortEarly: false } để kiểm tra toàn bộ lỗi
    //allowUnknown: true,  để cho phép không cần đẩy lên một số field lên
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    });

    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
}

export const boardValidattion = {
  createNew,
  update,
  moveCardToDifferentColumn
}