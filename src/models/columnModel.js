
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// chỉ định những field mà ta không muốn cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }); //{ abortEarly: false } để kiểm tra toàn bộ lỗi
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const newColumnToAdd = {
      ...validData,
      boardId: new ObjectId(`${validData.boardId}`)
    };

    return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd);
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (columnId) => { // id là kiểu ObjectId của Mongo_DB
  try {
    //console.log(`${id}`);
    //console.log('typeof : ',typeof(new ObjectId(`${id}`)));

    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(`${columnId}`) })
  } catch (error) {
    throw new Error(error)
  }
}

// Thêm một cardId vào cuối mảng cardOrderIds
const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(`${card.columnId}`) },
      { $push: { cardOrderIds: new ObjectId(`${card._id}`) } },
      { returnDocument: 'after' }
    )

    // console.log('chay qua day card');
    // console.log(result.value);


    return result;
  } catch (error) {
    throw new Error(error);
  }
}

const update = async (columnId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    //console.log ('updateData: ', updateData);

    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(_id => (new ObjectId(`${_id}`)));
    }

    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(`${columnId}`) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

const deleteOneById = async (columnId) => { // id là kiểu ObjectId của Mongo_DB
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(`${columnId}`) })
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById
}