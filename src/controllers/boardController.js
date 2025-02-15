import { StatusCodes } from 'http-status-codes';
import { boardService } from '~/services/boardService';

const createNew = async (req, res, next) => {
  try {
    console.log('req.body: ', req.body);

    const createdBoard = await boardService.createNew(req.body);

    //res.status(StatusCodes.CREATED).json({ message: 'POST form controller: API create new board' })
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error)
    //console.log(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message
    // })
  }
}

export const boardController = {
  createNew
}