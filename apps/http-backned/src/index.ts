import express from "express";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { parse } from "path";
import { Middleware } from "./middleware";
import cors from "cors";
import bcrypt from "bcrypt";
const app = express();
app.use(cors());
app.use(express.json());

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
    res.json({
      Message: "invalid input",
    });
    return;
  }
  try {
    //@ts-ignore
    const userId = req.userId;
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        admindId: userId,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "this room is already exist",
    });
  }
});
app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
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
app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    roomId: room?.id,
  });
});
app.listen(3002, "0.0.0.0");
