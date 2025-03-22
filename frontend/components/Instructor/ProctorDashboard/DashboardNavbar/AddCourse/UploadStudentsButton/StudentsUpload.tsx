import { useState } from 'react';
import { FileButton, Button, Group, Text } from '@mantine/core';

// -----------------------------------------------------------------------------------------------------------

interface StudentsRow {
  fullName: string,
  // sortableName: string,
  email: string
}

interface ModalContentProps {
  setStudents: (students: StudentsRow[]) => void;
}

// -----------------------------------------------------------------------------------------------------------

const StudentsUpload: React.FC<ModalContentProps> = ({ setStudents }) => {
  const [file, setFile] = useState<File | null>(null);
  const [students, setStudentsVar] = useState<StudentsRow[]>([]);
  
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result as string;
        let lines = csvData.split('\n');

  
        // If there's a specific condition to remove the last student (like a footer or summary)
        // you might need additional logic here
  
        const parsedStudents = lines.slice(1).map(line => { // Assuming the first line is headers
          const columns = line.split(',');

          return {
            fullName: columns[0],
            email: columns[columns.length-2] // Assuming email is second last column
          };
        });
  
        setStudentsVar(parsedStudents);
        setStudents(parsedStudents);
      };
  
      reader.readAsText(selectedFile);
      setFile(selectedFile);
    }
  };
  
  

  return (
    <>
      <Group justify="center" style={{marginTop: "2%"}}>
        <FileButton onChange={handleFileChange} accept=".csv">
          {(props) => <Button {...props}>Upload Students CSV</Button>}
        </FileButton>
      </Group>
      {file && (
        <Text size="sm" ta="center" mt="sm">
          Picked file: {file.name}
        </Text>
      )}
      {students.length > 0 && (
        <Text size="sm" ta="center" mt="sm">
          Loaded {students.length} student records
        </Text>
      )}
    </>
  );
}
export default StudentsUpload;