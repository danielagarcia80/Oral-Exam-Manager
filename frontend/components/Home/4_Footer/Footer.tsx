import { Flex, Text } from '@mantine/core';

const Footer: React.FC = () => {
  return (
    <footer>
      <Flex
        align="center"
        justify="center"
        style={{
          backgroundColor: '#f1f3f5',
          padding: '20px 0',
          borderTop: '1px solid #dee2e6',
        }}
      >
        <Text ta="center" size="sm" color="black">
          © 2025 Oral Exam Manager. All rights reserved.
        </Text>
      </Flex>
    </footer>
  );
};

export default Footer;
