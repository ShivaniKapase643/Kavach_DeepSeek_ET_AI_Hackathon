import { config } from "dotenv";
import path from "path";
import fs from "fs";

config({ path: path.resolve(process.cwd(), ".env") });

import { synthesizeSpeech, WARNING_VOICE_ID } from "../lib/elevenlabs";

// ~90 seconds, code-mixed Hindi-English. ~12s of innocuous identity-confirmation opening
// before Stage 1 (impersonation) begins, then all five digital-arrest stages in order:
// impersonation -> accusation -> isolation -> fear/pressure -> extraction.
const DEMO_SCRIPT = `
Hello? Hello sir, awaaz aa rahi hai? Good afternoon sir, main aapka thoda sa time loonga, sirf do minute ka kaam hai. Sir pehle aap confirm kar dijiye, aapka naam Rajesh Kumar hai aur yeh aapka registered mobile number hai na? Theek hai sir, thank you, isse hume aapki details verify karne mein madad milegi.

Sir, main aapko inform karna chahta hoon ki main Central Bureau of Investigation, C B I, Mumbai Cyber Crime Branch se baat kar raha hoon. Mera naam Inspector Verma hai, badge number four four seven one.

Sir, aapke Aadhaar card se ek parcel link hua hai jo Mumbai international courier hub par intercept kiya gaya hai. Us parcel mein paanch kilogram illegal drugs aur fake passports paaye gaye hain, aur yeh parcel ek foreign destination ke liye tha, jismein money laundering ka bhi serious case bana hai sir.

Sir, yeh ek highly confidential national security matter hai. Aap is call ko disconnect nahi kar sakte, aur na hi apne family members ya kisi aur ko is baare mein bata sakte hain. Aapko hamare saath continuously is video call par bane rehna hoga jab tak yeh verification complete nahi ho jaati, samjhe aap?

Agar aap cooperate nahi karte hain, toh humein aapko turant arrest karna padega under non-bailable sections of the Money Laundering Act. Maine already ek digital arrest warrant issue kar diya hai aapke naam par. Aapke paas sirf do ghante hain sir, warna hum local police ko bhej denge aapke ghar par abhi.

Sir, is matter ko turant clear karne ke liye aapko apni saari bank details ka verification karna hoga. Aapko abhi apne account se paise R B I ke ek safe verification account mein transfer karne honge. Please apna debit card number aur O T P mujhe turant bataiye taaki hum yeh verification process complete kar sakein, warna arrest ho jayega.
`.trim();

async function main() {
  console.log("=== KAVACH DEMO CALL GENERATOR ===\n");
  console.log("--- Script ---\n");
  console.log(DEMO_SCRIPT);
  console.log("\n--- End script ---\n");

  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("ELEVENLABS_API_KEY missing from .env");
    process.exit(1);
  }

  console.log(`Synthesizing with voice ${WARNING_VOICE_ID} (Adam — authoritative male)...`);
  const audio = await synthesizeSpeech(DEMO_SCRIPT, WARNING_VOICE_ID);

  const outDir = path.resolve(process.cwd(), "public", "demo");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "scam-call.mp3");
  fs.writeFileSync(outPath, Buffer.from(audio));

  console.log(`\nWrote ${(audio.byteLength / 1024).toFixed(1)} KB to ${outPath}`);
  console.log("=== DONE ===");
}

main().catch((err) => {
  console.error("generate-demo-call FAILED:", err);
  process.exit(1);
});
