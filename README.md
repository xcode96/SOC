SOC Concepts Interactive Guide
An interactive, AI-enhanced web application for learning cybersecurity concepts. Features a dynamic content management system allowing administrators to create, edit, and manage multiple educational guides.
![alt text](https://storage.googleapis.com/aistudio-ux-team-public/apps/soc-guide/soc-guide-screenshot.png)
✨ Core Features
📚 Multiple Interactive Guides: Comes pre-loaded with guides on SOC Concepts, PowerShell, and Auditing.
🔧 Dynamic Content Management: A full-featured admin dashboard to create new guides, add/edit/delete topics, and manage users.
🤖 AI-Powered Explanations: Integrated with the Google Gemini API to provide "Simple" and "Expert" explanations for any selected concept.
🎨 Rich Content Formatting: Supports various content types including headings, lists, highlighted blocks, colored text, and tables.
💾 Data Persistence: All guides, cards, and user data are saved directly to the browser's localStorage.
🔄 Import/Export: Easily back up and restore all application data (guides, users, etc.) with a single JSON file.
📱 Responsive Design: Fully responsive layout for a seamless experience on desktop and mobile devices.
🔍 Searchable Topics: Quickly find topics within a guide using the sidebar search functionality.
🚀 Tech Stack
Frontend: React, TypeScript
Styling: Tailwind CSS
AI Integration: Google Gemini API (@google/genai)
Deployment: No build step required; uses ES modules and an importmap for CDN-based dependencies.
📂 Project Structure
The project is organized into a clean and maintainable structure:
code
Code
.
├── data/               # Initial data for guides (socConcepts.ts, etc.)
├── components/         # Reusable React components (Header, Sidebar, etc.)
├── layouts/            # Layout components (GuideLayout)
├── pages/              # Page components for routes (HomePage, AdminDashboardPage, etc.)
├── index.html          # Main HTML entry point with importmap
├── index.tsx           # React application root
├── App.tsx             # Main component with routing and state management
└── types.ts            # TypeScript type definitions
⚙️ Getting Started
To run this application locally, you will need a local web server and a Google Gemini API key.
Prerequisites
A modern web browser (Chrome, Firefox, Safari, Edge).
A Google Gemini API Key. You can obtain one from Google AI Studio.
Installation & Setup
Clone the repository or download the source files.
Configure the API Key:
This application is designed to load the Gemini API key from an environment variable process.env.API_KEY. Since this is a static frontend application, you'll need a local development server capable of handling this. One of the simplest ways is using a tool like vite.
Install vite:
code
Bash
npm install -g vite
Create a file named .env in the project root directory.
Add your API key to the .env file:
code
Code
VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
Important: The application code in components/ExplanationModal.tsx needs to be aware of Vite's environment variable convention. You would change process.env.API_KEY to import.meta.env.VITE_API_KEY.
Run the application:
From your project's root directory, start the development server:
code
Bash
vite
Open your browser and navigate to the local address provided by Vite (e.g., http://localhost:5173).
📖 How to Use
Exploring Guides
Homepage: The main screen displays a dashboard of all available learning guides.
Select a Guide: Click on any guide card to enter the learning interface.
Navigate Topics: Use the sidebar on the left to browse and select different topics within the guide. The sidebar is searchable for quick access.
Get AI Explanations: Hover over any paragraph, heading, or highlight box. A ✨ icon will appear. Click it to open a modal and receive an AI-generated explanation of the concept, with options for both "Simple" and "Expert" levels of detail.
🔑 Admin Panel
The application includes a powerful admin panel for managing all content.
Login:
Access the login page by navigating to /#/admin/login in your browser.
Default users are admin and dq.adm.
The default password for all users is password.
Admin Dashboard:
Create New Guides: Fill out the form to create a new guide card on the homepage. Each guide needs a unique ID.
Manage Current Guides: View a list of all existing guides and click "Edit" to manage their content.
Manage Admin Users: Add new admin users or delete existing ones.
Data Actions:
Export All Data: Download a single json file containing all guides, cards, and users.
Import Data: Upload a previously exported json file to restore the application's state. This will overwrite all existing data.
Reset to Default: Revert all guides, cards, and users to the initial state defined in the source code.
Guide Editor:
Add Topics: Create new topics for the guide you are editing.
Edit Topics: Click "Edit" on any topic to modify its title, ID, and content directly in JSON format. A simple form is also available to help you add new content blocks without writing JSON manually.
Delete Topics: Permanently remove topics from a guide.
Import/Export Guide: Import or export the data for the specific guide you are currently editing.
