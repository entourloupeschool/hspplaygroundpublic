import styles from './layout.module.css';
import homestyles from '../../styles/Home.module.css';
import Image from 'next/image';
import { Link } from '@chakra-ui/react';

export default function Footer() {
    const bmcSize = 48;
    return (
        <footer className={styles.upperFooterDisplay}>
            <div className={styles.footerDisplay}>
                <div>
                    <Link
                        p={1}
                        href='/'
                        fontSize={'m'}
                        fontWeight={500}
                        className={styles.linkLayout}>
                        {'© Hot Sand Playas'}
                    </Link>
                </div>
                <div className={homestyles.setInfoContainer}>
                    <div className={homestyles.smallEtiquette}>
                        <p>
                            <a className={homestyles.externalLink} href="https://github.com/">Source Code</a>
                        </p>
                    </div>
                    <div style={{borderRadius: '0.5rem', overflow: 'hidden', marginTop: '0.3rem'}}>
                        <a href='https://www.buymeacoffee.com/theodwk'>
                            <Image src='/bmc.png' width={4*bmcSize} height={bmcSize} alt='buy me a coffee'/>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    )
;}