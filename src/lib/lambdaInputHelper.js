var AWS = require("aws-sdk");
function handleTestInput(event, apiSpec) {
  if (event.testing) {
    var credentials = new AWS.SharedIniFileCredentials({ profile: event.testProfile });
    AWS.config.credentials = credentials;
    process.env.enviroment = "jest"
    process.env.TZ = 'Asia/Seoul'
    process.env.app = event.app;
    process.env.stage = event.stage;
    process.env.testing = true;
    if (event.hasOwnProperty("requestContext")) {
      event["requestContext"]["identity"] = { sourceIp: "-" }
    }
    else {
      event["requestContext"] = { identity: { sourceIp: "-" } }
    }
    event.env.forEach((item, index) => {
      process.env[item.key] = item.value;
    });
  }
  const method = apiSpec.method.toLowerCase();
  let inputObject;
  if (method === "get" || method === "delete" || method == "websocket") {
    inputObject = (event.queryStringParameters) ? event.queryStringParameters : {};
  }
  else {
    inputObject = (event.body) ? JSON.parse(event.body) : {};
  }
  let inputCheckObject = checkInput(inputObject, apiSpec)

  inputObject = setDefaultValue(inputObject, apiSpec)

  return { inputObject, inputCheckObject };

}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}
function setDefaultValue(inputObject, apiSpec) {
  const parms = apiSpec.parameters;
  for (var property in parms) {
    const parm = parms[property];
    if (parm.default != undefined) {
      if (inputObject[property] === undefined) {
        if (parm.default == "undefined") {
          inputObject[property] = undefined;
        }
        else {
          inputObject[property] = parm.default;
        }
      }
    }

  }
  return inputObject;

}
function createColumnSpec(apiSpec) {

  const prop = apiSpec.responses.Columns.sub;
  let dt = 0;
  let columnsMap = [];
  for (var property in prop) {
    columnsMap.push({ db: property, dt: dt++, searchable: (prop[property].searchable) ? true : false, projection: (prop[property].projection != undefined && prop[property].projection === false) ? false : true })
  }
  return columnsMap;
}
function createRedirectionResponse(url, body, newToken) {
  var response = {
    isBase64Encoded: true,
    statusCode: 302,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Expose-Headers": "*",
      "Refreshed-Token": (newToken) ? newToken : "none",
      "Access-Control-Allow-Origin": "*",
      Location: url
    },
    body: JSON.stringify(body)
  };
  return response;
}
function createOKResponse(body, newToken) {
  let response = {
    isBase64Encoded: true,
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Expose-Headers": "*",
      "Refreshed-Token": (newToken) ? newToken : "none",
      "Access-Control-Allow-Origin": "*",
      "api-version": process.env.version,
    },
    body: JSON.stringify(body)
  };
  return response;
}
function createPredefinedErrorResponse(errors, errorType, comment) {

  // if (comment) {
  //   console.log(comment);
  // }
  const obj = errors[errorType];
  const reason = obj.reason;
  const statusCode = obj.status_code;
  let body = { "result": errorType };
  if (reason && process.env.stage === "dev") {
    body["reason"] = reason;
  }
  let response = {
    isBase64Encoded: true,
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "api-version": process.env.version,
    },
    body: JSON.stringify(body)
  };
  //console.log(response);
  return response;
}
function createErrorResponse(httpCode, body, reason = undefined) {
  let response = {
    isBase64Encoded: true,
    statusCode: httpCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "api-version": process.env.version,
    },
    body: JSON.stringify(body)
  };
  //console.log(response);
  return response;
}
async function sendError(error, event) {
  if (!event.testing) {
    const path = `(${process.env.version})${process.env.app}${event.requestContext.path}/${event.requestContext.httpMethod}`;

    // console.log(path);
    // console.log(error);

    const lambdaName = process.env.error_trace_lambda
    var stack = new Error().stack
    const obj = {};
    Error.captureStackTrace(obj);
    const params = {
      FunctionName: lambdaName,
      Payload: JSON.stringify({
        'path': path,
        'error': error,
        'error_str': error.toString(),
        'stack': stack,
        'obj_stack': obj.stack,
      }),

    };
    //console.log(params);
    try {
      const lambda = new AWS.Lambda();
      const result = await lambda.invoke(params).promise();
      //  console.log(result);
    }
    catch (e) {
      console.error(e);
    }

  }
}

