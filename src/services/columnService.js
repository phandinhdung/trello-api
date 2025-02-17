/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel';
import { boardModel } from '~/models/boardModel';

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId);

    if (getNewColumn) {
      // Cấu trúc dữ liệu trả về font-end có mảng cards nên phải thêm mảng card vào dữ liệu trả về
      getNewColumn.cards = [];

      // cập nhật lại columnOrderIds trong board
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
}

export const columnService = {
  createNew
}