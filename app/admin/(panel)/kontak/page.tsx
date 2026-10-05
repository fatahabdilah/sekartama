import type { Metadata } from "next";
import SubmitButton from "@/components/admin/wp/SubmitButton";
import WpForm from "@/components/admin/wp/WpForm";
import { requireAdmin } from "@/lib/admin";
import { defaultContactSettings, type ContactSettings } from "@/lib/site";
import { saveContact } from "../../actions";

export const metadata: Metadata = { title: "Contact Settings" };

export default async function AdminContactPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("value").eq("key", "contact").maybeSingle();
  const contact: ContactSettings = { ...defaultContactSettings, ...(data?.value as Partial<ContactSettings>) };

  return (
    <div className="wrap">
      <h1>Contact Settings</h1>
      <WpForm action={saveContact} settings>
        <p>Used in the footer, on the Hubungi Kami page, on every WhatsApp button, and in the chat assistant&#8217;s answers.</p>
        <table className="form-table" role="presentation">
          <tbody>
            <tr>
              <th scope="row">
                <label htmlFor="whatsapp">WhatsApp number</label>
              </th>
              <td>
                <input name="whatsapp" type="text" id="whatsapp" defaultValue={contact.whatsapp} className="regular-text code" required aria-describedby="whatsapp-description" />
                <p className="description" id="whatsapp-description">
                  International format without + or spaces, for example <code>6285156065079</code>.
                </p>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="phone">Phone (as displayed)</label>
              </th>
              <td>
                <input name="phone" type="text" id="phone" defaultValue={contact.phone} className="regular-text" required />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="email">Email Address</label>
              </th>
              <td>
                <input name="email" type="email" id="email" defaultValue={contact.email} className="regular-text ltr" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="instagram">Instagram</label>
              </th>
              <td>
                <input name="instagram" type="text" id="instagram" defaultValue={contact.instagram} className="regular-text" aria-describedby="instagram-description" />
                <p className="description" id="instagram-description">
                  Username without the @.
                </p>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <label htmlFor="address">Address</label>
              </th>
              <td>
                <textarea name="address" id="address" rows={3} cols={50} className="large-text" defaultValue={contact.address} aria-describedby="address-description" />
                <p className="description" id="address-description">
                  The map on the Hubungi Kami page searches for this address.
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
