import { Button, Text, Paper, Flex, ScrollArea, Code } from "@mantine/core";
import { useEffect, useRef, useState } from 'react';
import { useExam } from "../ExamDataProvider";
import { useMemo } from "react";
import VideoUploadButton from "./VideoSubmission/VideoUploadButton";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import CodeBlock from "./CodeBlock";
import QuestionBlock from "./QuestionBlock";



export default function TakingExam() {

        return (
                <>
                <CodeBlock code=""/>
                <QuestionBlock/>
                </>
        );
}
