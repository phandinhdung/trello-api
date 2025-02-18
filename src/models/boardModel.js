import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// chỉ định những field mà ta không muốn cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }); //{ abortEarly: false } để kiểm tra toàn bộ lỗi
}

const createNew = async (data) => {
  try {
    // const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(data);
    // return createdBoard;
    const validData = await validateBeforeCreate(data);
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData);
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => { // id là kiểu ObjectId của Mongo_DB
  try {
    //console.log(`${id}`);
    //console.log('typeof : ',typeof(new ObjectId(`${id}`)));

    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(`${id}`) })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (boardId) => { // id là kiểu ObjectId của Mongo_DB
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(`${boardId}`),
          _destroy: false
        }
      },
      {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ]).toArray();

    return result[0] || null;
  } catch (error) {
    throw new Error(error)
  }
}

// Thêm một columnId vào cuối mảng columnOrderIds
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(`${column.boardId}`) },
      { $push: { columnOrderIds: new ObjectId(`${column._id}`) } },
      { returnDocument: 'after' }
    )

    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
    //   { _id: column.boardId },
    //   { $push: { columnOrderIds: column._id } },
    //   { returnDocument: 'after' }
    // );

    // console.log('chayj qua dday');
    // console.log(result.value);


    return result;
  } catch (error) {
    throw new Error(error);
  }
}

// xoa một columnId ra khoi mảng columnOrderIds
const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(`${column.boardId}`) },
      { $pull: { columnOrderIds: new ObjectId(`${column._id}`) } },
      { returnDocument: 'after' }
    )

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

const update = async (boardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(`${_id}`)));
    }

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(`${boardId}`) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds
}
