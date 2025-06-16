import { NextResponse } from "next/server";
import { db, admin } from "@/server/firebase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; taskId: string }> },
) {
  try {
    const { projectId, taskId } = await params;
    const doc = await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId)
      .get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error getting task:", error);
    return NextResponse.json({ error: "Failed to get task" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string; taskId: string }> },
) {
  try {
    const { projectId, taskId } = await params;
    const { title, description, status } = await request.json();
    const taskRef = db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId);
    await taskRef.update({
      title,
      description,
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string; taskId: string }> },
) {
  try {
    const { projectId, taskId } = await params;
    await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId)
      .delete();
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
