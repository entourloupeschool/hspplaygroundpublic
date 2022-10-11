import Navbar from './navbar'
import Footer from './footer'
import styles from '../../styles/Home.module.css';

export default function Layout({ children, themehandler }: any): JSX.Element {
  return (
    <>
      <Navbar themehandler={themehandler}/>

          <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}