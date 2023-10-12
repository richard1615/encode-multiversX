import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {

  let response = await axios.get("https://github.com/multiversx/mx-sdk-js-core/raw/main/src/testdata/counter.wasm", {
    responseType: "arraybuffer",
    transformResponse: [],
    headers: {
      "Accept": "application/wasm",
    }
  });
  console.log(response.data);

  // buffer = Buffer.from(response.data);
  return NextResponse.json({ buffer: response.data });
}