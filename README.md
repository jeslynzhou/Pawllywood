## Running the App on iOS

To run the app on iOS using EAS Build, execute the following command:
```sh
eas build:run -p ios --latest
```
This command will build and run the latest version of the app on iOS using EAS Build.

## Running the App on Android

To run the app on Android using EAS Build, execute the following command:
```sh
eas build:run -p android --latest
```
Then run this line:
```sh
npx expo start
```
This command will build and run the latest version of the app on Android using EAS Build.





## Table of Contents

### A. ABOUT PAWLLYWOOD

1. [Proposed Level of Achievement](#proposed-level-of-achievement)
2. [Motivation](#motivation)
3. [Aim](#aim)
4. [User Stories](#user-stories)
5. [Features](#features)
   - [Core features](#core-features)
   - [Bonus features](#bonus-features)
6. [Tech Stack](#tech-stack)

### B. POSTER & VIDEO

- [Poster](#poster)
- [Video](#video)

### C. WIREFRAME

- [Wireframe](#wireframe)

### D. PROOF OF CONCEPT

- [Milestone 1](#milestone-1)
- [Milestone 2](#milestone-2)

### E. IMPLEMENTING FEATURES

1. [Authentication](#authentication)
2. [Profile (Core)](#profile-core)
3. [Home](#home)
4. [Library (Core)](#library-core)
5. [Forum (Core)](#forum-core)

### F. SOFTWARE ENGINEERING PRACTICES

1. [Version Controls](#version-controls)
   - [Branching](#branching)
   - [Commits](#commits)
2. [Software Architecture](#software-architecture)
   - [User Flow Diagram](#user-flow-diagram)
   - [Microservice Architecture Diagram](#microservice-architecture-diagram)

### G. DEVELOPMENT PLAN

1. [Milestone 1 | 20/05 - 03/06](#milestone-1--2005---0306)
2. [Milestone 2 | 03/06 - 01/07](#milestone-2--0306---0107)
3. [Milestone 3 | 01/07 - 29/07](#milestone-3--0107---2907)

### H. PROJECT LOG

- [Project Log](#project-log)

## Proposed Level of Achievement

Apollo 11

## Motivation

As a volunteer feeder at NUS CatCafe this semester, I've had the opportunity to contribute to the well-being of our feline friends and gained a lot of new information on how to take care of the cats. Our routine involves feeding the cats and then documenting their health conditions through photos and updates in a WhatsApp group chat.
While this system has been effective for our small community, it became apparent that there was a wider audience of pet lovers who could benefit from this. That's when the idea for **_Pawllywood_** emerged. By transitioning from a small group chat to a dedicated app, we could reach a larger audience, foster stronger bonds within the pet lover community, and better prepare individuals for pet ownership.
This shift would streamline communication, provide a centralized platform for sharing experiences, thoughts, doubts regarding taking care of pets, and ultimately enhance the overall experience for pet owners and foster a strong community of pet owners.

## Aim

With **_Pawllywood_**, we hope to create a platform for pet lovers—whether one is a seasoned pet owner or just starting one’s journey— to come together, share their experiences and seek support from a vibrant community of fellow enthusiasts while caring for the pets.
Our **_forum_** feature allows users to engage in discussions, ask questions, and offer advice, creating a supportive environment where everyone can learn and grow together. Additionally, our **_in-app library_** also provides valuable resources and tips to help the users become the best pet parent they can be. The comprehensive resources in the library will cover everything from feeding and grooming to training and even more. Furthermore, Pawllywood integrates useful features including a powerful search engine, multi-device synchronization, ensuring seamless experience for all users.

## User Stories

- As individuals who are planning to raise a pet, I want to gain information about different animals and various breeds to decide on the most suitable animal considering my lifestyle and preferences. Also, I wish to gain knowledge about how to take care of pets to ensure I have the ability to provide the best possible care for my future furry companion.
- As pet enthusiasts and pet owners, I want to engage in discussions, ask questions, and share thoughts and pictures in a forum. Additionally, I want to have an in-app notebook to help me easily jot down notes and advice that I have received.
- As new pet owners who want to provide the best care for my pet, I want to be able to access a library of detailed pet-specific care guides and tips.
- As pet owners, I want to store my pet’s information, including breed, age, medical history and health conditions to keep track of their needs.

## Features

### Core Features

1. In-app library for pet-specific care guides

   The library provides instant pet-specific care guides, from diet, training, to grooming and exercise. Users can access the in-app library whenever they want, wherever they are (Just make sure to have a strong internet connection!)

3. Forum for engaging in discussion, asking questions, and sharing thoughts and experiences through writing posts and pictures

   In addition to the library, our forum offers essential support for users’ pet care needs. The forum helps users to connect with fellow pet owners who share real-life experiences. Users can engage in discussions, ask questions, share thoughts and experiences through posts and pictures, and enjoy lively chats with like-minded individuals who share their interests.

5. Authentication for user accounts

   The profile feature will help to manage user accounts and handle the authentication; users can create a new account, log in and log out. 

### Bonus Features

1. Notebook to save and note down useful tips sourced from in-app library and forum
2. User engagement to add friends and initiate private chat with people
3. Push notification to inform users about updates and relevant activities
4. Multi-device synchronization
5. Effective search-engine

## Tech Stack

1. ReactNative & JavaScript (Frontend)
2. Node.js (Backend)
3. Firebase (Backend + Database)
4. Expo & GitHub & Git (Others)

## Poster & Video

### Poster

<img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/4bdac6bf-6fde-494d-8e40-860153117df0" width="500px">

### Video

https://github.com/jeslynzhou/Pawllywood/assets/168978806/1123358e-2086-4b61-8c3d-00758b1571d3

## Wireframe

**_Medium Fidelity Designs_**

Canva: https://www.canva.com/design/DAGF7uzLu3g/g3yj7IKo3Hcbmzxl-N5W5w/edit

_PREVIEW:_

<div style="display: flex; flex-wrap: wrap; justify-content: center;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/124c9385-8c72-4bc4-94fc-6d6d56d39ea0" alt="Splash_Login_Signup" style="width: 49%; margin: 0.5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/26bc50ea-29bc-4f0f-aaf2-6eb87b23444e" alt="Home Screen" style="width: 49%; margin: 0.5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/c91576c1-6f4c-418d-afb1-d8db9dbb5d5e" alt="Profile Screen" style="width: 49%; margin: 0.5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/7a0ac2af-66db-4fd9-8926-95ed283fa2f0" alt="Notebook Screen" style="width: 49%; margin: 0.5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/d63e7d6a-f4a0-41b1-af87-36b052367467" alt="Library Screen" style="width: 49%; margin: 0.5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/db01cfe6-b157-4f31-9304-0522d377ad37" alt="Forum Screen" style="width: 49%; margin: 0.5px;">
</div>

## Proof of Concept

### Milestone 1

In our initial milestone, we have integrated the Authentication feature into the application. This advancement enables users to conveniently access Pawllywood by either logging in through an existing account or signing up for a new one.

**Registration:** The process of registration is straightforward. Users simply need to tap the "Sign Up" button and provide their desired username, email address, and password. Upon completion, they will be welcomed with a "Welcome" screen. For those who already have an account, logging in is a seamless process. By entering their registered email address and password, users can swiftly access the application's features and content.

### Milestone 2

In our second milestone, we have integrated the core features of the app: Profile, Library, and Forum features, with the home screen to display users’ pets profiles. Upon creating an account, users will be redirected to the home screen. There is a navigation bar at the bottom of the screen to help users easily navigate through profile, notebook, home, library, and forum screens. 

- **Profile Feature** (for managing user account): The profile screen will store users’ basic information: Username, profile picture, and bio description. Users can edit their profile info by clicking on the ‘Edit Profile’ Button and update their new info. Additionally, users can add more pet profiles with a simple click ‘Add Pet’, just fill in the space and you now have a new pet! You can view your pets and posts in ‘My Pets’ and ‘My Posts’, and also have ‘Friends’, ‘Message’, ‘Notification’ features that will be implemented in the next milestones. Press the ‘Log out’ button and users will be prompted with a modal to confirm logging out.

- **Home Screen** (for displaying pet profiles): Users can view their pet profiles in the home screen, swiping left to view more. Users can press the ‘Add’ button at the bottom of the screen to add more pets (same as ‘Add Pet’ in profile screen). To edit the pet profile, click on the 3 dots icon on the top right of the pet info box.

- **Library Screen** (for looking up care guides): Users can choose to view either dog or cat information. There are over two hundred dog and cat breeds in the library. When searching for a breed, the library will present information on the chosen breed across 5 to 6 aspects (About, Health, Grooming, Exercise, Training and Nutrition for Dog and About, Appearance & Colors, Personality, Care, and Health for Cat).

- **Forum Screen** (for asking questions and engaging in discussions): Users can search for posts to find information, post questions or thoughts for comments and engagement, and interact with other users by commenting, voting, and sharing posts.


## Implementing Features

### Authentication
- **Proposed Feature:** Handle authentication step using email and password.

- **Progress:**

   (1) Handle Authentication: Users will be able to create a new account and log out using their email and password; they can also log out of the app.

   (2) Welcome Screen: Upon signing in, users will be greeted with a welcome screen and redirect to the home screen.

- **Problems Encountered:**
   
   (1) Initially the code was complex and doesn’t support scalability as it is stored inside the App.js file.

   (2) The UI of the authenticated screen for welcoming the users is problematic (the picture was not high-quality and the position of the picture covered up the whole screen).

   (3) Security of the account (There is no verification step for the email, so users can create accounts using non-existent emails).

- **Solutions:**

   - We broke down the code to smaller sections (divide-and-conquer) and create new files to specifically handle the authentication logic.

   - We used Dimensions to adjust the size of the picture while maintaining its quality.

   - We will solve problem (3) in the next milestone.

### Profile (Core)

- **Proposed Feature:** Manage user profile, including their profile, pet profiles, posts, friends, message, and notification. Users can also log out from their account in the profile screen.

- **Progress:**

   (1) Display Profile details: Displays user’s profile picture, username, and their bio description.

   (2) Edit Profile details: Allows users to modify their profile information such as username, profile picture, and description.

   (3) Add Pet Profile details: Enables users to add new pet profiles, inputting the pet’s picture, name, breed, birth date (with automatically calculated age), gender, and their adopted date.

   (4) My Pets: Allows users to know how many pets they have (displaying in a list format with the pets’ names, pictures, and adopted dates). Clicking on the pet profile will redirect the users to the home screen. Users can edit the pet lists by clicking on the 3 dots, showing a prompted box to confirm the edit. If they choose ‘yes’, users can delete the pet profile from the pet lists. If there are no pets inside the list, users will be prompted to add their first pet by clicking on the box.

   (5) My Posts: Displays a list of posts created by the user within the forum. Users are also allowed to delete their own posts, providing control over their contributions to the community. If there are no posts inside the list, users will be prompted to share their thoughts by clicking on the box and be redirected to the forum screen.

- **Problems Encountered:** 

   (1) Creating a database for users.

   (2) Users are able to upload profile pictures but unable to display it on the screen; same problems for pets’ profile pictures.

   (3) Initially using the [currentScreen, setCurrentScreen] method like App.js to redirect from ‘My Pets’ to add-more-pet screen and ‘My Posts’ to the forum when the lists are empty and adding the navigation bar, but it doesn’t work properly and cannot direct from the lists to other screens.

   (4) Redirect each pet in the pet lists to the exact page storing the pet profile in the home screen.

- **Solutions:** 

   - Upon creating a new account (which was handled inside the AuthScreen), we initialize users database.

   - We observed that the picture fields within the users collection were stored as a number instead of a string intended for a url. Hence, we changed the way of uploading data based on the issue and managed to solve the problem.

   - Taking advantage of the ’add-more-pet screen’ and ‘directToForum’ that are in (/passed to) the profile screen, we passed these to ‘My Pets’ and ‘My Posts’ and was able to redirect to add-more-pet screen (add pet) and the forum.

   - We will try to fix this problem in the next milestone.

### Home

- **Proposed Feature:** Display and manage the pet profiles (editing existing pet profiles and add new) .

- **Progress:** 

   (1) Displaying Pet Profiles: Users can view their pet profiles in alphabetical order; swipe left to view more. The pet profile box displays the pet’s name, picture, breed, birth date, age, and gender. 

   (2) Edit Pet Profile details: By clicking on the 3 dots on the top right of the info box, users will be able to edit and update their pet’s details.

   (3) Add Pet Profile: By clicking on the ‘plus’ button at the bottom right of the screen, users will be able to add more pets and see the changes they made in the home screen right away.

- **Problems Encountered:**

   (1) Difficulties in implementing scroll view for the 2 ‘pet profile’ and ‘notes’ boxes, as we wanted the labels to stay fixed in the position when we swipe left, and the counting of the pet profile needs to be accurate.

   (2) Displaying and editing pet profile pictures.

- **Solutions:**

   - We changed the UI design of the home screen: instead of having 2 boxed of ‘pet profile’ and ‘notes’ that need to be swipeable while the labels of the 2 boxed stay still, we put the ‘notes’ component inside the pet profile, and thus, making the ‘pet profile’ labels with the counting stay still.

   - By changing the data type of the picture stored in the database (same as profile screen), we were able to edit, update and edit the pet profile picture.

### Library (Core)

- **Proposed Feature:** Offers comprehensive pet care guides covering diet, training, grooming, and exercise, accessible anytime with an internet connection.

- **Progress:** 

   (1) Filter Dogs/Cats: Allows users to narrow their search to either dogs or cats.

   (2) Search and Select Breed: A search bar lets users type and select a specific breed from the database.

   (3) Select Pet Aspect: Provides detailed information on selected aspects (e.g., health, exercise, grooming) of the pet.

   (4) Swipe Functionality: Users can swipe left or right to view different aspects of the pet without returning to the main list.

- **Problems Encountered:** Difficulties in uploading breed data into the Firestore database due to the large volume of data (200+ dog breeds and 30+ cat breeds, each with 5/6 fields).

- **Solutions:** We attempted to automate data upload using Python and managed to upload the breed names into the database. However, due to the complicated design of the websites we found as the source of the data, we failed to upload the information in each aspect. As a result, we eventually opted to manually input data into the Firestore database to ensure accuracy and completeness.

### Forum (Core)

- **Proposed Feature:** A feature designed for user engagements and information sharing. Users are allowed to to search, post questions/thoughts, comment, vote, and share posts.

- **Progress:**

   (1) Post Functionality: Enables users to create and share their own posts within the forum.

   (2) Upvotes/downvotes Functionality: Allows users to upvote or downvote posts to indicate their approval or disapproval.

   (3) Share Functionality: Provides options for users to share posts with others through various platforms.

   (4) Comment Functionality: Users are encouraged to comment on posts, facilitating discussions and interactions.

   (5) Search Posts: Users can search for specific posts using keywords or filters to find relevant content quickly.

- **Problems Encountered:** 

   (1) Unable to display the profile pictures of other users.

   (2) The profile picture and username from posts and comments were not in sync with the newest profile picture and username.

- **Solutions:** 

   - Upon further review, we discovered that the URLs stored in the picture field within the users collection were specific to each user's private album, restricting access for other users. This prompted us to reevaluate how our app handles picture uploads to the database. By implementing necessary adjustments, we successfully resolved the issue that was causing profiles not to display correctly on the screen.

   - We fetched the posts and comments made by the user and updated the profile picture and username inside the function that handles updating the user information in the profile screen. 

## Software Engineering Practices

### Version Controls

#### Branching

During our development, we achieved parallel work streams by utilizing different branches. For each feature, we created separate branches, which allowed us to isolate changes related to specific features or fixes. Moreover, it enabled us to work independently without interfering with each other's code.

#### Commits

*For milestone 1,* our regular commits focus on developing user authentication. To ensure easy tracking and management of our changes, we named our commits according to the specific changes made. Some examples of our commits are “Add Retype Password for Sign In”, “Login & Sign up Screen” and, “organize files”.

*For milestone 2,* we split tasks so two of us focused on different features. Our regular commits continued to reflect the division of work, with each commit focusing on the respective feature assigned to us. This division allowed us to maintain productivity and progress efficiently towards our milestone goals, ensuring that each feature received dedicated attention and timely updates. Just as what we did in the previous milestone, we named our commits according to the specific changes made. Some examples of our commits are “fix profile displaying issue + adjust UI”, “fix bugs: profile pic can now be displayed on the screen” and, “Update Home Screen (calculate pet's age)”. However, we did help out each other and commit to each other’s branch when one of us encountered issues. For example, Jeslyn helped to fix the profile picture not displaying problems for the profile screen and Marianne added the “view more comments” function and formatted the UI in the forum screen.

### Software Architecture

#### User Flow Diagram

![User Flow Diagram](https://github.com/jeslynzhou/Pawllywood/assets/168978806/5cf70b07-a3cb-4a66-9296-c7d688562344)

#### Microservice Architecture Diagram

![Microservice](https://github.com/jeslynzhou/Pawllywood/assets/168978806/6e8d1bdb-c96c-4b27-97d2-225536dfd537)

## Development Plan

### Milestone 1 | 20/05 - 03/06

- Design UI for the app
- Software Engineering Diagrams
- Proof of Concept (for Users Authentication)
- Deployment

### Milestone 2 | 03/06 - 01/07

- Create database
- Implement core features (Profile, Library, and Forum)
- Deployment & System testing

### Milestone 3 | 01/07 - 29/07

- Implement bonus features (Notebook, User Engagement, Multi-device synchronization, and Push Notification)
- System testing & Bug fixing

## Project Log

**Total hours for Milestone 1:**

Jeslyn: 41

Marianne: 42

**Total hours for Milestones 2:**

Jeslyn: 137

Marianne: 134

| Milestone     | Tasks                                                              | PIC      | Start | End   | Hrs |
| ------------  | ------------------------------------------------------------------ | -------- | ----- | ----- | --- |
| 1 - Ideation  |                                                                    |          |       |       |     |
| 1.1           | Formulate project idea                                             | Both     | 12/05 | 13/05 | 3   |
| 1.2           | Brainstorm features                                                | Both     | 13/05 | 14/05 | 2   |
| 1.3           | Project Poster + Video for Lift-off                                | Both     | 14/05 | 20/05 | 8   |
| 1.4           | Design first draft UI for the app                                  | Marianne | 21/05 | 23/05 | 8   |
| 1.5           | Design development plan                                            | Marianne | 28/05 | -     | 1   |
| 1.6           | Refine User Flow Diagram                                           | Marianne | 28/05 | 29/05 | 1   |
| 1.7           | Refine Poster with confirmed techstack                             | Jeslyn   | 29/05 | -     | 1   |
| 1.8           | Technical Proof of Concept (for Authentication)                    | Both     | 29/05 | 31/05 | 12  |
| 1.9           | Deployment                                                         | Jeslyn   | 31/05 | 01/06 | 6   |
| 1.10          | Update Video with PoC + next plan                                  | Both     | 01/06 | 02/06 | 4   |
| 1.11          | Refine Code in ReactNative (make it scalable, organize in folders) | Jeslyn   | 02/06 | 03/06 | 2   |
| 1.12          | Write report                                                       | Both     | 03/06 | -     | 3   |
| 2 - Prototype |                                                                    |          |       |       |     |
| 2.1           | Create database with Firebase                                      | Both     | -     | -     | 15  |
| 2.2           | Integrate Profile feature                                          | Marianne | 09/06 | 23/06 | 71  |
| 2.3           | System Testing for Profile feature                                 | Jeslyn   | 23/06 | -     | 2   |
| 2.4           | Integrate Library feature                                          | Jeslyn   | 09/06 | 23/06 | 74  |
| 2.5           | System Testing for Library feature                                 | Marianne | 23/06 | -     | 2   |
| 2.6           | Integrate Forum feature                                            | Both     | 23/06 | 29/06 | 34  |
| 2.7           | System Testing for Forum feature                                   | Both     | 29/06 | -     | 2   |
| 2.8           | Final Testing for core features with users + feedback (Deployment) | Both     | 29/06 | 30/06 | 4   |
| 2.9           | Finalize documentation                                             | Both     | 30/06 | 01/07 | 5   |
