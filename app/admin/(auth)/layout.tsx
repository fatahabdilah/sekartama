import "../wp/reset.css";
import "../wp/dashicons.css";
import "../wp/buttons.css";
import "../wp/forms.css";
import "../wp/l10n.css";
import "../wp/login.css";
import "../wp/overrides.css";

// Mirrors wp-login.php: <body class="login js wp-core-ui locale-en-us">.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="wp-root login js login-action-login wp-core-ui locale-en-us">{children}</div>;
}
