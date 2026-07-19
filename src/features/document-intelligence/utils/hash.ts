import { createHash } from "node:crypto";

export function sha256Hex(data: Buffer | Uint8Array | ArrayBuffer): string {
  const buf =
    data instanceof ArrayBuffer
      ? Buffer.from(data)
      : Buffer.isBuffer(data)
        ? data
        : Buffer.from(data);
  return createHash("sha256").update(buf).digest("hex");
}
