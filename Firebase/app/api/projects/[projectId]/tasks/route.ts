import { NextResponse } from "next/server";
import { db, admin } from "@/server/firebase";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;
    const { title, description, status } = await request.json();
    const newTask = {
      title,
      description,
      status,
      projectId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .add(newTask);
    return NextResponse.json({ id: docRef.id, ...newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;
    const snapshot = await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .get();
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error getting tasks:", error);
    return NextResponse.json({ error: "Failed to get tasks" }, { status: 500 });
  }
}
