import express from "express";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
  JoinRoomSchema,
  UpdateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { parse } from "path";
import { Middleware } from "./middleware";
import cors from "cors";
import bcrypt from "bcrypt";
const app = express();
app.use(cors());
app.use(express.json());

// Utility function to generate random 6-character short code
function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log("Validation error:", parsedData.error);
    res.status(400).json({
      message: "Invalid input data",
      errors: parsedData.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }
  const email = parsedData.data.email;
  const password = parsedData.data.password;
  const name = parsedData.data.name;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        email: email,
        password: hashPassword,
        name: name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    console.error("Signup error:", e);
    res.status(409).json({
      message: "User already exists with this email",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid signin data",
      errors: parsedData.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }
  const email = parsedData.data.email;
  const password = parsedData.data.password;
  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    res.status(403).json({
      message: "Not Authorized",
    });
    return;
  }
  const comparepassword = await bcrypt.compare(password, user.password);
  if (!comparepassword) {
    res.status(403).json({
      message: "Not Authorized,.....",
    });
    return;
  }

  const token = Jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET,
  );
  res.json({
    token,
  });
});

app.post("/room", Middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.status(400).json({
      message: "Invalid input",
      errors: parsedData.error.issues,
    });
    return;
  }

  try {
    //@ts-ignore
    const userId = req.userId;

    // Generate unique short code
    let shortCode = generateShortCode();
    let existingRoom = await prismaClient.room.findFirst({
      where: { shortCode },
    });

    // Regenerate if code already exists
    while (existingRoom) {
      shortCode = generateShortCode();
      existingRoom = await prismaClient.room.findFirst({
        where: { shortCode },
      });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (parsedData.data.password) {
      hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    }

    const room = await prismaClient.room.create({
      data: {
        shortCode,
        name: parsedData.data.name,
        password: hashedPassword,
        isPublic: parsedData.data.isPublic,
        admindId: userId,
      },
    });

    res.json({
      roomId: room.shortCode,
      name: room.name,
      isPublic: room.isPublic,
    });
  } catch (error) {
    console.error("Room creation error:", error);
    res.status(500).json({
      message: "Failed to create room",
    });
  }
});
app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomShortCode = req.params.roomId;

    // First, find the room by shortCode to get the numeric ID
    const room = await prismaClient.room.findFirst({
      where: {
        shortCode: roomShortCode,
      },
    });

    if (!room) {
      res.status(404).json({
        error: "Room not found",
      });
      return;
    }

    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: room.id,
      },
      orderBy: {
        id: "asc", // Changed to ascending to maintain proper order
      },
      take: 1000, // Increased limit to handle more messages
    });

    // Filter out invalid messages and add proper error handling
    const validMessages = messages.filter((msg) => {
      try {
        if (!msg.message) return false;
        const parsed = JSON.parse(msg.message);
        return parsed && (parsed.type || parsed.shape); // Accept both old and new format
      } catch {
        return false; // Skip invalid JSON messages
      }
    });

    res.json({
      messages: validMessages,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      error: "Failed to fetch chat messages",
    });
  }
});
// Join room endpoint
app.post("/room/join", Middleware, async (req, res) => {
  const parsedData = JoinRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid input",
      errors: parsedData.error.issues,
    });
    return;
  }

  try {
    const { shortCode, password } = parsedData.data;

    const room = await prismaClient.room.findFirst({
      where: { shortCode },
    });

    if (!room) {
      res.status(404).json({
        message: "Room not found",
      });
      return;
    }

    // Check password for private rooms
    if (!room.isPublic) {
      if (!password || !room.password) {
        res.status(401).json({
          message: "Password required for private room",
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, room.password);
      if (!isPasswordValid) {
        res.status(401).json({
          message: "Invalid room password",
        });
        return;
      }
    }

    res.json({
      roomId: room.shortCode,
      name: room.name,
      isPublic: room.isPublic,
    });
  } catch (error) {
    console.error("Room join error:", error);
    res.status(500).json({
      message: "Failed to join room",
    });
  }
});

// Get room info by short code
app.get("/room/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;
  const room = await prismaClient.room.findFirst({
    where: { shortCode },
    select: {
      shortCode: true,
      name: true,
      isPublic: true,
      created_at: true,
    },
  });

  if (!room) {
    res.status(404).json({
      message: "Room not found",
    });
    return;
  }

  res.json({
    roomId: room.shortCode,
    name: room.name,
    isPublic: room.isPublic,
    created_at: room.created_at,
  });
});

// Get user's created rooms
app.get("/my-rooms", Middleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.userId;

    const rooms = await prismaClient.room.findMany({
      where: { admindId: userId },
      select: {
        shortCode: true,
        name: true,
        isPublic: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json({ rooms });
  } catch (error) {
    console.error("Get my rooms error:", error);
    res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
});

// Update room
app.put("/room/:shortCode", Middleware, async (req, res) => {
  const parsedData = UpdateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid input",
      errors: parsedData.error.issues,
    });
    return;
  }

  try {
    //@ts-ignore
    const userId = req.userId;
    const shortCode = req.params.shortCode;

    const room = await prismaClient.room.findFirst({
      where: { shortCode, admindId: userId },
    });

    if (!room) {
      res.status(404).json({
        message: "Room not found or not authorized",
      });
      return;
    }

    const updateData: any = {};
    if (parsedData.data.name) updateData.name = parsedData.data.name;
    if (parsedData.data.isPublic !== undefined)
      updateData.isPublic = parsedData.data.isPublic;
    if (parsedData.data.password) {
      updateData.password = await bcrypt.hash(parsedData.data.password, 10);
    }

    const updatedRoom = await prismaClient.room.update({
      where: { shortCode },
      data: updateData,
      select: {
        shortCode: true,
        name: true,
        isPublic: true,
      },
    });

    res.json(updatedRoom);
  } catch (error) {
    console.error("Room update error:", error);
    res.status(500).json({
      message: "Failed to update room",
    });
  }
});

// Delete room
app.delete("/room/:shortCode", Middleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const shortCode = req.params.shortCode;

    const room = await prismaClient.room.findFirst({
      where: { shortCode, admindId: userId },
    });

    if (!room) {
      res.status(404).json({
        message: "Room not found or not authorized",
      });
      return;
    }

    // Delete related chat messages first (cascade delete)
    await prismaClient.chat.deleteMany({
      where: { roomId: room.id },
    });

    // Then delete the room using the primary key (id)
    await prismaClient.room.delete({
      where: { id: room.id },
    });

    res.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Room delete error:", error);
    console.error("Error details:", {
      shortCode: req.params.shortCode,
      //@ts-ignore
      userId: req.userId,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({
      message: "Failed to delete room",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
app.listen(3002, "0.0.0.0");
