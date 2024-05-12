import styled from "styled-components";

export const TextArea = styled.textarea`
    width: 95%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical; /* Allow vertical resizing */
`;

export const Container = styled.div`
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 10px;
`;

export const Input = styled.input`
    width: 95%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    display: block;
`;

export const SwitchButton = styled(Button)`
    background-color: #54a4a7;
`;

export const FileInput = styled.input.attrs({ type: "file" })`
    display: none;
`;

export const FileLabel = styled.label`
    display: inline-block;
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    display: block; /* Ensure buttons are on separate lines */
`;

export const SuccessFileLabel = styled.label`
    display: inline-block;
    background-color: #009555;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    display: block; /* Ensure buttons are on separate lines */
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const Th = styled.th`
    background-color: #007bff;
    color: #fff;
    padding: 10px;
    text-align: left;
`;

export const Td = styled.td`
    padding: 10px;
    border-bottom: 1px solid #ccc;
`;

export const FadeIn = styled.div`
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    &.fade-in {
        opacity: 1;
    }
`;
