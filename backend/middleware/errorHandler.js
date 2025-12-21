// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    // Only log stack trace for server errors (500), not for client errors (4xx)
    if (!err.status || err.status >= 500) {
        console.error(err.stack);
    }

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
};

// 404 Not Found middleware
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};
