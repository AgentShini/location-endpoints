
const { handleAsyncRequest,handleResponseFormat} = require("../../../../services/db");
const { add,findOne,findByIdAndUpdate } = require('../../../../services/repository');



async function createUserAdmin(data) {

const order = await handleAsyncRequest(add(UserAdminModel, data));

return handleResponseFormat(order);
};