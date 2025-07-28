"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getBackendUrl } from "@/config";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";

interface RoomValidatorProps {
  roomId: string;
  children: React.ReactNode;
}

interface ValidationState {
  loading: boolean;
  error: string | null;
  roomInfo: {
    name: string;
    isPublic: boolean;
  } | null;
  needsPassword: boolean;
}

export function RoomValidator({ roomId, children }: RoomValidatorProps) {
  const router = useRouter();
  const [state, setState] = useState<ValidationState>({
    loading: true,
    error: null,
    roomInfo: null,
    needsPassword: false,
  });
  const [password, setPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const validateRoomAccess = useCallback(async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("authToken");
      if (!token) {
        setState({
          loading: false,
          error: "You must be signed in to access rooms.",
          roomInfo: null,
          needsPassword: false,
        });
        return;
      }

      // Check if room exists and get basic info
      const roomRes = await axios.get(`${getBackendUrl()}/room/${roomId}`);
      const roomInfo = roomRes.data;

      setState({
        loading: false,
        error: null,
        roomInfo: {
          name: roomInfo.name,
          isPublic: roomInfo.isPublic,
        },
        needsPassword: !roomInfo.isPublic,
      });

      // If it's a public room, we can proceed directly
      if (roomInfo.isPublic) {
        // For public rooms, we still validate by trying to join without password
        await validateJoinAccess("");
      }
    } catch (error: unknown) {
      console.error("Room validation error:", error);
      const axiosError = error as { response?: { status?: number } };

      let errorMessage = "Failed to access room. Please try again.";
      if (axiosError.response?.status === 404) {
        errorMessage = "Room not found. Please check the room ID.";
      }

      setState({
        loading: false,
        error: errorMessage,
        roomInfo: null,
        needsPassword: false,
      });
    }
  }, [roomId]);

  const validateJoinAccess = async (roomPassword: string) => {
    try {
      const token = localStorage.getItem("authToken");

      const joinData: { shortCode: string; password?: string } = {
        shortCode: roomId,
      };

      // Only include password for private rooms
      if (!state.roomInfo?.isPublic && roomPassword) {
        joinData.password = roomPassword;
      }

      await axios.post(`${getBackendUrl()}/room/join`, joinData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If we reach here, access is granted
      setState((prev) => ({
        ...prev,
        needsPassword: false,
        error: null,
      }));
    } catch (error: unknown) {
      console.error("Join validation error:", error);
      const axiosError = error as { response?: { status?: number } };

      if (axiosError.response?.status === 401) {
        setState((prev) => ({
          ...prev,
          error: "Invalid password. Please try again.",
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: "Failed to join room. Please try again.",
        }));
      }
    }
  };

  useEffect(() => {
    validateRoomAccess();
  }, [validateRoomAccess]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setState((prev) => ({
        ...prev,
        error: "Please enter the room password.",
      }));
      return;
    }

    setPasswordLoading(true);
    setState((prev) => ({ ...prev, error: null }));

    await validateJoinAccess(password.trim());
    setPasswordLoading(false);
  };

  const redirectWithError = (message: string) => {
    // Store error message in sessionStorage to show on room page
    sessionStorage.setItem("roomError", message);
    router.push("/room");
  };

  const goBack = () => {
    router.push("/room");
  };

  // Error state
  if (state.error && !state.needsPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">{state.error}</p>
          <button
            onClick={goBack}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Validating room access...</p>
        </div>
      </div>
    );
  }

  // Password required state
  if (state.needsPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Private Room</h2>
            <p className="mt-2 text-sm text-gray-600">
              This room requires a password to enter
            </p>
            {state.roomInfo && (
              <p className="mt-1 text-sm text-gray-800 font-medium">
                Room: {state.roomInfo.name}
              </p>
            )}
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Room Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
                className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {state.error && (
              <div className="text-red-600 text-sm text-center">
                {state.error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Enter Room"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // If validation passed, render the children (canvas)
  return <>{children}</>;
}
