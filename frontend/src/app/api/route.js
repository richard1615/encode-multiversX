import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const url = new URL(req.url)
  const wasmUrl = url.searchParams.get("wasmUrl")
  const response = await axios.get(wasmUrl, {
    responseType: "arraybuffer",
    transformResponse: [],
    headers: {
      "Accept": "application/wasm",
    }
  });

  return NextResponse.json({ buffer: response.data });
}