As an administrator

I want to register and securely log into the system

So that I can manage the entire university assignment approval platform



Acceptance Criteria:

Create a separate script to insert admin credential into the database(registration) or use hardcoded data in the source code.4
Password must be hashed using bcrypt before storage. 
Admin can log in using email and password
Session or JWT is created upon successful login
Invalid credentials show appropriate error messages (don’t use alert)
Admin dashboard is displayed after successful login
     

Technical Notes:
Create User model to store the admin’s credentials.
Implement POST /auth/login route.
Use express-session for session management or jsonwebtoken for jwt.
Create login.ejs in views.