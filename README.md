# To Do App Project Documentation

## Project Overview
This project is a dynamic To Do App built with Angular for the frontend, Python and Flask for the backend, and a MySQL database. It includes CRUD functionality that allows saving/getting/updating/deleting tasks in the database.

## Features
- Interactive To Do App with smooth navigation.
- Communication with a Flask backend API for data processing.
- GET HTTP method and backend logic for displaying the tasks stored inside the database.
- POST HTTP method and backend logic for saving information inside the database.
- PUT HTTP method and backend logic for updating information inside the database.
- DELETE HTTP method and backend logic for deleting information inside the database.
- Error handling.
- Toast notifications to display success or error messages.
- Hover effects on service elements for an enhanced user experience.

## Technologies Used
- **Frontend**: Angular
- **Backend**: Python and Flask
- **Database**: MySQL
- **Styling**: CSS

## How It Works

### Frontend
The frontend is responsible for rendering the user interface and handling user interactions:
- When the frontend component is initialized, the function `loadTask` is called, so a GET request is sent to the backend, which will get all the tasks from the database with a SELECT query and return them to the frontend, which will display them on screen.
- The "Create task" button allows creating a new task object, inserting it into the tasks array. When the user's focus moves, a blur event calls the `addTask` function, which sends a POST request to the backend with the task title. Other information will be added to the task thanks to the backend logic, and it will be stored in the database.
- When a task is checked, it is moved to the done tasks array. The `onCheck` function is called, and a PUT request is sent to the backend, which will send an SQL query to modify the task's status (whether completed or not). Then the `load` function is called to get all tasks, and the done tasks are displayed.
- When the name of a task is modified and its ID already exists, the `changeNameTask` function is called. A PUT request is sent to the backend, which will send a query to the database and modify the name of the task based on its ID.
- The "Move all to done" and "Move all to do" buttons allow checking or unchecking multiple tasks and moving them to the other array. When one of these functions is called, a PUT request with the list of IDs from the array is sent to the backend, which will send a query to the database to change the completion status.
- The "Delete tasks" button allows deleting all tasks from the done tasks array. It sends a DELETE request with the list of IDs to the backend, which will send a delete query to the database to delete all tasks based on their IDs.
- A toast notification is displayed to indicate the success or failure of the operation when a task or more changes its status.

### Backend
The Flask backend handles incoming requests and interacts with the database:
- Receives data as a JSON payload via GET, POST, PUT, or DELETE requests.
- Validates and stores the data in a MySQL database using a prepared SQL query.
- Returns a JSON response to the frontend indicating success or failure.

## Key Components
- **Frontend**: The Angular frontend handles user interactions and displays messages from the backend while communicating through API requests.
- **Backend**: The Flask backend processes user data, queries the database, and gives a response back to the frontend.
- **Database**: The database stores user data, including timestamps to track when tasks were created and updated.
