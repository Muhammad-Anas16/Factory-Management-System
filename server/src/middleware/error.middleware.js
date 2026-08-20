import ApiError from '../utils/ApiError.js';

function notFoundHandler(req, res, next) {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Internal server error';

    if (!(err instanceof ApiError)) {
        console.error('[UNHANDLED ERROR]', err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: err instanceof ApiError ? err.details : null,
    });
}

export { notFoundHandler, errorHandler };