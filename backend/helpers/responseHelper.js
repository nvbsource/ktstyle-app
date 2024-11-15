// helpers/responseHelper.js

const successResponse = (res, message, data = null) => {
    res.json({
        status: "success",
        message,
        ...(data && { data })  // Chỉ thêm `data` nếu không phải là null
    });
};

const errorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
        status: "error",
        message
    });
};

module.exports = {
    successResponse,
    errorResponse
};
