import AdminBarLoader from "@/components/admin-bar/AdminBarLoader";
import ChatWidget from "@/components/chat/ChatWidget";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getChatConfig, getContact, getProductCategories } from "@/lib/data";
import { buildNavItems } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [contact, chat, categories] = await Promise.all([getContact(), getChatConfig(), getProductCategories()]);
  const navItems = buildNavItems(categories);
  return (
    <>
      <AdminBarLoader />
      <Header navItems={navItems} />
      <main>{children}</main>
      <Footer contact={contact} navItems={navItems} />
      {chat.enabled && (
        <ChatWidget botName={chat.botName} greeting={chat.greeting} placeholder={chat.placeholder} phone={contact.phone} />
      )}
    </>
  );
}
