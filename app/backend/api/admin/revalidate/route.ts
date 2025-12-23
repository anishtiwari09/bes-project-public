import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-internal-secret");
    const { path } = await req.json();

    // simple protection
    if (secret !== process.env.INTERNAL_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // revalidate homepage
    revalidatePath(path || "/");

    return NextResponse.json({
      revalidated: true,
      path: path || "/",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
