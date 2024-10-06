# Echo 

## Members
| Name | Email | Discord |
|------|-------|---------|
| Shabbir Yusufali | shabyusufali@gmail.com | shabzprime
| Ali Moazin Devjiani | adevjiani@gmail.com | .amace.
| Salman Ayaz | salmanayazz@gmail.com | spiravit
| Gurkirat Singh | gsa119@sfu.ca | garry1357

## Description
&emsp; Echo is a web application that allows users to connect with other users in their area. Users can create an account, post messages and pictures, and view other users' posts in their area. Once you enter an area, you can view posts from other users in that area. After leaving the area, you can no longer view posts from that area. This encourages users to visit different areas to discover new posts.

## Features
- User Authentication
- Create Posts
- View Posts in Your Area

## What is it built with?
### Stack
- MongoDB
- Express
- React with TypeScript
- Node.js with TypeScript
### Libraries and APIs
- [Clerk](https://www.clerk.dev/)
- [Mongoose](https://mongoosejs.com/)
- [React-Router](https://reactrouter.com/)
- [Morgan](https://www.npmjs.com/package/morgan)
- [express-session](https://www.npmjs.com/package/express-session)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## Installation
1. Clone the repository
2. Run `npm install` in the server directory
3. Run `npm install` in the client directory
4. Place a `.env` file in the server directory with the following contents:
```env
MONGO_KEY=<YOUR MONDO KEY>
CLERK_SECRET_KEY=<YOUR CLERK SECRET KEY>
PORT=<DESIRED PORT NUMBER> # Optional, defaults to 5000 
```
5. Place a `.env` file in the client directory with the following contents:
```env
VITE_CLERK_PUBLISHABLE_KEY=<YOUR CLERK PUBLISHABLE KEY>
```

6. Run `npm run dev` in the server directory
7. Run `npm run dev` in the client directory
