# Chat App - MERN Stack

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Secure Deployment Instructions

### Using Render's Blueprint (Recommended)

1. Fork this repository to your GitHub account
2. Sign in to [Render](https://dashboard.render.com/)
3. Click on "Blueprints" in the sidebar
4. Click "New Blueprint Instance"
5. Connect to your GitHub account and select this repository
6. Render will automatically detect the `render.yaml` file and set up the services
7. **Important Security Step**: You will need to manually set your sensitive environment variables:
   - After the Blueprint creates your services but before deployment completes, you'll be prompted to set values for environment variables marked with `sync: false`
   - Enter your secure values for:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `CLOUDINARY_URL`
8. Click "Apply" to start the deployment

### Manual Deployment (Alternative)

If you prefer to deploy each service manually:

1. Create each service manually in the Render dashboard
2. For the Backend Web Service:
   - Link to your GitHub repository
   - Set Root Directory to `backend`
   - Set Build Command to `npm install`
   - Set Start Command to `npm start`
   - Manually add all required environment variables from your .env file
3. For the Frontend Static Site:
   - Link to the same GitHub repository
   - Set Root Directory to `frontend`
   - Set Build Command to `npm install && npm run build`
   - Set Publish Directory to `dist`
   - Add environment variable: `VITE_API_URL` = your backend URL

## Local Development

### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Environment Variables

The application uses environment variables for configuration. For security:

1. **Never commit sensitive credentials to your repository**
2. Keep a local `.env` file for development that is in your `.gitignore`
3. For production, set environment variables through Render's dashboard
4. Use `.env.example` files to document which environment variables are needed without showing actual values

### Required Environment Variables

Backend:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CLOUDINARY_*`: Cloudinary credentials for image uploads
- `PORT`: Port for the backend server (default: 5000)
- `NODE_ENV`: Set to "production" for deployment
- `FRONTEND_URL`: URL of your deployed frontend

Frontend:
- `VITE_API_URL`: URL of your backend API
