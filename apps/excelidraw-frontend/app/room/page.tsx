"use client";
import React, { useState, useEffect } from "react";
import { getBackendUrl, getExileUrl } from "@/config";
import { useRouter } from "next/navigation";
import {
  PenLine,
  Plus,
  Settings,
  Trash2,
  Eye,
  Copy,
  Lock,
  AlertCircle,
  X,
} from "lucide-react";
import axios from "axios";

interface Room {
  shortCode: string;
  name: string;
  isPublic: boolean;
  created_at: string;
}

function Home() {
  const router = useRouter();

  // Create room form state
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Join room form state
  const [joinCode, setJoinCode] = useState("");

  // My rooms state
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Edit room state
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);

  // Error message state
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    if (token) {
      fetchMyRooms();
    }

    // Check for error message from room validation
    const roomError = sessionStorage.getItem("roomError");
    if (roomError) {
      setErrorMessage(roomError);
      sessionStorage.removeItem("roomError");

      // Clear error after 5 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }, []);

  const fetchMyRooms = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setMyRooms([]);
        return;
      }

      setLoadingRooms(true);
      const res = await axios.get(`${getBackendUrl()}/my-rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyRooms(res.data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      const axiosError = error as {
        response?: { status?: number };
      };

      // If unauthorized or not found, just set empty array
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 404
      ) {
        setMyRooms([]);
      }
    } finally {
      setLoadingRooms(false);
    }
  };

  const createRoom = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You are not authenticated. Please sign in.");
        return;
      }

      if (!roomName.trim()) {
        alert("Please enter a room name.");
        return;
      }

      const res = await axios.post(
        `${getBackendUrl()}/room`,
        {
          name: roomName.trim(),
          password: roomPassword.trim() || undefined,
          isPublic: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const { roomId, name } = res.data;
      alert(`Room "${name}" created successfully! Room ID: ${roomId}`);

      // Refresh my rooms list
      fetchMyRooms();

      // Clear form
      setRoomName("");
      setRoomPassword("");
      setIsPublic(true);

      router.push(`${getExileUrl()}/${roomId}`);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      alert(`Error: ${errorMessage}`);
    }
  };

  const joinRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!joinCode.trim()) {
      alert("Please enter room ID");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You are not authenticated. Please sign in.");
        return;
      }

      // Just check if room exists first
      const res = await axios.get(`${getBackendUrl()}/room/${joinCode.trim()}`);

      console.log("Room successfully joined", res.data);

      router.push(`${getExileUrl()}/${joinCode.trim()}`);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      alert(`Error: ${errorMessage}`);
    }
  };

  const deleteRoom = async (shortCode: string, roomName: string) => {
    if (!confirm(`Are you sure you want to delete room "${roomName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${getBackendUrl()}/room/${shortCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Room deleted successfully!");
      fetchMyRooms();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      alert(`Error: ${errorMessage}`);
    }
  };

  const startEditRoom = (room: Room) => {
    setEditingRoom(room.shortCode);
    setEditName(room.name);
    setEditPassword("");
    setEditIsPublic(room.isPublic);
  };

  const cancelEditRoom = () => {
    setEditingRoom(null);
    setEditName("");
    setEditPassword("");
  };

  const saveEditRoom = async (shortCode: string) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${getBackendUrl()}/room/${shortCode}`,
        {
          name: editName.trim(),
          password: editPassword.trim() || undefined,
          isPublic: editIsPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      alert("Room updated successfully!");
      setEditingRoom(null);
      fetchMyRooms();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      alert(`Error: ${errorMessage}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Room ID copied to clipboard!");
  };

  const joinMyRoom = (shortCode: string) => {
    router.push(`${getExileUrl()}/${shortCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => setErrorMessage("")}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <PenLine className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Collaborative Drawing
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create or join a room to start drawing together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create/Join Room Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Create or Join Room
            </h3>

            <div className="space-y-6">
              {/* Create Room Section */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Create New Room
                </h4>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter Room Name"
                    className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        Public (ID only)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        Private (ID + Password)
                      </span>
                    </label>
                  </div>

                  {!isPublic && (
                    <input
                      type="password"
                      value={roomPassword}
                      onChange={(e) => setRoomPassword(e.target.value)}
                      placeholder="Enter Room Password"
                      className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    />
                  )}

                  <button
                    onClick={createRoom}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Room
                  </button>
                </div>
              </div>

              {/* Join Room Section */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Join Existing Room
                </h4>

                <form onSubmit={joinRoom} className="space-y-4">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter Room ID (e.g., ABC123)"
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-center"
                  />

                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Join Room
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* My Rooms Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">My Rooms</h3>
              <button
                onClick={fetchMyRooms}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Refresh
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Please sign in to view your rooms
                </p>
                <button
                  onClick={() => router.push("/signin")}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                >
                  Sign In
                </button>
              </div>
            ) : loadingRooms ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading rooms...</p>
              </div>
            ) : myRooms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No rooms created yet</p>
                <p className="text-sm text-gray-500">
                  Create your first room to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {myRooms.map((room) => (
                  <div
                    key={room.shortCode}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {editingRoom === room.shortCode ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Room name"
                        />

                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={editIsPublic}
                              onChange={() => setEditIsPublic(true)}
                              className="mr-2"
                            />
                            <span className="text-sm">Public</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={!editIsPublic}
                              onChange={() => setEditIsPublic(false)}
                              className="mr-2"
                            />
                            <span className="text-sm">Private</span>
                          </label>
                        </div>

                        {!editIsPublic && (
                          <input
                            type="password"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="New password (leave empty to keep current)"
                          />
                        )}

                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveEditRoom(room.shortCode)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditRoom}
                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {room.name}
                              </h4>
                              {room.isPublic ? (
                                <Eye className="w-4 h-4 text-green-600" />
                              ) : (
                                <Lock className="w-4 h-4 text-orange-600" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                {room.shortCode}
                              </code>
                              <button
                                onClick={() => copyToClipboard(room.shortCode)}
                                className="text-gray-500 hover:text-gray-700"
                                title="Copy room ID"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">
                              Created{" "}
                              {new Date(room.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex space-x-1">
                            <button
                              onClick={() => joinMyRoom(room.shortCode)}
                              className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                              title="Enter room"
                            >
                              <PenLine className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startEditRoom(room)}
                              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                              title="Edit room"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                deleteRoom(room.shortCode, room.name)
                              }
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Delete room"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
