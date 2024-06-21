const {
    isObject,
    isArray,
    isNumber,
    isInteger,
    isString,
    isDate,
    isID,
} = require('./validator.data');
const { mongoose } = require('../../services/database');
const RunTimeExceptionError = require('../../errors/RunTimeExceptionError');

const toDate = value => {
    if (isDate(value)) {
        return new Date(value);
    }
    //number cast to default linux date
    if (isNumber(value)) {
        return new Date(value * 1000);
    }
    //the default linux date
    return new Date(1000);
}

const toString = value => String(value);

const toInteger = value => Number.parseInt(value, 10);

const toBoolean = value => !value;

const toFloat = value => Number.parseFloat(value);

const toArray = value => isArray(value) ? value : [value];

const toObject = value => isObject(value) ? value : { value };

const toMongoId = value => {
    switch (value) {
        case isID(value):
            return value;
        case isString(value):
            return mongoose.Types.ObjectId(value);
        case isNumber(value):
            return mongoose.Types.ObjectId(toString(numberValue));
        default:
            return new mongoose.Types.ObjectId();
    }
}

const toLowerCase = (str) => {
    return str && isString(str)
        ? str.toLowerCase()
        : str;
}

const toUpperCase = (str) => {
    return str && isString(str)
        ? str.toUpperCase()
        : str;
}

const capitalize = (str) => {
    return str && isString(str)
        ? str.charAt(0).toUpperCase() + str.slice(1)
        : str;
}

const getLength = value => {
    if (!value) return 0;

    if (isArray(value) || isString(value)) {
        return value.length;
    }

    if (isObject(value)) {
        return Object.keys(value).length;
    }

    if (isNumber(value)) return toInteger(value)

    return 0;  // default to empty array or object
}

const ageToDate = ageInYears => {
    if (!isInteger(ageInYears)) throw new RunTimeExceptionError(`The age ${ageInYears} is not a valid integer.`);
    const currentDate = new Date();
    const birthYear = currentDate.getFullYear() - ageInYears;
    const birthDate = new Date(birthYear, 0, 1);
    return birthDate;
}

const dateToAge = date => {
    if (!isDate(ageInYears)) throw new RunTimeExceptionError(`${date} is not a valid date.`);
    const dateValue = new Date(date);
    // Calculate the current date
    const currentDate = new Date();

    // Calculate the difference in years
    const age = currentDate.getFullYear() - new Date(dateValue).getFullYear();

    // Adjust the age if the birthday hasn't occurred yet this year
    if (currentDate < new Date(currentDate.getFullYear(), dateValue.getMonth(), dateValue.getDate())) {
        age--;
    }

    return age;
}

const setDateRangeQuery = (startDate, endDate) => {
    if (!isDate(startDate) || !isDate(endDate)) {
        throw new RunTimeExceptionError('The `setDateRangeQuery` start of end date is invalid.')
    }
    return { $gte: new Date(startDate + "00:00:00"), $lte: new Date(endDate + "23:59:59") }
}

const setMinimumDate = date => {
    if (!isDate(date)) {
        throw new RunTimeExceptionError('The `setMinimumDate`date is invalid.')
    }
    return { $gte: new Date(startDate + "00:00:00") }
}

const setMaxmumDate = date => {
    if (!isDate(date)) {
        throw new RunTimeExceptionError('The `setMaxmumDate` date is invalid.')
    }
    return { $lte: new Date(endDate + "23:59:59") }
}

const trim = value => {
    if (isString(value)) {
        return toString(value).trim();
    }
    return value;
}

const setQueryRange = (min, max) => {
    if (!isDate(min) || !isDate(max)) {
        throw new RunTimeExceptionError('The `setQueryRange` min or max is invalid.')
    }
    return { $gte: min, $lte: max }
}


module.exports = {
    setQueryRange,
    setMaxmumDate,
    setMinimumDate,
    ageToDate,
    dateToAge,
    toDate,
    toString,
    toInteger,
    toFloat,
    toMongoId,
    toBoolean,
    toArray,
    toObject,
    toLowerCase,
    toUpperCase,
    capitalize,
    getLength,
    trim,
    setDateRangeQuery,
}
