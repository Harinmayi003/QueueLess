# QueueLess – Smart Queue Management System

QueueLess is a web-based smart queue management system designed to reduce waiting time and simplify customer queue handling.

It allows customers to join a queue digitally, receive a token number, and track their queue status. Administrators can manage the queue through a dedicated dashboard.

## Features

### Customer Portal
- Join a queue by entering your name.
- Receive a digital appointment ticket with a unique token number.
- View your current queue position.
- Check estimated waiting time.
- Track ticket status in real time.
- Join another queue after completing a service.

### Admin Dashboard
- View queue statistics and customer details.
- Monitor waiting, serving, completed, and skipped customers.
- Call the next customer.
- Skip a customer when necessary.
- Mark a customer's service as completed.
- View queue updates through automatic synchronization.

### Additional Features
- Input validation for customer names.
- Confirmation prompts for administrative actions.
- Responsive user interface.
- Status indicators for different queue stages.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| JavaScript | Application logic |
| HTML5 | Structure |
| CSS3 | Styling and responsive design |
| Vite | Frontend development server |
| Java | Backend development |
| Spring Boot | REST API development |
| REST API | Frontend-backend communication |

## Project Structure

```text
QueueLess/
│
├── queueless/
│   └── src/
│       └── main/
│           └── java/
│               └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## API Endpoints

Base URL: `http://localhost:8081/api/queue`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/queue` | Retrieve queue details |
| POST | `/api/queue/join` | Add a customer to the queue |
| POST | `/api/queue/call-next` | Call the next waiting customer |
| POST | `/api/queue/skip-next` | Skip the next waiting customer |
| POST | `/api/queue/complete` | Mark the serving customer as completed |

## Getting Started

### Prerequisites

- Java Development Kit (JDK)
- Node.js and npm
- An IDE such as IntelliJ IDEA or VS Code

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Start the Backend

Open the backend project located in the `queueless` folder using your Java IDE.

Run the Spring Boot application.

The backend runs at:

```text
http://localhost:8081
```

### 3. Start the Frontend

Open a terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## How It Works

1. A customer enters their name and joins the queue.
2. The system generates a unique token number.
3. The customer receives a digital ticket containing their queue position and estimated waiting time.
4. The administrator manages the queue through the admin dashboard.
5. The customer and admin views synchronize with the backend to reflect queue updates.

## Project Objective

The objective of QueueLess is to make traditional queue management more efficient by digitizing the appointment and waiting process.

It aims to improve customer convenience, reduce manual queue handling, and provide administrators with a simple interface for managing customer flow.

## Future Enhancements

- SMS and email notifications.
- QR-code-based appointment tickets.
- Advanced queue analytics.
- Multiple service counters.
- Appointment scheduling.

---

**QueueLess – Making queues simpler, smarter, and more efficient.**