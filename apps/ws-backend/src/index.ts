import { WebSocketServer, WebSocket } from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8081, host: "0.0.0.0" });

// Add better error handling
wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

wss.on("listening", () => {
  console.log("WebSocket server is listening on port 8081");
});

interface user {
  ws: WebSocket;
  rooms: string[];
  userId: string;
  userName?: string;
  isDrawing?: boolean;
  lastActivity?: number;
}

// 1. Move global variables outside connection handler
const users: user[] = [];
const pendingShapeUpdates = new Map<string, NodeJS.Timeout>();
const userDrawingTimeouts = new Map<string, NodeJS.Timeout>(); // ✅ Global Map
const userRemovalInProgress = new Set<string>(); // ✅ Global Set

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
      return null;
    }
    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    return decoded.userId;
  } catch (e) {
    console.error("JWT verification failed:", e);
    return null;
  }
}

// 1. Enhanced helper function with error handling
function getActiveRoomParticipants(roomId: string, excludeWs?: WebSocket) {
  console.log(`getActiveRoomParticipants called for room ${roomId}`);
  console.log(`Total users in system: ${users.length}`);
  console.log(
    `Users details:`,
    users.map((u) => ({
      userId: u.userId,
      rooms: u.rooms,
      wsState: u.ws.readyState,
      inRoom: u.rooms.includes(roomId),
      wsOpen: u.ws.readyState === WebSocket.OPEN,
    })),
  );

  const filtered = users.filter(
    (u) =>
      u.rooms.includes(roomId) &&
      u.ws.readyState === WebSocket.OPEN &&
      (!excludeWs || u.ws !== excludeWs),
  );

  console.log(
    `Filtered participants for room ${roomId}:`,
    filtered.map((u) => u.userId),
  );
  return filtered;
}

// 2. Safe broadcast function
function safeBroadcastToRoom(
  roomId: string,
  message: any,
  excludeWs?: WebSocket,
) {
  const roomParticipants = getActiveRoomParticipants(roomId, excludeWs);
  roomParticipants.forEach((u) => {
    try {
      if (u.ws.readyState === WebSocket.OPEN) {
        u.ws.send(JSON.stringify(message));
      }
    } catch (error) {
      console.error(`Failed to send message to user ${u.userId}:`, error);
    }
  });
  return roomParticipants;
}

