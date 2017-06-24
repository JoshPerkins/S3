const { errors } = require('arsenal');

const constants = require('../../constants');

/**
 * @function validateQueryAndHeaders
 * Check request for unsupported queries or headers
 * @param {string} reqMethod - request method
 * @param {object} reqQuery - request query object
 * @param {object} reqHeaders - request headers object
 * @param {object} log - Werelogs logger
 * @return {object} - empty object or object with error boolean property
 */

function validateQueryAndHeaders(reqMethod, reqQuery, reqHeaders, log) {
    const unsupportedQuery = Object.keys(reqQuery).some(key => {
        if (constants.unsupportedQueries[key]) {
            log.debug(`encountered unsupported query ${key}`, {
                method: 'validateQueryAndHeaders',
            });
            return true;
        }
        return false;
    });
    if (unsupportedQuery) {
        return { error: errors.NotImplemented };
    }
    const encryptionHeader = constants.encryptionHeaders.some(i => {
        if (reqHeaders[i] !== undefined) {
            log.debug(`encountered unsupported header ${i}`, {
                method: 'validateQueryAndHeaders',
            });
            return true;
        }
        return false;
    });
    // for now only unsupported headers are encryption headers and we only
    // return NotImplemented on a PUT
    if (encryptionHeader && reqMethod.toUpperCase() === 'PUT') {
        return { error: errors.NotImplemented };
    }
    return {};
}

module.exports = validateQueryAndHeaders;
