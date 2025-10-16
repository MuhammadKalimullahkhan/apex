Apex Wazar (Software House Management System) - Technical Specification

This document serves as the complete, start-to-finish specification for developing the "Apex Wazar" application using a Laravel-Inertia-React architecture.

1. Core Technology Stack

Component

Technology

Rationale

Backend

Laravel 11+ (API/Routing)

Robust, established PHP framework.

Frontend

Inertia.js + React.js

Single Page Application (SPA) feel with server-side routing (SSR optional).

Styling

Tailwind CSS

Utility-first framework for rapid, responsive UI development.

Database

MySQL/PostgreSQL

Relational database for structured project/task data.

Real-Time

Laravel Reverb + Laravel Echo

First-party solution for efficient, scalable WebSocket communication (in-app).

Push Notifications

OneSignal

External service integration for reliable browser/mobile push alerts.

Authentication

Laravel Sanctum / Fortify (for API) & Socialite (for OAuth2)

Secure, stateful and stateless authentication.

2. User Roles and Permissions (MANDATORY)

The application will use the following four primary roles. All users are authenticated using Custom or OAuth2 methods.

Role

Dashboard Access

Project Management (CRUD)

Team Chat

Performance Analytics

Document Storage (R/W)

Admin (System)

Full System Overview (All Data)

Full CRUD on All Projects/Tasks

All Forums/Private Chat

Full Access (All Employees)

Full Access

Project Manager (PM)

Projects/Tasks/Team Summary

Full CRUD on Assigned Projects/Tasks

All Forums/Private Chat

View Team & Assigned Developers

Full Access

Developer

Assigned Tasks Overview

Read/Update only Assigned Tasks

All Forums/Private Chat

View Own Performance only

Read/Upload only

Client (External)

Specific Project Status & Milestones

Read-Only on Their Project(s)

Specific Project Forum only

None

Read-Only

3. Data Model (Database Schema)

We require the following Eloquent Models and their primary relationships:

A. Users (users table)

name, email, password

role: (Enum: 'admin', 'pm', 'developer', 'client')

onesignal_player_id: (Nullable String - for OneSignal push targeting)

B. Projects (projects table)

name, description, status: (Enum: 'In Progress', 'Completed', 'On Hold')

client_id: (Foreign Key to users - Client Role)

manager_id: (Foreign Key to users - ProjectManager Role)

estimated_completion_date:  DATE_TIME

C. Tasks (tasks table)

project_id: (Foreign Key to projects)

title, description, due_date, priority: (Enum: 'Low', 'Medium', 'High')

assigned_to_id: (Foreign Key to users - Developer Role)

status: (Enum: 'To Do', 'In Progress', 'Awaiting Review', 'Done')

D. Team Collaboration (messages table)

sender_id: (Foreign Key to users)

content

resource_type: (Enum: 'project', 'task', 'general')

resource_id: (Nullable Integer - ID of the project/task the message belongs to)

is_private: (Boolean - for 1-on-1 developer chat)

E. Performance Metrics (performance_metrics table)

user_id: (Foreign Key to users - Developer Role)

metric_date: (Date)

completion_rate: (Decimal)

time_on_task: (Integer - in hours)

quality_score: (Decimal)

F. Documents (documents table)

project_id: (Foreign Key to projects)

uploaded_by_id: (Foreign Key to users)

file_path: (String - path on disk/S3)

file_name, mime_type

4. Feature Implementation Details

4.1. Dashboard (Inertia Page)

Logic: Dynamically renders content based on the authenticated user's role.

Admin/PM: Shows cards for total projects, tasks overdue, team activity feed.

Developer: Shows a list of tasks assigned, sorted by due_date and priority.

Client: Shows the status and percentage completion of their assigned projects.

Performance: All necessary data must be passed as Inertia Props for the initial render to avoid multiple API calls.

4.2. Project Management (Inertia CRUD)

Task Tracking: Use a Kanban-style board (React component) for visualization of Tasks moving through the status workflow.

Assignment: Only ProjectManagers and Admins can assign tasks. Developers can only update the status and log time/notes.

4.3. Team Collaboration (Real-Time)

General/Project Forums: Messages are saved to the messages table. When a message is created, a Laravel Broadcast Event must be fired via Laravel Reverb to the relevant channel (project.{id} or general).

Real-Time Chat: The React frontend must listen to these channels using Laravel Echo to display messages instantly without page refresh.

4.4. Performance Analytics (Visual Reports)

Endpoint: A dedicated API endpoint (/api/performance/{userId?}) must exist.

Data Visualization: The React component must use a charting library (e.g., Recharts) to display visual reports (bar charts for completion rate, line charts for time on task over time).

Access Control: Data returned must respect the roles defined in Section 2.

4.5. Push Notifications (OneSignal Integration)

In-App Alerts: General task updates will use Laravel Echo to notify users logged into the web app (e.g., a simple bell icon counter update).

External Push (OneSignal):

The Laravel backend must use a OneSignal package (like ladumor/one-signal) to send external push notifications for critical events:

Task assigned to a user.

Task status changes to 'Awaiting Review'.

Notifications must be targeted using the onesignal_player_id stored on the users table.

5. Next Steps for Implementation

The implementation should begin by setting up the Laravel project, configuring the Inertia + React scaffolding, and defining the database migrations for the models specified in Section 3.For Every “Descriptions”

the description field must be stored in MD when they render on the front-end there must be a md-editor like user can make text bold,itlic, liting changing font, heading etc