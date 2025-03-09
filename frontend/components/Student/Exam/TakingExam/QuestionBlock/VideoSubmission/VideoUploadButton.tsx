import { useState, useEffect } from 'react';
import { FileButton, Button, Group, Text, Modal, Center } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import LoaderComponent from './Loader/Loader';

export default function VideoUploadButton() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5); // State for countdown
  const router = useRouter(); // Use useRouter for redirection

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>; // Timer for countdown
    if (uploadSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      router.push('./'); // Redirect to home page
    }
    return () => clearTimeout(timer);
  }, [uploadSuccess, countdown]);

  const handleFileUpload = (file: File) => {
    const formData = new FormData();
    formData.append('video', file); // 'video' is the key expected on the server side
    setLoading(true);
    setModalOpened(true);
    fetch('http://localhost:3001/upload-video', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      setLoading(false);
      if (response.ok) {
        console.log("Upload successful");
        setUploadSuccess(true);
      } else {
        console.error("Upload failed");
        setUploadSuccess(false);
      }
    })
    .catch(error => {
      setLoading(false);
      console.error("Error uploading file:", error);
      setUploadSuccess(false);
    });
  };

  return (
    <>
      <Group justify="center" style={{ paddingLeft: "20px" }}>
        <FileButton onChange={(file) => {
          setFile(file);
          if (file) handleFileUpload(file);
        }}>
          {(props) => <Button {...props} color={"green"} rightSection={<IconUpload/>}>Upload Video</Button>}
        </FileButton>
      </Group>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
        size="xl"
      >
        <Center style={{ height: '600px' }}>
          {loading ? (
            <>
            <Text style={{fontSize: "25px"}} size="xl">Uploading your submission, please wait...</Text>
            <LoaderComponent/>
            </>
          ) : uploadSuccess ? (
            <>
            <div>
              <Text ta="center" size="xl">Upload Complete. Thank you for taking the oral exam!</Text>
              <Text ta="center" size="md">Redirecting in: {countdown} seconds</Text>
              </div>
            </>
          ) : (
            <Text ta="center" size="xl">Upload Failed. Please try again.</Text>
          )}
        </Center>
      </Modal>
    </>
  );
}
