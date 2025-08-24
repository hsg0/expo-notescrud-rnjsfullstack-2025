// lib/api.js
// Simple, readable API client for your app.

import axios from "axios";
import * as Device from "expo-device";
import { Platform } from "react-native";

/**
 * EDIT THESE WHEN NEEDED
 */
const LAN_IP          // your computer's Wi-Fi IP for real devices
const PORT = 3003;                       // backend port
const PROD_URL =  // your production API (change later)

/**
 * Choose the right base URL for development:
 * - iOS Simulator → localhost
 * - Android Emulator → 10.0.2.2 (special host alias)
 * - Physical devices (iOS/Android) → your LAN IP
 */
function getDevBaseUrl() {
  const isSimOrEmu = !Device.isDevice;

  if (Platform.OS === "ios" && isSimOrEmu) {
    return `http://localhost:${PORT}`;
  }
  if (Platform.OS === "android" && isSimOrEmu) {
    return `http://10.0.2.2:${PORT}`;
  }
  // Physical phone/tablet on same Wi-Fi as your computer
  return `http://${LAN_IP}:${PORT}`;
}

/** Final base URL (dev vs prod) */
export const API_BASE = __DEV__ ? getDevBaseUrl() : PROD_URL;

/** One axios instance for the whole app */
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // safe to keep; useful later if you use cookies/JWT
});

/**
 * Tiny helpers your screens can call.
 * They all return the response JSON.
 */
export const listNotes = () =>
  api.get("/api/notes").then((r) => r.data);

export const createNote = (title, content) =>
  api.post("/api/notes", { title, content }).then((r) => r.data);

export const updateNoteByTitle = (title, newTitle, newContent) =>
  api
    .put(`/api/notes/${encodeURIComponent(title)}`, { newTitle, newContent })
    .then((r) => r.data);

export const deleteNoteByTitle = (title) =>
  api.delete(`/api/notes/${encodeURIComponent(title)}`).then((r) => r.data);