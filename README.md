# IFN636 IT Support Ticket System

## Project Description
This project is a full-stack IT Support Ticket System developed using React.js, Node.js, Express, and MongoDB. The system allows users to register, log in, and manage support tickets. Users can create, view, update, and delete tickets. In addition, an admin role is included to monitor users and manage the system.

---

## Features
- User registration and login  
- JWT-based authentication  
- Create, read, update, and delete tickets (CRUD)  
- User dashboard to manage tickets  
- Admin dashboard to monitor users and tickets  
- Role-based access control  
- CI/CD deployment using GitHub Actions  
- Hosted on AWS EC2  

---

## Technologies Used
- Frontend: React.js  
- Backend: Node.js, Express.js  
- Database: MongoDB  
- Authentication: JSON Web Token (JWT)  
- Deployment: AWS EC2  
- Process Manager: PM2  
- CI/CD: GitHub Actions  

---

## Project Structure
backend/  
frontend/  
.github/workflows/  

---

## How to Run the Project

### 1. Clone the repository
git clone https://github.com/Umbrelize/IFN636_IT_support_ticket_system.git

### 2. Navigate to project folder
cd IFN636_IT_support_ticket_system

### 3. Install backend dependencies
cd backend  
npm install  

### 4. Install frontend dependencies
cd ../frontend  
npm install  

### 5. Create .env file in backend folder
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
PORT=5001  

### 6. Run backend
cd backend  
npm run dev  

### 7. Run frontend
cd frontend  
npm start  

---

## Public URL
http://15.134.135.139

---

## Test Accounts

User 1  
Email: LuffyTest@gmail.com  
Password: qwer1234  

User 2  
Email: narutotest@gmail.com  
Password: qwer1234  

Admin  
Email: adminTest@gmail.com  
Password: qwer1234  

---

## Admin Role Setup
To access admin features, the user's role must be set to "admin" in MongoDB.  

Steps:
1. Open MongoDB  
2. Go to users collection  
3. Find the user  
4. Change role from user to admin  

---

## CRUD Functionality
- Create: Users can create new support tickets  
- Read: Users can view their tickets  
- Update: Users can update ticket details or status  
- Delete: Users can delete tickets  

---

## Authentication and Authorisation
The system uses JWT for authentication. After login, users receive a token which is used to access protected routes. In addition, role-based authorisation is used to restrict admin features.

---

## CI/CD Pipeline
This project uses GitHub Actions for CI/CD. When code is pushed to the main branch, the workflow automatically installs dependencies, runs tests, and deploys the application to the EC2 instance.

---

## Notes
- Make sure MongoDB is connected  
- Backend runs on port 5001  
- Frontend connects to backend API  
