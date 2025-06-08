# Spring Boot WebSocket Chat – Backend Focus

A robust real-time chat backend built with **Spring Boot** and WebSocket (STOMP/SockJS).  
The frontend is provided as a demonstration and uses a modern UI inspired by **Bolt New** CSS design system to accelerate development.

---

##  Project Objective

- Deliver a scalable, extensible backend for real-time chat applications.
- Showcase Spring Boot WebSocket integration with STOMP protocol.
- Provide a ready-to-use backend for web, mobile, or desktop chat clients.
- The frontend is a quick demo, styled with **Bolt New** for rapid prototyping.

---

##  Technologies Used

- **Java 17**
- **Spring Boot 3.5**
- **Spring WebSocket (STOMP/SockJS)**
- **Lombok** (for concise Java code)
- **Maven** (build tool)
- **Bolt New** (CSS design system for frontend demo)

---

##  Architecture Overview

### 1. WebSocket Configuration

- **Endpoint:** `/ws`  
  Clients connect here using SockJS/STOMP.
- **Message Broker:**  
  - Application destination prefix: `/app`
  - Simple broker: `/topic` (for broadcasting messages)

### 2. Message Flow

1. **Client connects** to `/ws` using SockJS/STOMP.
2. **User joins:**  
   - Sends a message to `/app/chat.addUser`
   - Backend stores username in session and broadcasts a JOIN event to `/topic/public`
3. **User sends message:**  
   - Sends to `/app/chat.sendMessage`
   - Backend broadcasts to `/topic/public`
4. **User disconnects:**  
   - Backend listens for disconnect events and broadcasts a LEAVE event to `/topic/public`

### 3. Main Components

- **WebSocketConfig.java**  
  Configures endpoints and message broker.
- **ChatController.java**  
  Handles incoming messages and user join events.
- **WebSocketEventListener.java**  
  Listens for disconnect events and notifies all clients.
- **ChatMessage.java / MessageType.java**  
  Data model for chat messages and their types (CHAT, JOIN, LEAVE).

---

##  Project Structure

```
chat/
├── src/
│   └── main/
│       ├── java/com/b9l/chat/
│       │   ├── ChatApplication.java
│       │   ├── config/
│       │   │   ├── WebSocketConfig.java
│       │   │   └── WebSocketEventListener.java
│       │   └── chat/
│       │       ├── ChatController.java
│       │       ├── ChatMessage.java
│       │       └── MessageType.java
│       └── resources/static/
│           ├── css/style.css      # Bolt New-inspired CSS
│           ├── js/main.js         # Frontend logic (demo)
│           └── index.html         # Demo UI
├── pom.xml
└── README.md
```

---

##  How to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/KabilBoufares/chat.git
   cd chat
   ```

2. **Build and start the backend**
   ```bash
   ./mvnw spring-boot:run
   ```
   or (on Windows)
   ```bash
   mvnw spring-boot:run
   ```

3. **Access the demo frontend**
   - Open [http://localhost:8080](http://localhost:8080) in your browser.

---

##  Extending the Backend

- **Persistence:** Add a database to store chat history.
- **Authentication:** Integrate JWT, OAuth2, or session-based auth.
- **Private Rooms:** Add support for multiple chat rooms or private messaging.
- **Scalability:** Replace the simple broker with a full-featured broker (e.g., RabbitMQ).

---

##  Frontend & CSS Design

- The frontend is a demonstration only.
- **Bolt New** CSS design system is used for rapid, modern, and accessible UI prototyping.
- All styles are in [`src/main/resources/static/css/style.css`](src/main/resources/static/css/style.css).

---

**Backend built for scalability and extensibility.  
Frontend styled with Bolt New for rapid prototyping and time saving.**