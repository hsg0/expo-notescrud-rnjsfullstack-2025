// app/(tabs)/notes.jsx
// Inline edit per item: tap ✏️ to edit that row; Save/Cancel; 🗑️ to delete.

import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text, TextInput,
  View,
} from "react-native";
import {
  createNote,
  deleteNoteByTitle,
  listNotes,
  updateNoteByTitle,
} from "../../lib/api.js";

// Theme
const COLORS = {
  bg: "#FFF8DC",       // cornsilk
  card: "#ffffff",
  text: "#3b0764",
  textMuted: "#6b21a8",
  accent: "#7e22ce",
  border: "#e9d5ff",
  dangerBg: "#fde2e2",
  dangerText: "#7f1d1d",
};

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Inline edit state
  // which note is being edited + working copies of title/content
  const [editingTitleKey, setEditingTitleKey] = useState(null); // we use original title as key
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await listNotes();
      setNotes(data);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  // Create
  const onCreate = async () => {
    if (!title.trim()) return Alert.alert("Title required");
    try {
      await createNote(title, content);
      setTitle(""); setContent("");
      refresh();
    } catch (e) {
      Alert.alert("Create failed", e.message);
    }
  };

  // Start editing a row
  const startEdit = (note) => {
    setEditingTitleKey(note.title); // keep the *current/original* title as the lookup key
    setEditTitle(note.title);
    setEditContent(note.content || "");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTitleKey(null);
    setEditTitle("");
    setEditContent("");
  };

  // Save editing
  const saveEdit = async () => {
    if (!editingTitleKey) return;
    try {
      await updateNoteByTitle(editingTitleKey, editTitle, editContent);
      cancelEdit();
      refresh();
    } catch (e) {
      Alert.alert("Update failed", e.message);
    }
  };

  // Delete
  const onDelete = async (t) => {
    try {
      await deleteNoteByTitle(t);
      if (editingTitleKey === t) cancelEdit();
      refresh();
    } catch (e) {
      Alert.alert("Delete failed", e.message);
    }
  };

  const Item = ({ item }) => {
    const isEditing = editingTitleKey === item.title;

    if (isEditing) {
      // EDIT MODE UI
      return (
        <View style={styles.item}>
          <Text style={styles.itemTitle}>✏️ Editing</Text>
          <TextInput
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="New title"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
          />
          <TextInput
            value={editContent}
            onChangeText={setEditContent}
            placeholder="New content"
            placeholderTextColor={COLORS.textMuted}
            style={[styles.input, { height: 60 }]}
            multiline
          />
          <View style={styles.row}>
            <Pressable style={styles.primaryBtn} onPress={saveEdit}>
              <Text style={styles.primaryText}>💾 Save</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={cancelEdit}>
              <Text style={styles.secondaryText}>↩️ Cancel</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    // NORMAL VIEW MODE UI
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>📝 {item.title}</Text>
        {!!item.content && <Text style={styles.itemContent}>{item.content}</Text>}
        <View style={styles.row}>
          <Pressable style={[styles.iconBtn, styles.edit]} onPress={() => startEdit(item)}>
            <Text style={styles.iconTextAlt}>✏️ Edit</Text>
          </Pressable>
          <Pressable style={[styles.iconBtn, styles.delete]} onPress={() => onDelete(item.title)}>
            <Text style={styles.iconTextDanger}>🗑️ Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>📒 Notes</Text>

      {/* Create */}
      <View style={styles.card}>
        <Text style={styles.h2}>➕ Create</Text>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
        />
        <TextInput
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          placeholderTextColor={COLORS.textMuted}
          style={[styles.input, { height: 60 }]}
          multiline
        />
        <Pressable style={styles.primaryBtn} onPress={onCreate}>
          <Text style={styles.primaryText}>➕ Add Note</Text>
        </Pressable>
      </View>

      {/* Refresh */}
      <Pressable style={styles.ghostBtn} onPress={refresh}>
        <Text style={styles.ghostText}>
          {loading ? "🔄 Refreshing..." : "🔄 Refresh"}
        </Text>
      </Pressable>

      {/* List */}
      <FlatList
        style={{ marginTop: 12 }}
        data={notes}
        keyExtractor={(n) => n._id || n.id || n.title}
        renderItem={({ item }) => <Item item={item} />}
        ListEmptyComponent={
          <Text style={{ color: COLORS.textMuted, marginTop: 8 }}>No notes yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bg },
  h1: { fontSize: 24, fontWeight: "800", color: COLORS.text, marginBottom: 10 },
  h2: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 8 },
  card: {
    backgroundColor: COLORS.card, padding: 12, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 12
  },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 10,
    padding: 10, color: COLORS.text, backgroundColor: "#fff", marginBottom: 8
  },
  primaryBtn: {
    backgroundColor: COLORS.accent, padding: 12, borderRadius: 12, alignItems: "center", marginRight: 8
  },
  primaryText: { color: "white", fontWeight: "700" },
  secondaryBtn: {
    borderWidth: 2, borderColor: COLORS.accent, padding: 10, borderRadius: 12, alignItems: "center"
  },
  secondaryText: { color: COLORS.accent, fontWeight: "700" },
  ghostBtn: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 10 },
  ghostText: { color: COLORS.textMuted, fontWeight: "600" },

  item: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 10
  },
  row: { flexDirection: "row", gap: 8, marginTop: 8 },
  itemTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  itemContent: { marginTop: 4, color: COLORS.textMuted },

  iconBtn: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10,
    alignItems: "center", justifyContent: "center"
  },
  edit: { backgroundColor: "#ede9fe" },     // purple-ish
  delete: { backgroundColor: COLORS.dangerBg },

  iconTextAlt: { color: COLORS.textMuted, fontWeight: "700" },
  iconTextDanger: { color: COLORS.dangerText, fontWeight: "700" },
});