const ServerError = require("../errors/InternalServerError");
const RunTimeExceptionError = require("../errors/RunTimeExceptionError");
const { isObject } = require("../services/validator.data");

module.exports.handleAsyncRequest = async (execution) => {
  const response = await execution.catch((e) => ({ error: e }));
  if (response && response.erorr) {
    console.log(
      "Error while executing request \n",
      JSON.stringify(response.error)
    );
    throw new ServerError(
      "Server error! Could not complete the request due to due unknown error."
    );
  }
  return response;
};

module.exports.handleResponseFormat = (data, projections = []) => {
  if (!data) {
    return null;
  }
  if (data.toObject) {
    data = data.toObject();
  }
  if (data.toJSON) {
    data = data.toJSON();
  }

  for (let i = 0; i < projections.length; i++) {
    if (data[projections[i]]) {
      delete data[projections[i]];
    }
  }

  const { createdAt, updatedAt, _id, __v, ...rest } = data;

  return {
    ...rest,
    created_at: createdAt,
    updated_at: updatedAt,
    id: _id,
  };
};

module.exports.handleReassignField = (
  record,
  currentFieldName,
  newFieldName
) => {
  if (!isObject(record) || !currentFieldName || !newFieldName) {
    throw new RunTimeExceptionError(
      'Invalid arguments. "record", "currentFieldName" and "newFieldName" are required.'
    );
  }
  const copy = { ...record };
  copy[newFieldName] = record[currentFieldName];
  delete copy[currentFieldName];
  return copy;
};

module.exports.extractFieldsFromObject = (inputObject, fieldList = []) => {
  const selectedFields = {};
  for (const field of fieldList) {
    if (inputObject.hasOwnProperty(field)) {
      selectedFields[field] = inputObject[field];
    }
  }
  return selectedFields;
};

/**
 * Adds a new attribute to the given object with the specified name and value.
 * @param build - The object to which the attribute will be added.
 * @param value - The value to assign to the new attribute.
 * @param attributeName - The name of the new attribute.
 * @param castTo - Converts the value to the specified type. Can be 'uppercase', 'lowercase', or 'number'.
 * @example
 * const build = { name: 'John Doe' }
 * @returns The modified object with the new attribute added.
 */
module.exports.addAttribute = (build, value, attributeName, castTo) => {
  if (!value || !attributeName || !isObject(build)) return build;

  switch (castTo) {
    case "uppercase":
      value = String(value).toUpperCase();
      break;
    case "lowercase":
      value = String(value).toLowerCase();
    case "number":
      value = Number(value);
    default:
      break;
  }

  build[attributeName] = value;
  return build;
};
