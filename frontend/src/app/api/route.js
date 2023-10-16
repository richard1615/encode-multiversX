import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  
  const response = await axios.get("https://github.com/multiversx/mx-sdk-js-core/raw/main/src/testdata/counter.wasm", {
    responseType: "arraybuffer",
    transformResponse: [],
    headers: {
      "Accept": "application/wasm",
    }
  });

  return NextResponse.json({ buffer: response.data });
}