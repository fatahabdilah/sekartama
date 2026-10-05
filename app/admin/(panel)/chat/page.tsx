import type { Metadata } from "next";
import SubmitButton from "@/components/admin/wp/SubmitButton";
import WpForm from "@/components/admin/wp/WpForm";
import { requireAdmin } from "@/lib/admin";
import { defaultChatConfig, type ChatConfig } from "@/lib/assistant";
import { DEFAULT_GEMINI_MODEL, listGeminiModels } from "@/lib/gemini-models";
import { GEMINI_KEY, getGeminiApiKey } from "@/lib/secrets";
import { isServiceConfigured } from "@/lib/supabase/service";
import { saveChat } from "../../actions";

export const metadata: Metadata = { title: "Chat AI Settings" };

export default async function AdminChatPage() {
  const { supabase } = await requireAdmin();
  const [{ data }, { data: secrets }] = await Promise.all([
    supabase.from("settings").select("value").eq("key", "chat").maybeSingle(),
    supabase.rpc("secret_status"),
  ]);
  const chat: ChatConfig = { ...defaultChatConfig, ...(data?.value as Partial<ChatConfig>) };
  const savedKey = (secrets as { key: string; last4: string }[] | null)?.find((s) => s.key === GEMINI_KEY);
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY);
  const models = await listGeminiModels(await getGeminiApiKey());
  const defaultModel = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  // Keep a previously saved model selectable even if the API no longer lists it.
  if (chat.model && !models.some((m) => m.id === chat.model)) models.unshift({ id: chat.model, name: chat.model });

  return (
    <div className="wrap">
      <h1>Chat AI Settings</h1>

      {!isServiceConfigured && (
        <div className="notice notice-warning">
          <p>
            <strong>SUPABASE_SECRET_KEY</strong> is not set on the server, so the chat can&#8217;t read an API key saved
            here.{hasEnvKey && " Until then it uses GEMINI_API_KEY from the environment."}
          </p>
        </div>
      )}
      {!savedKey && !hasEnvKey && (
        <div className="notice notice-warning">
          <p>No Gemini API key is set, so the chat only shows a message pointing visitors to WhatsApp.</p>
        </div>
      )}

      <WpForm action={saveChat} settings>
        <p>The product list, projects, and contact details are added to the assistant automatically from the site data.</p>
        <table className="form-table" role="presentation">
          <tbody>
            <tr>
              <th scope="row">Chat widget</th>
              <td>
                <fieldset>
                  <legend className="screen-reader-text">
                    <span>Chat widget</span>
                  </legend>
                  <label htmlFor="enabled">
                    <input name="enabled" type="checkbox" id="enabled" defaultChecked={chat.enabled} /> Show the chat widget on the site
                  </label>
                </fieldset>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="gemini_api_key">Gemini API key</label>
              </th>
              <td>
                <input
                  name="gemini_api_key"
                  type="password"
                  id="gemini_api_key"
                  autoComplete="off"
                  className="regular-text code"
                  placeholder={savedKey ? `Saved (…${savedKey.last4})` : "AIza…"}
                  aria-describedby="gemini-description"
                />
                <p className="description" id="gemini-description">
                  Create one at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">aistudio.google.com/apikey</a>.
                  The key is stored separately and is never shown again. Leave blank to keep the saved key.
                </p>
                {savedKey && (
                  <p>
                    <label htmlFor="remove_gemini_key">
                      <input name="remove_gemini_key" type="checkbox" id="remove_gemini_key" /> Remove the saved API key
                    </label>
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="greeting">Greeting</label>
              </th>
              <td>
                <textarea name="greeting" id="greeting" rows={3} cols={50} className="large-text" defaultValue={chat.greeting} required />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="companyInfo">Company information</label>
              </th>
              <td>
                <textarea name="companyInfo" id="companyInfo" rows={12} cols={50} className="large-text code" defaultValue={chat.companyInfo} aria-describedby="company-description" />
                <p className="description" id="company-description">
                  What the assistant may say about the company and its services.
                </p>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="rules">Answering rules</label>
              </th>
              <td>
                <textarea name="rules" id="rules" rows={10} cols={50} className="large-text code" defaultValue={chat.rules} aria-describedby="rules-description" />
                <p className="description" id="rules-description">
                  Write <code>{"{phone}"}</code> to insert the WhatsApp number from Contact Settings.
                </p>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="model">Gemini model</label>
              </th>
              <td>
                <select name="model" id="model" defaultValue={chat.model} aria-describedby="model-description">
                  <option value="">Default ({defaultModel})</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.id})
                    </option>
                  ))}
                </select>
                <p className="description" id="model-description">
                  Models available to your API key. Flash is fast and cheap; Pro answers more carefully but slower.
                </p>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="temperature">Temperature</label>
              </th>
              <td>
                <input name="temperature" type="number" id="temperature" min={0} max={2} step={0.1} defaultValue={chat.temperature} className="small-text" aria-describedby="temperature-description" />
                <p className="description" id="temperature-description">
                  Lower values give more consistent answers; higher values give more varied ones.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="submit">
          <SubmitButton value="Save Changes" id="submit" />
        </p>
      </WpForm>
    </div>
  );
}
