const AuthenticationError = require('../errors/AuthenticationError');
const AuthorizationError = require('../errors/AuthorizationError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictRequestError = require('../errors/ConflictRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const RunTimeExceptionError = require('../errors/RunTimeExceptionError');

module.exports.success = function (res, payload, statusCode) {
    let json = {
        code: statusCode || 200,
        status: 'ok',
    }

    if (Array.isArray(payload)) {
        json['data'] = payload
    } else {
        if (payload && Object.keys(payload).length !== 0) {
            json['data'] = payload
        }
    }
    return res.status(json.code).json(json)
}

module.exports.error = function (res, error) {
    let statusCode;
    let statusName;
    let message;

    const errorInstance = [
        AuthenticationError,
        AuthorizationError,
        BadRequestError,
        ConflictRequestError,
        NotFoundError,
        InternalServerError,
        RunTimeExceptionError,
    ].find(errorType => error instanceof errorType)

    if (errorInstance) {
        statusCode = error.statusCode === 523 ? 500 : error.statusCode;
        statusName = error.name;
        message = error.statusCode === 523 ? 'Runtime Exception! Internal Server Error' : error.message;
    } else {
        statusCode = 500;
        statusName = 'INTERNAL_SERVER_ERROR';
        message = 'Oops! Try again later'
    }

    if (['test', 'development'].includes(process.env.NODE_ENV)) {
        //show table error if Runtime exception
        if (statusCode === 523 && process.env.NODE_ENV === 'development') {
            console.debug('\nDEBUG ERROR', JSON.stringify(error))
        } else {
            //TODO: ADD LOGGER
            console.log(error);
        }
    }

    return res.status(statusCode).json({
        code: statusCode,
        error: statusName,
        status: 'error',
        msg: message
    })
}