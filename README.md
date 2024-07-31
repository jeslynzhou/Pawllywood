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
- [Milestone 3](#milestone-3)

### E. IMPLEMENTING FEATURES

1. [Authentication](#authentication)
2. [Profile (Core)](#profile-core)
3. [Notebook](#notebook)
4. [Home](#home)
5. [Push Notification](#push-notification)
6. [Library (Core)](#library-core)
7. [Forum (Core)](#forum-core)

### F. BUG SQUASHED

- [Bug Squashed](#bug-squashed)

### G. SOFTWARE ENGINEERING PRACTICES

1. [Version Controls](#version-controls)
   - [Branching](#branching)
   - [Commits](#commits)
2. [Software Architecture](#software-architecture)
   - [User Flow Diagram](#user-flow-diagram)
   - [Microservice Architecture Diagram](#microservice-architecture-diagram)
3. [Testing](#testing)
   - [User Testing](#user-testing)
   - [Integration Testing](#integration-testing)

### H. DEVELOPMENT PLAN

1. [Milestone 1 | 20/05 - 03/06](#milestone-1--2005---0306)
2. [Milestone 2 | 03/06 - 01/07](#milestone-2--0306---0107)
3. [Milestone 3 | 01/07 - 29/07](#milestone-3--0107---2907)

### I. PROJECT LOG

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

2. Forum for engaging in discussion, asking questions, and sharing thoughts and experiences through writing posts and pictures

   In addition to the library, our forum offers essential support for users’ pet care needs. The forum helps users to connect with fellow pet owners who share real-life experiences. Users can engage in discussions, ask questions, share thoughts and experiences through posts and pictures, and enjoy lively chats with like-minded individuals who share their interests.

3. Users and Accounts

   The profile feature will help to manage user accounts and handle the authentication; users can create a new account, log in and log out. 

### Bonus Features

1. Notebook to save and note down useful tips sourced from in-app library and forum
2. User engagement to add friends and initiate private chat with people (Haven’t implemented)
3. Push notification to inform users about updates and relevant activities
4. Multi-device synchronization for seamless synchronization across multiple devices for a consistent user experience
5. Effective search-engine to find relevant information in the forum and in-app library feature (Haven’t implemented)

## Tech Stack

1. ReactNative & JavaScript (Frontend)
2. Node.js (Backend)
3. Firebase (Backend + Database)
4. Expo & GitHub & Git (Others)

## Poster & Video

### Poster

![6515](https://github.com/user-attachments/assets/e918c31a-4d05-45a1-8035-78d8cc3c3d8e)


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

- **Profile Screen** (for managing user account):  The profile screen will store users’ basic information: Username, profile picture, and bio description. Users can edit their profile info by pressing on the ‘Edit Profile’ Button and update their new info. Additionally, users can add more pet profiles with a simple click ‘Add Pet’, just fill in the space and you now have a new pet! Users can view their pets and posts in ‘My Pets’ and ‘My Posts’. Inside ‘My Pets’, users can view the list in 02 view modes, ‘Current’ and ‘Archived‘, the details of users’ current pets will be displayed in the home screen, while the archived one can be viewed in the archived pets list. Press the ‘Log out’ button and users will be prompted with a modal to confirm logging out.

- **Home Screen** (for displaying pet profiles): Users can view their current pet profiles in the home screen, swiping left to view more. To view the note details, just press on the note box and the note details screen will open, and editing the notes is simple, users just need to press on the 3 dots icon at the top right corner of the screen. If there are no notes displayed in the pet profile, users are prompted to add new notes for the pet. Once added, the note will be automatically pinned to the pet. Users can press the ‘Add’ button at the bottom of the screen to add more pets (same as ‘Add Pet’ in profile screen). To edit the pet profile, click on the ‘Edit Pet Profile’ button on the top right of the pet info box. Users can also archive a pet in the edit pet profile function. Once pressed, the pet will go to the archived pets list in ‘My Pets’ and will not be displayed in the home screen.

- **Library Screen** (for looking up care guides): Users can choose to view either dog or cat information. There are over two hundred dog and cat breeds in the library. When searching for a breed, the library will present information on the chosen breed across 5 to 6 aspects (About, Health, Grooming, Exercise, Training, and Nutrition for Dog and About, Appearance, Personality, Care, and Health for Cat).

- **Forum Screen** (for asking questions and engaging in discussions): Users can search for posts to find information, post questions or thoughts for comments and engagement, and interact with other users by commenting, voting, and sharing posts. Moreover, users are allowed to mark the location, pin posts, save posts and delete posts created by themselves. They can apply filters to the posts in the forum screen. Options include: saved posts, pinned posts, crowd alert/not crowd alert posts. By turning on the crowd alert button,  users can visually notify others since the background color of the post will be changed into orange. The hotlines section allows users to call the corresponding hotlines when they encounter an emergency situation. For each post, there is a post details screen for the user to view the specific post.

### Milestone 3

In our third milestone, we integrated the bonus features of the app: Notebook and Push Notification features.

- **Notebook Screen**  (for creating and managing notes): Users can create, manage and organize the notes in the notebook screen. To create a new note, press on the ‘Add’ button at the bottom of the screen. Once users finish taking notes, pressing the back button will automatically save the note. The notes can be viewed in either ‘All notes’ or ‘Folders’ mode. To search for the notes, users can simply search it in the search bar on top of the screen. To edit the notes, simply press on the 3 dots icon at the top right corner of the screen. Users can move notes to a folder, pin to a specific pet profile, and delete. If users are in the ‘folders’ view, pressing on the 3 dots icon will also allow users to create new folders. To manage the folders, users can press the menu icon at the top left corner of the screen. Users can either create new folders or delete existing ones. To view the notes in full screen, just press on the notes. Users can customize the background color of the notes to their liking, move to a folder, pin to a pet profile, and delete this note.

- **Push Notification** (for receiving notifications): Users will receive notifications when other users comment on/upvote/downvote on their posts.


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

### Profile (Core)

- **Proposed Feature:** Manage user profile, including their profile, pet profiles, posts, friends, message, and notification. Users can also log out from their account in the profile screen.

- **Progress:**

   (1) Display Profile details: Displays user’s profile picture, username, and their bio description.

   (2) Edit Profile details: Allows users to modify their profile information such as username, profile picture, and description.

   (3) Add Pet Profile details: Enables users to add new pet profiles, inputting the pet’s picture, name, breed, birth date (with automatically calculated age), gender, and their adopted date.

   (4) My Pets:
        - Allows users to know how many pets they have (displaying in a list format with the pets’ names, pictures, and adopted dates). Clicking on the pet profile will redirect the users to the home screen. Users can edit the pet lists by clicking on the 3 dots, showing a prompted box to confirm the edit. If they choose ‘yes’, users can delete the pet profile from the pet lists. If there are no pets inside the list, users will be prompted to add their first pet by clicking on the box.
        - In the ‘Current’ pets list, by pressing on the 3 dots users can edit the pet lists, either archive or delete the pets. Archiving the pets will move the pets to the ‘Archive’ pets lists. If there are no pets inside the list, users will be prompted to add their first pet by pressing on the box.
        - In the ‘Archive’ pets list, by pressing on the 3 dots users can edit the pet lists, either unarchive or delete the pets. Unarchiving the pets will move the pets to the ‘Current’ pets lists.

   (5) My Posts: Displays a list of posts created by the user within the forum. Users are also allowed to delete their own posts, providing control over their contributions to the community. If there are no posts inside the list, users will be prompted to share their thoughts by clicking on the box and be redirected to the forum screen.

   (6) Manage Account: Users will be able to delete their account.

   (7) Log Out: Users will be able to log out from their account.

- **Problems Encountered:** 

   (1) Creating a database for users.

   (2) Users are able to upload profile pictures but unable to display it on the screen; same problems for pets’ profile pictures.

   (3) Initially using the [currentScreen, setCurrentScreen] method like App.js to redirect from ‘My Pets’ to add-more-pet screen and ‘My Posts’ to the forum when the lists are empty and adding the navigation bar, but it doesn’t work properly and cannot direct from the lists to other screens.

   (4) Redirect each pet in the pet lists to the exact page storing the pet profile in the home screen.

- **Solutions:** 

   - Upon creating a new account (which was handled inside the AuthScreen), we initialize users database.

   - We observed that the picture fields within the users collection were stored as a number instead of a string intended for a url. Hence, we changed the way of uploading data based on the issue and managed to solve the problem.

   - Taking advantage of the ’add-more-pet screen’ and ‘directToForum’ that are in (/passed to) the profile screen, we passed these to ‘My Pets’ and ‘My Posts’ and was able to redirect to add-more-pet screen (add pet) and the forum.
 
### Notebook

- **Proposed Feature:** Create, manage, and organize notes within the app, storing valuable tips sourced from the in-app library and forum.

- **Progress:**

   (1) Displaying Notes: Users can view their notes in either ‘All notes’ or ‘Folders’ view. The screen will display the note, its name and the created date.

   (2) Add Note: By pressing on the ‘plus’ button at the bottom right of the screen, users will be able to add more notes. Pressing on the back button will automatically save the note. 

   (3) Search for notes: Users can easily search for the title of the note they are looking for.

   (4) View & Edit Note: When users press on the note, they can view the note in full screen. In this full screen mode, users can edit the title and content of the note. The 3 dots icon at the right top corner of the screen will handle editing the note: changing background color, moving to a folder, and deleting the note. Pressing on the back button will automatically save the changes.

   (5) Menu Modal: Pressing the menu icon on the top left corner of the screen, a menu modal will appear where users can switch from ‘All notes’ to ‘Folders’ view and vice versa. Users can also manage folders here.

   (6) Manage Folders: Display and manage folders, allowing users to create new folders or delete existing ones.

   (7) Edit Notes:
      - In the ‘All notes’ view, pressing on the 3 dots icon at the top right corner of the screen will display an edit modal for users to edit notes. Pressing the ‘Edit notes’, users can move to folder, pin to pet profile, or delete the notes.
      - In the ‘Folders’ view, pressing on the 3 dots icon at the top right corner of the screen will display an edit modal for users to edit notes and create a new folder.

- **Problems Encountered:**

   (1) (For iOS, we encountered difficulties in opening edit notes modal in the Notebook screen and in the Note Details screen (system crashed due to many calls of open and close modals).

   (2) Notes cannot upload pictures.

- **Solutions:**

   - We reduce the calls and adjust the structure of the code.

   - Will be implemented in the next period.

### Home

- **Proposed Feature:** Display and manage the pet profiles (editing existing pet profiles and add new) .

- **Progress:** 

   (1) Displaying Pet Profiles: Users can view their (current) pet profiles in alphabetical order; swipe left to view more. The pet profile box displays the pet’s name, picture, breed, birth date, age, gender, and all the notes pinned to the pet profile (Users can also view the notes in full screen by pressing on the notes).

   (2) Edit Pet Profile details: By pressing on the 3 dots on the top right of the info box, users will be able to edit, archive, and update their pet’s details.

   (3) Add Pet Profile: By pressing on the ‘plus’ button at the bottom right of the screen, users will be able to add more pets and see the changes they made in the home screen right away.

- **Problems Encountered:**

   (1) Difficulties in implementing scroll view for the 2 ‘pet profile’ and ‘notes’ boxes, as we wanted the labels to stay fixed in the position when we swipe left, and the counting of the pet profile needs to be accurate.

   (2) Displaying and editing pet profile pictures.

- **Solutions:**

   - We changed the UI design of the home screen: instead of having 2 boxed of ‘pet profile’ and ‘notes’ that need to be swipeable while the labels of the 2 boxed stay still, we put the ‘notes’ component inside the pet profile, and thus, making the ‘pet profile’ labels with the counting stay still.

   - By changing the data type of the picture stored in the database (same as profile screen), we were able to edit, update and edit the pet profile picture.

### Push Notification

- **Proposed Feature:** Push notifications to alert users of comments, upvotes, and downvotes on their posts.

- **Progress:** 

   Notifications are being implemented to inform users when they receive comments, upvotes, or downvotes.

- **Problems Encountered:**

   Uncertainty about how to begin implementing push notifications.

- **Solutions:**

   Researched through YouTube videos and online resources to find guidance and solutions.

### Library (Core)

- **Proposed Feature:** Offers comprehensive pet care guides covering diet, training, grooming, and exercise, accessible anytime with an internet connection.

- **Progress:** 

   (1) Filter Dogs/Cats: Allows users to narrow their search to either dogs or cats.

   (2) Search and Select Breed: A search bar lets users type and select a specific breed from the database.

   (3) Select Pet Aspect: Provides detailed information on selected aspects (e.g., health, exercise, grooming) of the pet.

   (4) Swipe Functionality: Users can swipe left or right to view different aspects of the pet without returning to the main list.

- **Problems Encountered:**
  
   Difficulties in uploading breed data into the Firestore database due to the large volume of data (200+ dog breeds and 30+ cat breeds, each with 5/6 fields).

- **Solutions:**
  
   We attempted to automate data upload using Python and managed to upload the breed names into the database. However, due to the complicated design of the websites we found as the source of the data, we failed to upload the information in each aspect. As a result, we eventually opted to manually input data into the Firestore database to ensure accuracy and completeness.

### Forum (Core)

- **Proposed Feature:** A feature designed for user engagements and information sharing. Users are allowed to to search, post questions/thoughts, comment, vote, and share posts.

- **Progress:**

   (1) Post Functionality: Enables users to create and share their own posts within the forum.

   (2) Upvotes/downvotes Functionality: Allows users to upvote or downvote posts to indicate their approval or disapproval.

   (3) Share Functionality: Provides options for users to share posts with others through various platforms.

   (4) Comment Functionality: Users are encouraged to comment on posts, facilitating discussions and interactions.

   (5) Search Posts: Users can search for specific posts using keywords or filters to find relevant content quickly.

   (6) Image Uploading: Users are allowed to upload several images in their post.

   (7) Image Viewer: Users can view the images they uploaded in full screen mode when posting and  viewing posts.

   (8) Crowd Alert: Users can enable CROWD ALERT mode for their posts to visually notify others by changing the background color to orange.

   (9) Hotlines: In the Forum Screen, we designed a hotline section so users can view and call emergency hotlines.

   (10) Save and Pin Posts: Users can choose to save and pin others’ posts. The pinned posts will appear at the top of the Forum Screen.

   (11) Delete: Users are allowed to delete their own posts.

   (12) Filter: Users can filter the posts they want to view. Options provided are: saved, pinned, crowd alert/not crowd alert.

   (13) Post Details: Each post will have a corresponding post details screen for users to view the specific post full screen. Users can view the post details screen by pressing the tile and content part for each post in Forum Screen.

   (14) Adding Location and Map View: Users can add their current location when posting and view the locations in a map view.

- **Problems Encountered:** 

   (1) Unable to display the profile pictures of other users.

   (2) The profile picture and username from posts and comments were not in sync with the newest profile picture and username.

   (3) Device will quit when trying to upload images to test image uploading feature in forum screen.

- **Solutions:** 

   - Upon further review, we discovered that the URLs stored in the picture field within the users collection were specific to each user's private album, restricting access for other users. This prompted us to reevaluate how our app handles picture uploads to the database. By implementing necessary adjustments, we successfully resolved the issue that was causing profiles not to display correctly on the screen.

   - We fetched the posts and comments made by the user and updated the profile picture and username inside the function that handles updating the user information in the profile screen.

   - We set all the image quality to 0.2 instead of 1.0.

## Bug Squashed

At each milestone, we conduct thorough tests to evaluate the app’s functionality and address any issues that arise. We’ve encountered and resolved many bugs throughout this process. To maintain efficiency, we follow a structured series of steps:

- Document Issues

  After testing, we gather feedback and document all problems encountered while using the app.
  
- Identify Bugs
  
  We use `console.log` and other debugging tools to pinpoint the source of the issues.
  
- Analyze and Fix
  
  Based on the bug identified in the previous step, we analyze the root causes and implement fixes to resolve the bugs.
  
- Retest

  We re-run tests to ensure that the fixes are effective and that no new issues have been introduced.

For example, in the first testing stage, we found out that once a user has pinned a post, the post will be pinned for all users due to the logical error in our code. Thus, we checked the code for the forum screen and realized the isPinned field for all posts was storing a boolean. Therefore, once a post is pinned by one user, the field would update to be true and the post will be pinned for all users. After finding out the error, we fixed the code by linking the isPinned field to specific users and retested it.


## Software Engineering Practices

### Version Controls

#### Branching

During our development, we achieved parallel work streams by utilizing different branches. For each feature, we created separate branches, which allowed us to isolate changes related to specific features or fixes. Moreover, it enabled us to work independently without interfering with each other's code.

#### Commits

In *milestone 3*, we continued to split tasks so the two of us focused on different features. Our regular commits continued to reflect the division of work, with each commit focusing on the respective feature assigned to us. This division allowed us to maintain productivity and progress efficiently towards our milestone goals, ensuring that each feature received dedicated attention and timely updates. Just as what we did in the previous milestone, we named our commits according to the specific changes made. Some examples of our commits are “update forum: fix bugs (refresher +  clear filter menu)”, “update my pets (archive pet function)” and, “update forum: add a confirmation modal for deleting posts”. However, we did help out each other when one of us encountered issues. For example, Jeslyn helped to rearrange the code in Notebook Details Screen to reduce lagging and optimize the performance and Marianne helped to format the UI in the forum screen.
<img width="1078" alt="Screenshot 2024-07-31 at 11 32 02 PM" src="https://github.com/user-attachments/assets/d13efb5f-1da2-47ed-a858-57da15b1af0a">
<img width="1079" alt="Screenshot 2024-07-31 at 11 31 32 PM" src="https://github.com/user-attachments/assets/6da826a9-7e08-4014-a8ba-46e3737c3407">





### Software Architecture

#### User Flow Diagram

![User Flow Diagram](https://github.com/jeslynzhou/Pawllywood/assets/168978806/5cf70b07-a3cb-4a66-9296-c7d688562344)

#### Microservice Architecture Diagram

![Microservice](https://github.com/jeslynzhou/Pawllywood/assets/168978806/6e8d1bdb-c96c-4b27-97d2-225536dfd537)

## Testing

### User Testing

| User        | Comments                  | Solutions                |
|-------------|---------------------------|--------------------------|
| UserA(iOS)  | 1. Unable to upload images: device will quit when uploading images in the app.<br>2. Notebook Screen and Notebook Details Screen lagging: system crashing after selecting edit note button and unable to perform any actions such as change background colors. | 1. Set all the image qualities to 0.2 instead of 1.<br>2. Rearrange the code in the Notebook Details Screen and optimize the performance; edit Notebook Screen functions to ensure the smooth transition. |
| UserB(Android) | 1. Unable to post in the forum screen.<br>2. Can delete posts posted by all users. | 1. The user sent us the error message, and we resolved it accordingly.<br>2.Fixed the logical errors so that the delete icon now only appears for posts created by the specific user. |

### Integration Testing

| User        | Comments                  | Solutions                |
|-------------|---------------------------|--------------------------|
| Jeslyn  | All functions work. But the background color of the notebook seems to be too dark for users to view the texts.| Add transparency to the colors so they look lighter.|
| Marianne | Overall, the experience is smooth, but there is some lag.| Fetch all the data before displaying to users.|

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

| Milestone     | Jeslyn | Marianne |
|---------------|--------|----------|
| Milestone 1   | 41     | 42       |
| Milestone 2   | 137    | 134      |
| Milestone 3   | 121    | 114      |
| **Total**     | **299**| **290**  |

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
| 3 - Extension |                                                                    |          |       |       |     |
| 3.1           | Fix problem addressed in the previous milestone | Both     | 09/07 | 11/07     | 10  |
| 3.2           | Integrate Notebook feature                                          | Marianne | 11/07 | 25/07 | 88  |
| 3.3           | System Testing for Notebook feature                                 | Jeslyn   | 25/07 | 26/07     | 1   |
| 3.4           | Upgrade Profile feature | Marianne   | 25/07 | 26/07 | 4  |
| 3.5           | System Testing for Profile feature                                 | Jeslyn | 26/07 | 27/07     | 1   |
| 3.6           | Upgrade Forum feature                                          | Jeslyn     | 10/07 | 24/07 | 86  |
| 3.7           | System Testing for Forum feature                                   | Marianne     | 24/07 | 25/07    | 1   |
| 3.8           | Implement Push Notification feature | Jeslyn     | 24/07 | 26/07 | 13   |
| 3.9           | System Testing for Push Notification feature                | Marianne     | 26/07 | 27/07 | 1   |
| 3.10           | Final Testing for bonus features (internal and external testing)       | Both     | 26/07 | 27/07 | 2   |
| 3.11           | Finalize report + poster + video                                            | Both     | 27/07 | 29/07 | 8   |
