import React, { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import styled from "styled-components";
import axios from "axios";

// Styled components for styling

const TextArea = styled.textarea`
    width: 95%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical; /* Allow vertical resizing */
`;

const Container = styled.div`
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 10px;
`;

const Input = styled.input`
    width: 95%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    display: block; /* Ensure buttons are on separate lines */
`;

const SwitchButton = styled(Button)`
    background-color: #54a4a7;
`;

const FileInput = styled.input.attrs({ type: "file" })`
    display: none;
`;

const FileLabel = styled.label`
    display: inline-block;
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    display: block; /* Ensure buttons are on separate lines */
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Th = styled.th`
    background-color: #007bff;
    color: #fff;
    padding: 10px;
    text-align: left;
`;

const Td = styled.td`
    padding: 10px;
    border-bottom: 1px solid #ccc;
`;

const FadeIn = styled.div`
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    &.fade-in {
        opacity: 1;
    }
`;

const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const SubmitForm = () => {
    const [question, setQuestion] = useState("");
    const [fieldType, setFieldType] = useState("text"); // 'text' or 'file'
    const [code1, setCode1] = useState("");
    const [code2, setCode2] = useState("");
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [randomStatement, setRandomStatement] = useState("");
    const [showResponse, setShowResponse] = useState(false);

    const statement = [
        "Oh, don't worry, our AI teacher is graciously accepting the burden of scrutinizing your assignments.",
        "It's so kind of our AI teacher to take on the role of the taskmaster and judge your assignments.",
        "Sit back and relax, our AI teacher is sacrificing its precious time to be the merciless grader of your assignments.",
        "Fear not, our AI teacher is generously offering to play the role of the discerning critic for your assignments.",
        "How lucky are you? Our AI teacher is graciously agreeing to be the strict examiner of your assignments.",
        "Ah, the benevolent AI teacher, tirelessly examining your assignments so you can focus on more important things.",
        "It's a tough job, but someone's AI teacher has to do it—luckily, it's yours!",
        "Take a break, our AI teacher is on duty, ready to be the unyielding judge of your assignments.",
    ];

    const injectRandomStatement = () => {
        const randomIndex = Math.floor(Math.random() * statement.length);
        const selectedStatement = statement[randomIndex];
        if (typeof selectedStatement === "string") {
            setRandomStatement(selectedStatement);
        } else {
            console.error(
                "Selected statement is not a string:",
                selectedStatement
            );
            // Handle the error or set a default statement
        }
    };

    const handleToggleFieldType = () => {
        setFieldType(fieldType === "text" ? "file" : "text");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            injectRandomStatement();
            setQuestion("");
            setResponse(null);
            setIsLoading(true);
            const res = await axios.post(
                "http://localhost:3001/api/two-code-plag-check",
                {
                    task: question,
                    codeA: code1,
                    codeB: code2,
                }
            );
            setIsLoading(false);
            setResponse(res.data);
            setShowResponse(true);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const toggleResponse = () => {
        setShowResponse(!showResponse);
        setResponse(null);
    };

    return (
        <div>
            {!showResponse && (
                <Container>
                    {!isLoading && (
                        <form onSubmit={handleSubmit}>
                            <Label>Question:</Label>
                            <TextArea
                                rows={4}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter the question statement"
                            />

                            <Label>
                                {fieldType === "text"
                                    ? "Paste codes here:"
                                    : "Upload Files:"}
                            </Label>
                            {fieldType === "text" ? (
                                <>
                                    <TextArea
                                        placeholder="Enter Code # 1"
                                        rows={5}
                                        onChange={(e) =>
                                            setCode1(e.target.value)
                                        }
                                    />
                                    <TextArea
                                        placeholder="Enter Code # 2"
                                        rows={5}
                                        onChange={(e) =>
                                            setCode2(e.target.value)
                                        }
                                    />
                                </>
                            ) : (
                                <>
                                    <FileLabel htmlFor="file1">
                                        Upload Code # 1
                                    </FileLabel>
                                    <FileInput id="file1" />
                                    <FileLabel htmlFor="file2">
                                        Upload Code # 2
                                    </FileLabel>
                                    <FileInput id="file2" />
                                </>
                            )}
                            <SwitchButton
                                type="button"
                                id="switchBtn"
                                onClick={handleToggleFieldType}
                            >
                                {fieldType === "text"
                                    ? "Switch to File Upload"
                                    : "Switch to Text Field"}
                            </SwitchButton>

                            <Button type="submit">Submit</Button>
                        </form>
                    )}

                    <FadeIn className={isLoading ? "fade-in" : ""}>
                        <div>
                            <MagnifyingGlass
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="magnifying-glass-loading"
                                wrapperStyle={{}}
                                wrapperClass="magnifying-glass-wrapper"
                                glassColor="#c0efff"
                                color="#e15b64"
                            />
                            <p>{randomStatement}</p>
                        </div>
                    </FadeIn>
                </Container>
            )}

            {!isLoading && showResponse && (
                <FadeIn className={response ? "fade-in" : ""}>
                    <Button onClick={toggleResponse}>{"Go back"}</Button>
                </FadeIn>
            )}

            {response && (
                <FadeIn className={response ? "fade-in" : ""}>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Aspect</Th>
                                <Th>Code # 1</Th>
                                <Th>Code # 2</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(response.code_a).map((aspect) => (
                                <tr key={aspect}>
                                    <Td>
                                        {capitalizeFirstLetter(
                                            aspect.replace(/_/g, " ")
                                        )}
                                    </Td>
                                    <Td>{response.code_a[aspect]}</Td>
                                    <Td>{response.code_b[aspect]}</Td>
                                </tr>
                            ))}
                            <tr>
                                <Th colSpan={1}>Plagiarism comment</Th>
                                <Td colSpan={2}>{response.plagiarism}</Td>
                            </tr>
                        </tbody>
                    </Table>
                </FadeIn>
            )}
        </div>
    );
};

export default SubmitForm;
