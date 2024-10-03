import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import saAddTask from './models/SuperAdmin/saAddTask.js';
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Client URL
    methods: ["GET", "POST", "DELETE", "PATCH", "UPDATE"]
  }
});

// Objective socket handler
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('task-updated', async ({ taskId, objectives }) => {
    try {
      const updatedTask = await saAddTask.findByIdAndUpdate(taskId, { objectives }, { new: true });
      io.emit('task-updated', updatedTask); // Broadcast the update to all clients
    } catch (error) {
      console.error('Error updating objectives:', error);
    }
  });
  
  

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
export { io };

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
