import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Playground website</title>
        <meta name="description" content="Home of the playground" />
      </Head>

        <div className={styles.setInfoContainer}>
          <h1> 
            <p className={styles.HSPtextDeco}>Hot Sand Playas</p>
            <p style={{fontSize: '2.2rem'}}>a <a className={styles.externalLink} href="https://nextjs.org">Next.js!</a> playground</p>
          </h1>
          <div className={styles.blocInfo}>
            <p className={styles.description}>
              This website is a playground for me to practice and develop my skills in web development.
              It is also intended to show my work to potential employers.
              I have used the following tools:
            </p>
            <ul className={styles.descriptionlist}>
              <li>
                <span key="nextjs" className={styles.description}>
                  (Allmost) fully <a className={styles.externalLink} href='https://www.typescriptlang.org/'>Typescript</a>
                </span>
              </li>
              <li>
                <span key="opl" className={styles.description}>
                  <a className={styles.externalLink} href='https://leafletjs.com/'>Leaflet</a> for map displaying purposes
                  And more precisely the <a className={styles.externalLink} href='https://react-leaflet.js.org/'>react</a>  adaptation of it
                </span>
              </li>
              <li>
                <span key="prm" className={styles.description}>
                  <a className={styles.externalLink} href='https://www.prisma.io/'>Prisma</a> for database features
                </span>
              </li>
              <li>
                <span key="p5" className={styles.description}>
                  <a className={styles.externalLink} href='https://p5js.org/'>p5.js</a> for sketch features
                </span>
              </li>
              <li>
                <span key="wkjs" className={styles.description}>
                  <a className={styles.externalLink} href='https://www.npmjs.com/package/wikijs'>Wikijs</a> for its wikipedia scrapping service
                </span>
              </li>
              <li>
                <span key="chakra" className={styles.description}>
                  <a className={styles.externalLink} href='https://chakra-ui.com/'>Chakra ui</a> for some of this website display style
                </span>
              </li>
            </ul>
            <p className={styles.description}>
              The full list of dependancies can be obtained from the git hub repository of this website.
            </p>
          </div>
          <div className={styles.blocInfo}>
            <p className={styles.description}>
              More pages are to come, including an interactive lesson on <a className={styles.externalLink} href='https://en.wikipedia.org/wiki/Queueing_theory'>queing theory</a>
              , and a page to play <a className={styles.externalLink} href='https://www.yanstarstudio.com/'>the undercover</a> game.
            </p>
            <p className={styles.description}>
              Specific font <a className={styles.externalLink} href='https://fonts.google.com/specimen/Rubik+Maze'>Rubik Maze</a> by NaN and <a className={styles.externalLink} href='https://fonts.google.com/?query=Luke+Prowse'>Luke Prowse</a>
            </p>
          </div>

        </div>

    </div>
  )
};

export default Home;
