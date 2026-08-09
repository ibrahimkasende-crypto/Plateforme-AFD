import fs from "node:fs";

function check(file) {
  if (!fs.existsSync(file)) {
    console.log(`${file}: missing`);
    return;
  }
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^SUPABASE_SERVICE_ROLE_KEY=(.*)$/m);
  if (!match) {
    console.log(`${file}: KEY_ABSENT`);
    return;
  }
  const value = match[1].trim().replace(/^["']|["']$/g, "");
  const placeholder =
    value.length < 20 ||
    /^(your-|changeme|xxx|placeholder|ta_vraie)/i.test(value);
  console.log(
    `${file}: present=${value.length > 0} len=${value.length} placeholder=${placeholder}`,
  );
}

check(".env.local");
check(".env.production");
check(".env");
