import { useState, useEffect } from 'react';
import { FileButton, Button, Group, Text } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

interface Props {
  setCodeFile: (content: string) => void;
}

export default function FileUploadButton({ setCodeFile }: Props) {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setCodeFile(event.target.result.toString());
        } else {
          console.error("Failed to read file");
        }
      };
      reader.readAsText(file); 
    }
  }, [file, setCodeFile]); 
  return (
    <>
    <Group justify="center" style={{ marginTop: "20px" }}>
      <FileButton  onChange={setFile}>
        {(props) => <Button {...props} size="md" color={"red"} leftSection={<IconUpload/>}>Upload Code Here</Button>}
      </FileButton>
    </Group>
    {file && (
      <Text size="sm" ta="center" mt="sm">
        Picked file: {file.name}
      </Text>
    )}
    </>
  );
}
