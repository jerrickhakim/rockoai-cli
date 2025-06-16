import { NextResponse } from "next/server";
import { db, admin } from "@/server/firebase";

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();
    const newProject = {
      name,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ownerId: "user_123", // Replace with actual user ID
      members: ["user_123"], // Replace with actual user ID
    };
    const docRef = await db.collection("projects").add(newProject);
    return NextResponse.json({ id: docRef.id, ...newProject }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const snapshot = await db.collection("projects").get();
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error getting projects:", error);
    return NextResponse.json(
      { error: "Failed to get projects" },
      { status: 500 },
    );
  }
}
