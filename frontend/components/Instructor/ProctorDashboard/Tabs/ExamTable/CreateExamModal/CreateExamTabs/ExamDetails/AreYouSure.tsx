import { Button, Center, Flex } from "@mantine/core";
import { IconArrowBackUp, IconTrash } from "@tabler/icons-react";
import React from "react";

// ____________________________________________________________________________________________________________

interface ModalContentProps {
        closeModal: () => void;
        closeMessageModal: () => void;  // Prop type declaration for the onClose function
}

// ____________________________________________________________________________________________________________

const AreYouSure: React.FC<ModalContentProps> = ({ closeModal, closeMessageModal }) => {
        return (
                <>
                        <Center> Are you sure you want to cancel? </Center>
                        <Center> Your changes won't be saved </Center>
                        <Flex  >
                                <Button
                                        color="red"
                                        // variant="default" 
                                        type="button"
                                        onClick={closeModal}
                                        leftSection={<IconTrash />}
                                        style={{ margin: "5%" }}
                                >
                                        Cancel
                                </Button>
                                <Button
                                        color="green"
                                        // variant="default" 
                                        type="submit"
                                        onClick={closeMessageModal}
                                        leftSection={<IconArrowBackUp />}
                                        style={{ margin: "5%" }}
                                >
                                        Continue Creating Exam
                                </Button>
                        </Flex>
                </>
        );
}

export default AreYouSure