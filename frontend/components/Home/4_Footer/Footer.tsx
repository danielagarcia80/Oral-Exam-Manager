import { Flex, Text } from '@mantine/core';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Flex align="center" justify="center">
        <Text ta="center">© 2024 Code Oriented Oral Exam Manager. All rights reserved.</Text>
      </Flex>
    </footer>
  );
};

export default Footer;
