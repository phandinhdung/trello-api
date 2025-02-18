/**
 * Updated by trungquandev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// chỉ định những field mà ta không muốn cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }); //{ abortEarly: false } để kiểm tra toàn bộ lỗi
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(`${validData.boardId}`),
      columnId: new ObjectId(`${validData.columnId}`)
    };
    return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd);
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => { // id là kiểu ObjectId của Mongo_DB
  try {
    //console.log(`${id}`);
    //console.log('typeof : ',typeof(new ObjectId(`${id}`)));

    return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(`${id}`) })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    console.log('updateData: ', updateData);

    if (updateData.columnId)
      updateData.columnId = new ObjectId(`${updateData.columnId}`);

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(`${cardId}`) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result;
  } catch (error) {
    throw new Error(error);
  }
}


export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update
}