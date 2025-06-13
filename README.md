# SAFI - Student Assistant for Facility Information

SAFI is a full-stack application designed to help RMIT students access the latest information on campus facilities such as food retailers and study spaces via a chat interface. It scrapes facility data, processes it with AWS Bedrock and LangChain, and supports vector search.

## Notes for markers

Data is taken from the RMIT website ([RMIT Facilities website](https://www.rmit.edu.au/about/our-locations-and-facilities/facilities)). Currently only the study space and food retailer facilities are being scraped.

This application only requires npm and Nodejs. MongoDB requires no setup as it is ran locally via the npm dependency `mongodb-memory-server`. Because I wasn't aware of this requirement of not being able to use any external APIs, I relied on using Atlas MongoDB (a cloud based solution) as it came with libraries with langchain for embedding/vector searching. As I was only informed of this during the demostration (on the 13th of June) and there was no requirements in the specifications that mentioned this, I was forced to change to a locally hosted MongoDB solution while overhauling the embedding and vector searching functionality as I was unable to use AtlasVectorSearch function because of the switch (AtlasVectorSearch is only supported with their cloud solution). This is the second time where I have been told about a requirement that was never mentioned in the specifications, the first time around I was told I couldn't use any external domain knowledge for the chatbot. I have now wasted several hours on work that won't ever be marked. I hope for future assignments the specifications is made more clear. Please take this into consideration when marking.

Follow the instructions below for a more detailed guide on the installation process/instructions to run.

## Architecture

### Backend

- **Technologies:** Express, TypeScript, AWS SDK, Selenium WebDriver, LangChain, MongoDB, HNSWLib  
- **Key Features:**
  - **Data Scraping:** Uses Selenium to extract facility data from RMIT website.
  - **Data Processing:** Formats scraped data and generates summaries for different facility types using AWS Bedrock.
  - **Persistent Storage:** Stores facility records in MongoDB and builds a vector store for similarity search.
  - **Agent & Tools:** Implements an interactive agent (with LangChain) that leverages custom tools for facility lookup.
- **Folder Structure:**
  - `src/config`: AWS and database configuration.
  - `src/controllers`: API endpoints for scraping, facility updates, and Bedrock requests.
  - `src/routes`: Express routing, including bedrock and facility routes.
  - `src/services`: AWS, database, embeddings, and other service layers.
  - `src/utils`: Helpers for scraping and processing data.
  - `src/agent`: Agent implementations and supporting tools.

### Frontend

- **Technologies:** React, TypeScript, Vite, Tailwind CSS, Axios  
- **Key Features:**
  - **Chat Interface:** Lets users start new chats or continue previous sessions.
  - **Local Chat Storage:** Saves chat history in localStorage for persistence.
  - **Responsive UI:** Uses components like Header, Footer, Loading, Sidebar, and chat components.
- **Folder Structure:**
  - `src/components`: Shared UI components.
  - `src/pages`: Pages that will be displayed.
  - `src/services`: Chat service utilities for saving/retrieving conversation history.
  - `src/types`: Type definitions for chat messages and history.

## Prerequisites

Before you begin, ensure you have Node.js and npm installed on your machine:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **npm**: Included with Node.js installation

You can verify the installation by running the following commands:

```
node -v
npm -v
```

## Setup

Make sure to properly configure your `.env` file (for the backend) and `.env.development` file (for the frontend) with the required settings. 

### Backend

1. **Install Dependencies:**  
   In the backend directory, run:
   ```bash
   npm install
   ```

2. **Run Development Server:**  
   Still in the backend directory, start the development server with:
   ```bash
   npm run dev
   ```

3. **Build for Production:**  
   To create a production build, run:
   ```bash
   npm run build
   ```

### Frontend

1. **Install Dependencies:**  
   In the frontend directory, run:
   ```bash
   npm install
   ```

2. **Run Development Server:**  
   Start the Vite development server with:
   ```bash
   npm run dev
   ```

3. **Build for Production:**  
   To create a production build, run:
   ```bash
   npm run build
   ```

Alternatively you can run **`npm install`**, **`npm run dev`** and **`npm run build`** in the root directory.

By default, the frontend server runs on [localhost:5173](http://localhost:5173) and the backend server on [localhost:3000](http://localhost:3000).

## Scripts and Commands

### Root Scripts

- **`npm run dev`**: Starts both the backend and frontend development servers concurrently.
- **`npm run build`**: Builds both the backend and frontend concurrently.

### Backend Scripts

- **`npm run build`**: Compiles the TypeScript code.
- **`npm run start`**: Starts the application in production mode.
- **`npm run dev`**: Starts the development server with hot-reloading.
- **`npm run lint`**: Lints the TypeScript source files.
- **`npm run format`**: Formats code using Prettier.

### Frontend Scripts

- **`npm run dev`**: Starts the Vite development server.
- **`npm run build`**: Builds the application for production.
- **`npm run lint`**: Lints the source files.
- **`npm run format`**: Formats code using Prettier.