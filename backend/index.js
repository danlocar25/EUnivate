import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
<<<<<<< HEAD
import chatMessageRoutes from './routes/chatMessageRoutes.js'; // Ensure this path is correct
import { confirmQuotationEmail } from './controllers/quotationController.js'; // Adjust the path as needed

=======
import { createServer } from 'http';
import { Server } from 'socket.io';
import saAddTask from './models/SuperAdmin/saAddTask.js';
>>>>>>> a12298df83a5658fe3effd47aaf776844b9a27ef
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Use user routes
app.use('/api/users', userRoutes);

// Chat message routes
app.use('/api/messages', chatMessageRoutes); // Ensure this path is correct
app.get('/api/users/quotation/confirm/', confirmQuotationEmail);

app.get('/quotation-complete', (req, res) => {
  res.redirect('http://localhost:5173/quotation-complete');
=======
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Client URL
    methods: ["GET", "POST", "DELETE", "PATCH", "UPDATE"]
  }
>>>>>>> a12298df83a5658fe3effd47aaf776844b9a27ef
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
<<<<<<< HEAD
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> a12298df83a5658fe3effd47aaf776844b9a27ef
