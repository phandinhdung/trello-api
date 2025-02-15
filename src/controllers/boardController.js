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

const getDetails = async (req, res, next) => {
  try {
    console.log('req.params: ', req.params);
    const boardId = req.params.id;
    const board = await boardService.getDetails(boardId);

    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
}

export const boardController = {
  createNew,
  getDetails
}