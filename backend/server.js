const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/hotelDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], required: true },
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role selected." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required." });
  }

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({ message: "Login successful!", role: user.role, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Room Schema and Model
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, trim: true },
  location: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  description: { type: String, trim: true },
  size: { type: Number, min: 0 },
  maxPerson: { type: Number, min: 1 },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  image: { type: String, trim: true },
});

const Room = mongoose.model("Room", roomSchema);

// Booking Schema and Model
const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  members: { type: Number, required: true, min: 1 },
  rooms: { type: Number, required: true, min: 1 },
});

const Booking = mongoose.model("Booking", bookingSchema);

// Booking Route with Overlap Check
app.post("/api/book-room", async (req, res) => {
  try {
    const { roomId, name, email, phone, checkIn, checkOut, members, rooms } = req.body;

    if (!roomId || !name || !email || !phone || !checkIn || !checkOut || !members || !rooms) {
      return res.status(400).json({ message: "All booking fields are required." });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Check-out date must be after check-in date." });
    }

    // Confirm the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Find bookings for the same room
    const existingBookings = await Booking.find({ roomId });

    // Check if requested dates overlap any existing booking for this room
    const isOverlapping = existingBookings.some((booking) => {
      const existingCheckIn = new Date(booking.checkIn).getTime();
      const existingCheckOut = new Date(booking.checkOut).getTime();
      const requestedCheckIn = checkInDate.getTime();
      const requestedCheckOut = checkOutDate.getTime();

      return !(requestedCheckOut <= existingCheckIn || requestedCheckIn >= existingCheckOut);
    });

    if (isOverlapping) {
      return res.status(400).json({ message: "Room not available for selected dates." });
    }

    const newBooking = new Booking({
      roomId,
      name,
      email,
      phone,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      members,
      rooms,
    });

    await newBooking.save();

    res.status(201).json({ message: "Room booked successfully." });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error booking room." });
  }
});

// GET all rooms
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("Fetch rooms error:", error);
    res.status(500).json({ message: "Server error fetching rooms." });
  }
});

// GET room by ID
app.get("/api/rooms/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    console.error("Fetch room error:", error);
    res.status(500).json({ message: "Server error fetching room." });
  }
});

// POST add a room
app.post("/api/rooms", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Add room error:", error);
    res.status(400).json({ message: "Invalid room data." });
  }
});

// PUT update a room
app.put("/api/rooms/:id", async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
    res.json(updatedRoom);
  } catch (error) {
    console.error("Update room error:", error);
    res.status(400).json({ message: "Invalid update data." });
  }
});

// DELETE a room
app.delete("/api/rooms/:id", async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted." });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ message: "Server error deleting room." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
