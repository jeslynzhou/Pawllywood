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
- [Poster & Video](#poster--video)

### C. WIREFRAME
- [Wireframe](#wireframe)

### D. PROOF OF CONCEPT
- [Proof of Concept](#proof-of-concept)

### E. SOFTWARE ENGINEERING PRACTICES
1. [Version Controls](#version-controls)
   - [Branching](#branching)
   - [Commits](#commits)
2. [Software Architecture](#software-architecture)
   - [User Flow Diagram](#user-flow-diagram)
   - [Microservice Architecture Diagram](#microservice-architecture-diagram)

### F. DEVELOPMENT PLAN
1. [Milestone 1 | 20/05 - 03/06](#milestone-1--2005---0306)
2. [Milestone 2 | 03/06 - 01/07](#milestone-2--0306---0107)
3. [Milestone 3 | 01/07 - 29/07](#milestone-3--0107---2907)

### G. PROJECT LOG
- [Project Log](#project-log)

## Proposed Level of Achievement
Apollo 11

## Motivation
As a volunteer feeder at NUS CatCafe this semester, I've had the opportunity to contribute to the well-being of our feline friends and gained a lot of new information on how to take care of the cats. Our routine involves feeding the cats and then documenting their health conditions through photos and updates in a WhatsApp group chat. 
While this system has been effective for our small community, it became apparent that there was a wider audience of pet lovers who could benefit from this. That's when the idea for ***Pawllywood*** emerged. By transitioning from a small group chat to a dedicated app, we could reach a larger audience, foster stronger bonds within the pet lover community, and better prepare individuals for pet ownership. 
This shift would streamline communication, provide a centralized platform for sharing experiences, thoughts, doubts regarding taking care of pets, and ultimately enhance the overall experience for pet owners and foster a strong community of pet owners.

## Aim
With ***Pawllywood***, we hope to create a platform for pet lovers—whether one is a seasoned pet owner or just starting one’s journey— to come together, share their experiences and seek support from a vibrant community of fellow enthusiasts while caring for the pets.
Our ***forum*** feature allows users to engage in discussions, ask questions, and offer advice, creating a supportive environment where everyone can learn and grow together. Additionally, our ***in-app library*** also provides valuable resources and tips to help the users become the best pet parent they can be. The comprehensive resources in the library will cover everything from feeding and grooming to training and even more. Furthermore, Pawllywood integrates useful features including a powerful search engine, multi-device synchronization, ensuring seamless experience for all users.

## User Stories
- As individuals who are planning to raise a pet, I want to gain information about different animals and various breeds to decide on the most suitable animal considering my lifestyle and preferences. Also, I wish to gain knowledge about how to take care of pets to ensure I have the ability to provide the best possible care for my future furry companion.
- As pet enthusiasts and pet owners, I want to engage in discussions, ask questions, and share thoughts and pictures in a forum. Additionally, I want to have an in-app notebook to help me easily jot down notes and advice that I have received.
- As new pet owners who want to provide the best care for my pet, I want to be able to access a library of detailed pet-specific care guides and tips.
- As pet owners, I want to store my pet’s information, including breed, age, medical history and health conditions to keep track of their needs.


## Features

### Core Features
1. In-app library for pet-specific care guides
2. Forum for engaging in discussion, asking questions, and sharing thoughts and experiences through writing posts and pictures
3. Notebook to save and note down useful tips sourced from in-app library and forum
4. Authentication for user accounts

### Bonus Features
1. User engagement to add friends and initiate private chat with people
2. Push notification to inform users about updates and relevant activities
3. Multi-device synchronization
4. Effective search-engine

## Tech Stack
1. ReactNative & JavaScript (Frontend)
2. Node.js (Backend)
3. Firebase (Backend + Database)
4. Expo & GitHub & Git (Others)

## Poster & Video
<img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/4bdac6bf-6fde-494d-8e40-860153117df0" width="500px">

https://github.com/jeslynzhou/Pawllywood/assets/168978806/7f4a970c-e504-4f21-9db2-c524d817ab20

## Wireframe
***Medium Fidelity Designs***

Canva: https://www.canva.com/design/DAGF7uzLu3g/g3yj7IKo3Hcbmzxl-N5W5w/edit

*PREVIEW:*

<div style="display: flex; flex-wrap: wrap; justify-content: center;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/124c9385-8c72-4bc4-94fc-6d6d56d39ea0" alt="Splash_Login_Signup" style="width: 45%; margin: 5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/26bc50ea-29bc-4f0f-aaf2-6eb87b23444e" alt="Home Screen" style="width: 45%; margin: 5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/c91576c1-6f4c-418d-afb1-d8db9dbb5d5e" alt="Profile Screen" style="width: 45%; margin: 5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/7a0ac2af-66db-4fd9-8926-95ed283fa2f0" alt="Notebook Screen" style="width: 45%; margin: 5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/d63e7d6a-f4a0-41b1-af87-36b052367467" alt="Library Screen" style="width: 45%; margin: 5px;">
    <img src="https://github.com/jeslynzhou/Pawllywood/assets/157949261/db01cfe6-b157-4f31-9304-0522d377ad37" alt="Forum Screen" style="width: 45%; margin: 5px;">
</div>

## Proof of Concept
<!-- Content for Proof of Concept -->

## Software Engineering Practices
 
### Version Controls

#### Branching

During our development, we achieved parallel work streams by utilizing different branches. Each team member created separate branches to independently develop features and fixes. This strategy allowed us to isolate our commits, effectively track, and manage changes. Once a feature was completed or a fix implemented, we merged the respective changes into the main branch. At this stage, since we only focus on one single feature, we named our branches using our names, making it easy for us to identify individual work streams. As we move into Milestone 2, we will create additional branches specific to each feature to maintain our organized workflow and ensure smooth integration.

#### Commits

For milestone 1, our regular commits focus on developing user authentication. To ensure easy tracking and management of our changes, we named our commits according to the specific changes made. Some examples of our commits are “Add Retype Password for Sign In”, “Login & Sign up Screen” and, “organize files”.

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
- Refine UI
- Implement core features (Profile, Library, and Forum)
- System testing

### Milestone 3 | 01/07 - 29/07
- Implement bonus features (Notebook, User Engagement, Multi-device synchronization, and Push Notification)
- System testing
- Bug fixing


## Project Log
Total hours for Milestone 1:

Jeslyn: 41

Marianne: 42

| Milestone | Tasks | PIC | Start | End | Hrs |
|-----------|-------|-----|-------|-----|-----|
| 1 - Ideation   | | | | | |
| 1.1 | Formulate project idea | Both | 12/05 | 13/05 | 3 |                  
| 1.2 | Brainstorm features | Both | 13/05 | 14/05 | 2 |            
| 1.3 | Project Poster + Video for Lift-off | Both | 14/05 | 20/05 | 8 |           
| 1.4 | Design first draft UI for the app | Marianne | 21/05 | 23/05 | 8 |                  
| 1.5 | Design development plan | Marianne | 28/05 | - | 1 |      
| 1.6 | Refine User Flow Diagram | Marianne | 28/05 | 29/05 | 1 |
| 1.7 | Refine Poster with confirmed techstack | Jeslyn | 29/05 | - | 1 | 
| 1.8 | Technical Proof of Concept (for Authentication) | Both | 29/05 | 31/05 | 12 | 
| 1.9 | Deployment | Jeslyn | 31/05 | 01/06 | 6 | 
| 1.10 | Update Video with PoC + next plan | Both | 01/06 | 02/06 | 4 | 
| 1.11 | Refine Code in ReactNative (make it scalable, organize in folders) | Jeslyn | 02/06 | 03/06 | 2 |
| 1.12 | Write report | Both | 03/06 | - | 3 | 
