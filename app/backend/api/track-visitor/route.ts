import { NextResponse } from "next/server";

import { getVisitor, updateVisitor } from "../../action/action";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-internal-secret");
    console.info("tracker got called");
    if (secret !== process.env.INTERNAL_SECRET) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 👉 DB update here
    await updateVisitor();

    return NextResponse.json({ status: 201 });
  } catch (e) {
    console.log(e?.message);
    return NextResponse.json({
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    // 👉 DB update here
    let count = await getVisitor();
    return NextResponse.json({ data: { count } }, { status: 200 });
  } catch (e) {
    console.log(e?.message);
    return NextResponse.json({
      status: 500,
    });
  }
}
