# 1Story

## Project Overview

1Story is a collaborative storytelling platform built using Vue 3, Nuxt 3, and Firebase. The platform aims to connect office colleagues through a unique, ongoing story that each user contributes to, one sentence at a time. Each user gets to add a new sentence to the story, continuing from where the previous user left off, fostering creativity, engagement, and a sense of community within the office.


## Navigation

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [Prerequisites](#prerequisites)
- [Steps](#steps)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)


## Features

- **Collaborative Storytelling**: Users contribute one sentence at a time to an ongoing story.
- **Firebase Integration**: Real-time database to store and retrieve the story sentences.
- **User Authentication**: Secure login system for users to participate in the storytelling.
- **Responsive Design**: Accessible on various devices including desktops, tablets, and smartphones.

## Tech Stack

- **Vue 3**: JavaScript framework for building user interfaces.
- **Nuxt 3**: Framework for creating Vue.js applications with server-side rendering, static site generation, and more.
- **Firebase**: Backend-as-a-Service providing real-time database, authentication, and hosting.

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- Firebase project setup (Firestore and Authentication enabled)

### Steps

1. **Clone the Repository**
    ```sh
    git clone https://github.com/your-username/1story.git
    cd 1story
    ```

2. **Install Dependencies**
    ```sh
    npm install
    ```

3. **Set Up Firebase**
    - Create a new Firebase project on the [Firebase Console](https://console.firebase.google.com/).
    - Enable Firestore and Authentication (email/password sign-in).
    - Download the `firebaseConfig` object from your project settings and add it to your Nuxt environment variables.

4. **Configure Environment Variables**
    Create a `.env` file in the root directory of your project and add your Firebase configuration details:
    ```sh
    FIREBASE_API_KEY=your_api_key
    FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    FIREBASE_APP_ID=your_app_id
    ```

5. **Run the Development Server**
    ```sh
    npm run dev
    ```

    The application should now be running on `http://localhost:3000`.

## Usage

1. **Register/Login**: Users need to register or log in to participate in the storytelling.
2. **Contribute to the Story**: After logging in, the user can read the last sentence written and add their own sentence to continue the story.
3. **View Story**: Users can view the entire story to see how it has evolved with contributions from different users.

## Project Structure

- `components/`: Vue components for different parts of the application.
- `pages/`: Nuxt pages defining the routes of the application.
- `plugins/`: Nuxt plugins, including Firebase initialization.
- `store/`: Vuex store for managing application state.
- `assets/`: Static assets like images and styles.
- `middleware/`: Middleware for route guarding (e.g., authentication).
- `nuxt.config.js`: Configuration file for Nuxt.js.
- `firebase.js`: Firebase configuration and initialization.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

## Sources

- [Vue 3](https://vuejs.org/)
- [Nuxt 3](https://nuxtjs.org/)
- [Firebase](https://firebase.google.com/)
- Michael

---

Feel free to reach out if you have any questions or need further assistance. Happy storytelling!
