import styles from "./header.module.scss"
import commonStyles from "../../styles/common.module.scss"
import Link from "next/link"

export default function Header() {
  
  return (
    <header className={styles.headerContainer}>
      <div className={commonStyles.contentWrapper}>
        <Link href="/">
          <img src="/images/Logo.svg" alt="logo" />
        </Link>

      </div>
    </header>
  )
}
