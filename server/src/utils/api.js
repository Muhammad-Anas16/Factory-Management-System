export function ok(res, data = {}, message = 'Success', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function fail(res, message, status = 400, error = null) {
  return res.status(status).json({ success: false, message, error });
}