async function createInternalErrorResponse(event, error, httpCode, body, reason = undefined) {

  if (reason && process.env.stage === "dev") {
    body["result"] = reason;
  }
  if (error) {
    await sendError(error, event);

  }
  let response = {
    isBase64Encoded: true,
    statusCode: httpCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "api-version": process.env.version,
    },
    body: JSON.stringify(body)
  };
  return response;
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkInput(inputObject, apiSpec) {

  if (!inputObject && Object.keys(apiSpec.parameters).length) {
    return { "passed": false, "result": "parameter_does_not_exist", "stack": "-" }
  }
  const check = iterate(apiSpec.parameters, inputObject, "inputObject");

  if (check != true) {
    return { "passed": false, "result": check.reason, "stack": check.stack }
  }
  return ({ "passed": true });
}
function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}
function iterate(apiSpec, inputObject, stack = "") {

  for (var property in apiSpec) {

    if (apiSpec.hasOwnProperty(property)) {
      const val = apiSpec[property];

      if (val.req && ((inputObject[property] === undefined) || inputObject[property].length < 1)) {
        return { "result": "parameter_not_exist", "stack": stack + '.' + property, "reason": `${property} is required` };
      }
      if (inputObject[property] != undefined) {
        if (val.type === "Integer") {
          if (isNaN(inputObject[property])) {
            return { "result": "invalid_type_of_parameter", "reason": "invalid_type_of_parameter,expected integer", "stack": stack + '.' + property };
          }
          if (inputObject[property].length > 0) {
            const valueToInspect = parseInt(inputObject[property]);
            if (val.min) {
              if (val.min > valueToInspect) {
                return { "result": "parameter_value_too_small", "reason": `parameter less than min, expected greater than ${val.min}`, "stack": stack + '.' + property };
              }
            }
            if (val.max) {
              if (val.max < valueToInspect) {
                return { "result": "parameter_value_too_big", "reason": `parameter greater than max, expected less than ${val.max}`, "stack": stack + '.' + property };
              }
            }
          }
        }
        if (val.type === "Float") {
          if (isNaN(inputObject[property])) {
            return { "result": "invalid_type_of_parameter", "reason": "invalid_type_of_parameter,expected float", "stack": stack + '.' + property };
          }
          if (!isFloat(inputObject[property])) {
            return { "result": "invalid_type_of_parameter", "reason": "invalid_type_of_parameter,expected float", "stack": stack + '.' + property };
          }
          if (inputObject[property].length > 0) {
            const valueToInspect = parseInt(inputObject[property]);
            if (val.min) {
              if (val.min > valueToInspect) {
                return { "result": "parameter_value_too_small", "reason": `parameter less than min, expected greater than ${val.min}`, "stack": stack + '.' + property };
              }
            }
            if (val.max) {
              if (val.max < valueToInspect) {
                return { "result": "parameter_value_too_big", "reason": `parameter greater than max, expected less than ${val.max}`, "stack": stack + '.' + property };
              }
            }
          }
        }
        if (val.type === "Array") {

          if (!Array.isArray(inputObject[property])) {

            return { "result": "invalid_type_of_parameter", "reason": `invalid_type_of_parameter,expected array`, "stack": stack + '.' + property };

          }
          if (val.req) {
            if (inputObject[property].length < 1) {
              return { "result": "array_is_empty", "reason": `array_is_empty`, "stack": stack + '.' + property };
            }
          }
        }
        if (val.type.toLowerCase() === "string") {
          const valueToInspect = inputObject[property]
          // if (valueToInspect.length < 1) {
          //   return { "result": "invalid_type_of_parameter", "reason": `parameter cannot be an empty string`, "stack": stack + '.' + property };
          // }
          if (val.notEmpty) {
            if (valueToInspect === "") {
              return { "result": "parameter_canot_be_an_emptystring", "reason": `parameter cannot be an empty string`, "stack": stack + '.' + property };
            }
          }
          if (val.min) {
            if (valueToInspect.length > 0 && (val.min > valueToInspect.length)) {
              return { "result": "parameter_length_too_short", "reason": `parameter length less than min, expected greater than ${val.min}`, "stack": stack + '.' + property };
            }
          }
          if (val.max) {
            if (valueToInspect.length > 0 && (val.max < valueToInspect.length)) {
              return { "result": "parameter_length_too_long", "reason": `parameter length greater than max, expected less than ${val.max}`, "stack": stack + '.' + property };
            }
          }
        }
        if (val.type.toLowerCase() === "password") {
          const valueToInspect = inputObject[property]

          if (val.min) {
            if (val.min > valueToInspect.length) {
              return { "result": "parameter_length_too_short", "reason": `parameter length less than min, expected greater than ${val.min}`, "stack": stack + '.' + property };
            }
          }
          if (val.max) {
            if (val.max < valueToInspect.length) {
              return { "result": "parameter_length_too_long", "reason": `parameter length greater than max, expected less than ${val.max}`, "stack": stack + '.' + property };
            }
          }
        }


      }
    }
  }
  return true;
}






module.exports.createRedirectionResponse = createRedirectionResponse;
module.exports.createOKResponse = createOKResponse;
module.exports.handleTestInput = handleTestInput;
module.exports.checkInput = checkInput;
module.exports.createErrorResponse = createErrorResponse;
module.exports.createColumnSpec = createColumnSpec;
module.exports.setDefaultValue = setDefaultValue;
module.exports.replaceAll = replaceAll;

module.exports.createInternalErrorResponse = createInternalErrorResponse;
module.exports.sendError = sendError;
module.exports.createPredefinedErrorResponse = createPredefinedErrorResponse;
