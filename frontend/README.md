# Factory Management System - Clean React Frontend

A clean ES6 JavaScript React frontend for the local Factory Management System.

## Stack
- React 19
- React Router 7 (`react-router`, not `react-router-dom`)
- Axios
- Vite

## Run
```powershell
npm i
npm run dev
```

API defaults to `http://127.0.0.1:4000/api`.

Set these in `.env` when needed:
- `VITE_API_URL`
- `VITE_UPLOADS_URL`

## Notes
- Authentication state is kept in `AuthContext`.
- Page/action authorization is centralized in `PermissionContext`.
- User permission editor supports View/Create/Edit/Delete plus bulk Select All.
- Article creation supports multiple images through `multipart/form-data` for the server's Multer endpoint.
- Business modules use a consistent, simple table/form pattern.
