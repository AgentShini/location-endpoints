const parser = require("../../../services/request-validator");



const validateCreateOrderRequest = (data) => {
    const build = {};

    parser('destination', data.destination)
    .required()
    .type('string')
    .parseAndBuild(build);

    parser('fuel_type', data.destination)
    .required()
    .type('string')
    .parseAndBuild(build);

    parser('amount_in_litres', data.destination)
    .required()
    .type('string')
    .parseAndBuild(build);
}

const createOrderRequest = async (data) => {
    return await orderRepository.createOrder(data) 
}

module.exports.validateCreateOrderRequest = validateCreateOrderRequest;
module.exports.createOrderRequest = createOrderRequest;