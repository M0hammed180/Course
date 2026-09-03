# Online Learning Platform

A full-stack online learning platform built to provide a complete learning experience for students and powerful management tools for teachers.

## Features

### Student

- Browse available courses
- Enroll in courses
- View course levels
- Watch video lessons
- Track course progress
- Take quizzes with time limits
- View quiz scores and answers
- Add comments to courses

### Teacher

- Create and manage courses
- Add, edit, and delete levels
- Create quizzes and questions
- Set quiz time limits
- Track students enrolled in courses
- Monitor student progress
- View quiz results and scores
- Manage course comments
- Teacher dashboard with statistics

## Dashboard

The teacher dashboard provides an overview of:

- Courses
- Students
- Levels
- Quizzes
- Comments
- Course progress
- Quiz performance
- Student activity

## Technologies

### Frontend

- React.js
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Database

MongoDB is used to store and manage:

- Users
- Courses
- Levels
- Quizzes
- Progress
- Quiz Scores
- Comments

Mongoose is used for schemas, relationships, queries, and database operations.

## MongoDB Aggregation

The project also uses MongoDB Aggregation Pipelines for handling complex data and relationships.

Some of the operations used:

- `$match`
- `$lookup`
- `$unwind`
- `$group`
- `$project`
- `$sum`
- `$size`
- `$first`
- `$sort`

These were used for features such as:

- Calculating student progress
- Getting course statistics
- Tracking students in courses
- Calculating quiz performance
- Connecting data between users, courses, levels, and quizzes

## Project Structure

```text
Online-Learning-Platform
│
├── frontend
│   ├── components
│   ├── Redux
│   ├── App.jsx
│   └── ...
│
└── backend
    ├── controllers
    ├── models
    ├── routes
    ├── middleware
    └── server.js
```
