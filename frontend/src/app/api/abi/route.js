import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const url = new URL(req.url)
  const abiUrl = url.searchParams.get("abiUrl")
  const response = await axios.get(abiUrl);

  return NextResponse.json({ data: response.data });
}