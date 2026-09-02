import { ApiError } from "../utils/error.js";

export function notFound(_req, _res, next) {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  // SQLite foreign-key errors (jaise ek category/party delete karna jo
  // article/bill/challan mein abhi bhi use ho rahi ho) raw driver error ke
  // roop mein aate hain — inhe ek clean 409 message mein badal do, generic
  // 500 ki jagah.
  if (
    err.code === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
    (err.code === "SQLITE_CONSTRAINT" && /FOREIGN KEY/i.test(err.message || ""))
  ) {
    return res.status(409).json({
      success: false,
      message:
        "This item is still linked to other records and cannot be deleted.",
      error:
        process.env.NODE_ENV === "production"
          ? null
          : { name: err.name, details: err.message },
    });
  }

  const status = err.status || (err.code === "LIMIT_FILE_SIZE" ? 413 : 500);
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? null
        : { name: err.name, details: err.details || null },
  });
}
