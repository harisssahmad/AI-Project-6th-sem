import React, { useEffect, useState, useRef } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
    TextArea,
    Container,
    Label,
    SwitchButton,
    FileInput,
    FileLabel,
    SuccessFileLabel,
    FadeIn,
} from "./StyledComponents.js";
import axios from "axios";

const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const SubmitForm = () => {
    const [question, setQuestion] = useState("");
    const [fieldType, setFieldType] = useState("text"); // 'text' or 'file'
    const [code1, setCode1] = useState("");
    const [code2, setCode2] = useState("");
    const fileInput1Ref = useRef(null);
    const fileInput2Ref = useRef(null);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [randomStatement, setRandomStatement] = useState("");
    const [showResponse, setShowResponse] = useState(false);
    const [err, setErr] = useState(false);

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

    useEffect(() => {
        const loader = document.querySelector(".loader");
        if (isLoading && loader) {
            loader.style.display = "block";
        }

        if (response === null && loader && !isLoading) {
            loader.style.display = "none";
        }
    }, [isLoading, response]);

    useEffect(() => {
        let timeoutId;
        if (err) {
            timeoutId = setTimeout(() => {
                setErr(false);
            }, 5000);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [err]);

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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const fileContents = await readFileAsync(file);
        const fileId = e.target.id;

        if (fileId === "file1") {
            setCode1(fileContents);
        } else if (fileId === "file2") {
            setCode2(fileContents);
        }
    };

    const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question || !code1 || !code2) {
            setErr(true);
        } else {
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
        }
    };

    const toggleResponse = () => {
        setShowResponse(!showResponse);
        setResponse(null);
        setCode1(null);
        setCode2(null);
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
                                        value={code1}
                                        onChange={(e) =>
                                            setCode1(e.target.value)
                                        }
                                    />
                                    <TextArea
                                        placeholder="Enter Code # 2"
                                        rows={5}
                                        value={code2}
                                        onChange={(e) =>
                                            setCode2(e.target.value)
                                        }
                                    />
                                </>
                            ) : (
                                <>
                                    {code1 ? (
                                        <>
                                            <TextArea
                                                rows={4}
                                                value={code1}
                                                onChange={(e) =>
                                                    setCode1(e.target.value)
                                                }
                                            />
                                            <SuccessFileLabel htmlFor="file1">
                                                Code # 1 uploaded!
                                                <FileInput
                                                    id="file1"
                                                    ref={fileInput1Ref}
                                                    onChange={handleFileChange}
                                                />
                                            </SuccessFileLabel>
                                        </>
                                    ) : (
                                        <FileLabel htmlFor="file1">
                                            Upload Code # 1
                                            <FileInput
                                                id="file1"
                                                ref={fileInput1Ref}
                                                onChange={handleFileChange}
                                            />
                                        </FileLabel>
                                    )}
                                    {code2 ? (
                                        <>
                                            <TextArea
                                                rows={4}
                                                value={code2}
                                                onChange={(e) =>
                                                    setCode2(e.target.value)
                                                }
                                            />
                                            <SuccessFileLabel htmlFor="file2">
                                                Code # 2 uploaded!
                                                <FileInput
                                                    id="file2"
                                                    ref={fileInput2Ref}
                                                    onChange={handleFileChange}
                                                />
                                            </SuccessFileLabel>
                                        </>
                                    ) : (
                                        <FileLabel htmlFor="file2">
                                            Upload Code # 2
                                            <FileInput
                                                id="file2"
                                                ref={fileInput2Ref}
                                                onChange={handleFileChange}
                                            />
                                        </FileLabel>
                                    )}
                                </>
                            )}
                            <Button
                                type="button"
                                id="switchBtn"
                                size="medium"
                                variant="outlined"
                                onClick={handleToggleFieldType}
                                style={{ margin: "10px 0 20px 0" }}
                            >
                                {fieldType === "text"
                                    ? "Switch to File Upload"
                                    : "Switch to Text Field"}
                            </Button>

                            <br />

                            <Button
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Submit
                            </Button>
                        </form>
                    )}

                    <FadeIn className={isLoading ? "fade-in loader" : "loader"}>
                        <div
                            style={{
                                margin: "0 auto",
                                textAlign: "center",
                                width: "80%",
                            }}
                        >
                            <MagnifyingGlass
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="magnifying-glass-loading"
                                wrapperStyle={{ margin: "0 auto" }}
                                style={{ margin: "0 auto" }}
                                wrapperClass="magnifying-glass-wrapper"
                                glassColor="#c0efff"
                                color="#e15b64"
                            />
                            <p>{randomStatement}</p>
                        </div>
                    </FadeIn>
                    {err && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <Button variant="outlined" color="error">
                                Kindly fill in all the fields first!
                            </Button>
                        </div>
                    )}
                </Container>
            )}

            {response && (
                <FadeIn className={response ? "fade-in" : ""}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Aspect</TableCell>
                                <TableCell>Code # 1</TableCell>
                                <TableCell>Code # 2</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(response.code_a).map((aspect) => (
                                <TableRow key={aspect}>
                                    <TableCell>
                                        {capitalizeFirstLetter(
                                            aspect.replace(/_/g, " ")
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {response.code_a[aspect]}
                                    </TableCell>
                                    <TableCell>
                                        {response.code_b[aspect]}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={1}>
                                    <b>Plagiarism comment</b>
                                </TableCell>
                                <TableCell colSpan={2}>
                                    <b>{response.plagiarism.feedback}</b>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </FadeIn>
            )}

            <br />

            {!isLoading && showResponse && (
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={toggleResponse}
                >
                    Go Back
                </Button>
            )}
        </div>
    );
};

export default SubmitForm;
