"use client";

import { testChatConnection } from "@/app/admin/actions";
import SubmitButton from "./SubmitButton";
import WpForm from "./WpForm";

export default function TestConnectionForm() {
  return (
    <WpForm action={testChatConnection}>
      <p>Sends one test message to Gemini with the saved settings and updates the status above.</p>
      <p className="submit">
        <SubmitButton value="Test connection" className="button" spinner />
      </p>
    </WpForm>
  );
}
