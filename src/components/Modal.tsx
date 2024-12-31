import React from "react";
import styled from "styled-components";

// Define the types for the props that the Modal component will receive
interface ModalProps {
  onClose: () => void; // Function to close the modal
  policyContent: string; // String content for the policy
}

// Styled components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  max-height: 100vh;
  overflow-y: scroll;
  max-width: 500px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
`;

const Modal: React.FC<ModalProps> = ({ onClose, policyContent }) => {
  return (
    <Overlay onClick={onClose}>
      <ModalContent  onClick={(e) => e.stopPropagation()} className="prose">
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2 className="prose font-bold text-teal-700 bg-lime-200 rounded-md p-1 text-center">Open Law Forum Policy & user agreement</h2>
        <p className="text-zinc-800 text-sm text-justify">{policyContent}</p>
      </ModalContent>
    </Overlay>
  );
};

export default Modal;
