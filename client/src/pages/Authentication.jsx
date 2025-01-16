import React, { useState } from "react";
import { Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import LogoImg from "../utils/images/Logo.png";
import AuthImg from "../utils/images/AuthImage.png";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const Container = styled.div`
  display: flex;
  height: 100%;
  background: ${({ theme }) => theme.bg};
`;
const CloseButton = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  height: 32px;
  width: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.primary};
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
  }
`;
const Text = styled.p`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  font-size: 15px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 400px) {
    font-size: 10px;
  }
`;
const TextButton = styled.p`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
`;

const Authentication = ({ openAuth, setOpenAuth }) => {
  const [login, setLogin] = useState(true);

  return (
    <Modal open={openAuth} onClose={() => setOpenAuth(false)}>
      <Container>
        {/* Left Side */}
        <div className="relative hidden flex-1 md:block">
          <img
            src={LogoImg}
            alt="Logo"
            className="absolute left-14 top-10 z-10"
          />
          <img
            src={AuthImg}
            alt="Auth Image"
            className="relative h-full w-full object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="relative flex flex-[0.9] flex-col items-center justify-center gap-4 p-10 md:flex-1">
          <CloseButton>
            <Close onClick={() => setOpenAuth(false)} />
          </CloseButton>
          {login ? (
            <>
              <SignIn />
              <Text>
                Don't have an account ?{" "}
                <TextButton onClick={() => setLogin(false)}>Sign Up</TextButton>
              </Text>
            </>
          ) : (
            <>
              <SignUp />
              <Text>
                Already have an account ?{" "}
                <TextButton onClick={() => setLogin(true)}>Sign In</TextButton>
              </Text>
            </>
          )}
        </div>
      </Container>
    </Modal>
  );
};

export default Authentication;