wss.on("connection", function connection(ws, request) {
  console.log("New WebSocket connection attempt");

  const url = request.url;
  if (!url) {
    console.log("No URL provided, closing connection");
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  console.log("Token received:", token ? "Present" : "Missing");

  const userId = checkUser(token);
  if (!userId) {
    console.log("Invalid token, closing connection");
    ws.close();
    return null;
  }

  console.log("User authenticated:", userId);
  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data as unknown as string);
      console.log("Received message:", parsedData.type, "from user:", userId);

      const user = users.find((x) => x.ws === ws);
      if (!user) {
        console.log("User not found in users array");
        return;
      }

      if (parsedData.type === "join_room") {
        console.log("User joining room:", parsedData.roomId);

        // Check if user is already in this room
        if (!user.rooms.includes(parsedData.roomId)) {
          user.rooms.push(parsedData.roomId);
          console.log(
            `User ${userId} added to room ${parsedData.roomId}. User rooms:`,
            user.rooms,
          );

          // Immediately get and broadcast participant count
          const roomParticipants = getActiveRoomParticipants(parsedData.roomId);
          const participantCount = roomParticipants.length;

          console.log(
            `Room ${parsedData.roomId} now has ${participantCount} active participants:`,
            roomParticipants.map((p) => p.userId),
          );

          // Broadcast updated participant count to all users in the room
          safeBroadcastToRoom(parsedData.roomId, {
            type: "participant_count_update",
            roomId: parsedData.roomId,
            count: participantCount,
            participants: roomParticipants.map((p) => p.userId),
          });
        } else {
          // User is already in room, just send current count
          const roomParticipants = getActiveRoomParticipants(parsedData.roomId);
          const participantCount = roomParticipants.length;

          ws.send(
            JSON.stringify({
              type: "participant_count_update",
              roomId: parsedData.roomId,
              count: participantCount,
              participants: roomParticipants.map((p) => p.userId),
            }),
          );
        }
      }

      if (parsedData.type === "get_participant_count") {
        const { roomId } = parsedData;

        // Ensure user is in the room before counting
        if (!user.rooms.includes(roomId)) {
          user.rooms.push(roomId);
          console.log(
            `User ${userId} auto-joined room ${roomId} on count request`,
          );
        }

        const roomParticipants = getActiveRoomParticipants(roomId);
        const participantCount = roomParticipants.length;

        console.log(
          `User ${userId} requested participant count for room ${roomId}: ${participantCount} active users`,
        );

        // Send response directly to requesting user
        ws.send(
          JSON.stringify({
            type: "participant_count_update",
            roomId: roomId,
            count: participantCount,
            participants: roomParticipants.map((p) => p.userId),
          }),
        );

        // Also broadcast to all room participants (excluding requesting user to avoid duplicate)
        safeBroadcastToRoom(
          roomId,
          {
            type: "participant_count_update",
            roomId: roomId,
            count: participantCount,
            participants: roomParticipants.map((p) => p.userId),
          },
          ws,
        );
      }

      if (parsedData.type === "user_activity") {
        const { roomId, activity, userName } = parsedData;

        // Update user info
        user.userName = userName;
        user.lastActivity = Date.now();

        // Try to get user name from database if not provided
        if (!userName || userName.startsWith("User ")) {
          try {
            const dbUser = await prismaClient.user.findUnique({
              where: { id: user.userId },
              select: { name: true },
            });
            if (dbUser?.name) {
              user.userName = dbUser.name;
            }
          } catch (error) {
            console.error("Error fetching user name from database:", error);
          }
        }

        // Broadcast user activity to all users in the room
        safeBroadcastToRoom(roomId, {
          type: "user_activity_update",
          roomId: roomId,
          userId: user.userId,
          userName: user.userName || userName,
          activity: activity,
          timestamp: Date.now(),
        });
      }

      if (parsedData.type === "leave_room") {
        console.log("User leaving room:", parsedData.roomId);
        const wasInRoom = user.rooms.includes(parsedData.roomId);
        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);

        if (wasInRoom) {
          // Get only active users in this specific room (after user left)
          const roomParticipants = getActiveRoomParticipants(parsedData.roomId);
          const participantCount = roomParticipants.length;

          console.log(
            `Room ${parsedData.roomId} now has ${participantCount} active participants after user left`,
          );

          // Broadcast updated participant count to all users still in the room
          safeBroadcastToRoom(parsedData.roomId, {
            type: "participant_count_update",
            roomId: parsedData.roomId,
            count: participantCount,
            participants: roomParticipants.map((p) => p.userId),
          });
        }
      }

      if (parsedData.type === "chat") {
        const { roomId, message } = parsedData;
        console.log("Chat message in room:", roomId);

        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId,
          },
        });

        safeBroadcastToRoom(roomId, {
          type: "chat",
          message,
          roomId,
        });
      }

      if (parsedData.type === "edit_shape") {
        const { roomId, shape, isDragging } = parsedData;
        console.log("Edit shape in room:", roomId, "isDragging:", isDragging);

        // If this is a dragging update, debounce it to prevent spam
        if (isDragging) {
          const key = `${roomId}-${shape.id || "unknown"}`;

          // Clear existing timeout
          if (pendingShapeUpdates.has(key)) {
            clearTimeout(pendingShapeUpdates.get(key)!);
          }

          // Set new timeout to batch the update
          const timeout = setTimeout(async () => {
            try {
              // Only save to DB when dragging stops
              await prismaClient.chat.create({
                data: {
                  roomId: Number(roomId),
                  message: JSON.stringify({
                    type: "shape_update",
                    shape,
                    timestamp: Date.now(),
                  }),
                  userId,
                },
              });
              pendingShapeUpdates.delete(key);
            } catch (error) {
              console.error("Error saving shape update:", error);
              pendingShapeUpdates.delete(key);
            }
          }, 100); // 100ms debounce

          pendingShapeUpdates.set(key, timeout);
        } else {
          // Immediate save for non-dragging edits
          await prismaClient.chat.create({
            data: {
              roomId: Number(roomId),
              message: JSON.stringify({
                type: "shape_update",
                shape,
                timestamp: Date.now(),
              }),
              userId,
            },
          });
        }

        // Broadcast to all users in the room
        safeBroadcastToRoom(roomId, {
          type: "edit_shape",
          shape,
          roomId,
          isDragging,
        });
      }

      if (parsedData.type === "draw") {
        const { roomId, shape } = parsedData;
        console.log("Draw shape in room:", roomId);

        // Update user's drawing status
        user.isDrawing = true;
        user.lastActivity = Date.now();

        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message: JSON.stringify({
              type: "shape_create",
              shape,
              timestamp: Date.now(),
            }),
            userId,
          },
        });

        // Try to get user name from database if not already set
        if (!user.userName || user.userName.startsWith("User ")) {
          try {
            const dbUser = await prismaClient.user.findUnique({
              where: { id: user.userId },
              select: { name: true },
            });
            if (dbUser?.name) {
              user.userName = dbUser.name;
            }
          } catch (error) {
            console.error("Error fetching user name from database:", error);
          }
        }

        // Broadcast drawing activity to all users in the room
        safeBroadcastToRoom(roomId, {
          type: "draw",
          shape,
          roomId,
          drawingUser: {
            userId: user.userId,
            userName: user.userName || `User ${user.userId.slice(0, 8)}`,
          },
        });

        // Clear drawing status after a short delay
        if (userDrawingTimeouts.has(userId)) {
          clearTimeout(userDrawingTimeouts.get(userId)!);
        }

        const timeout = setTimeout(() => {
          if (user && user.ws.readyState === WebSocket.OPEN) {
            user.isDrawing = false;
          }
          userDrawingTimeouts.delete(userId);
        }, 2000);

        userDrawingTimeouts.set(userId, timeout);
      }

      if (parsedData.type === "erase") {
        const { roomId, shapeId } = parsedData;
        console.log("Erase shape in room:", roomId, "shapeId:", shapeId);

        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message: JSON.stringify({
              type: "shape_delete",
              action: "erase",
              shapeId,
              timestamp: Date.now(),
            }),
            userId,
          },
        });

        safeBroadcastToRoom(roomId, {
          type: "erase",
          shapeId,
          roomId,
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // 5. Fix WebSocket close race condition
  ws.on("close", () => {
    if (userRemovalInProgress.has(userId)) {
      return; // Already being processed
    }

    userRemovalInProgress.add(userId);

    try {
      const user = users.find((user) => user.ws === ws);
      if (user) {
        const userRooms = [...user.rooms];
        console.log(`User ${userId} disconnected from rooms:`, userRooms);

        // Remove user first
        const index = users.findIndex((u) => u.ws === ws);
        if (index !== -1) {
          users.splice(index, 1);
          console.log(
            `Removed user ${userId}. Total users now: ${users.length}`,
          );
        }

        // Update counts for each room the user was in
        userRooms.forEach((roomId) => {
          const roomParticipants = getActiveRoomParticipants(roomId);
          const participantCount = roomParticipants.length;

          console.log(
            `Room ${roomId} participant count after user ${userId} left: ${participantCount}`,
          );

          safeBroadcastToRoom(roomId, {
            type: "participant_count_update",
            roomId: roomId,
            count: participantCount,
            participants: roomParticipants.map((p) => p.userId),
          });
        });
      }
    } catch (error) {
      console.error(`Error handling user ${userId} disconnect:`, error);
    } finally {
      userRemovalInProgress.delete(userId);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error for user:", userId, error);
  });
});
