# Online coding app for mentoring

[deployed website](https://mentoring-app-client.onrender.com/)
[server repository](https://github.com/edendayann/Mentoring_App-server)

### About the project

This project enables real-time code collaboration with multiple users. The first participant is the mentor with read-only access, while subsequent users become students with read and write privileges. Changes are synchronized in real-time, and users can save their progress to the database. Students have the option to submit their code when ready.

### Technologies

- Frontend: React.js, Highlight.js, CSS
- Backend: Node.js, Express
- Communication: WebSockets, axios
- Database: MongoDB

### Deployment

Deployed using [render](https://dashboard.render.com/)

### Local Setup

To run the app locally, follow these steps:

1. Clone the client and server repositories.
2. Run npm install command for each repository.
3. Activate the **server** using the command ``node ./index.js``.
3. Activate the **client** using the command ``npm start``.
4. The application will be accessible at http://localhost:3000.

