import Image from "next/image";
import styles from "./IconBadge.module.css";

export default function IconBadge({ icon }: { icon: string }) {
  return (
    <span className={styles.badge}>
      <Image src={icon} alt="" width={30} height={30} />
    </span>
  );
}
