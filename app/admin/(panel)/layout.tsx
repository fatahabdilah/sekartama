import "../wp/reset.css";
import "../wp/dashicons.css";
import "../wp/admin-bar.css";
import "../wp/common.css";
import "../wp/forms.css";
import "../wp/admin-menu.css";
import "../wp/dashboard.css";
import "../wp/list-tables.css";
import "../wp/edit.css";
import "../wp/l10n.css";
import "../wp/buttons.css";
import "../wp/skin.css";
import "../wp/editor.css";
import "../wp/overrides.css";
import AdminShell from "@/components/admin/wp/AdminShell";
import { requireAdmin } from "@/lib/admin";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return <AdminShell displayName={user.email?.split("@")[0] ?? "admin"}>{children}</AdminShell>;
}
