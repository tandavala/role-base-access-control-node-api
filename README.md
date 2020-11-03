# Role base access control with Node And Express

**Role-based access control (RBAC)** is an approach used to restrict access to certain parts of the system to only authorized users. The permissions to perform certain operations are assigned to only specific roles.

# Routes

```
POST : /signup

User attributes:

email

password

role (admin, supervisor, basic)
```

This route is responsable for creating new user

```
POST : /login

User attributes:

email

password

```

This route is responsable for login user

```
POST : /login

Headers:

x-access-token: login_token

```

This route is responsable for updating user profile, just for thoses with admin and supervisor role can use this route.

# How to Run

1. clone the repo
2. cd to the root
3. npm install
4. cp .env.sample .env
5. npm run dev
