"use client";
import { SyntheticEvent } from "react";
import styled from "styled-components";
import SponImage from "@/components/common/SponImage";

const FormWrapper = styled.div`
  max-width: 1270px;
  width: calc(100% - 15px);
  margin: auto;
  display: block;
  position: relative;
  background: var(--black2);
  border: 1px solid rgba(220, 202, 135, 0.2);
  margin-bottom: 120px;
  h2 {
    font-size: 1.3rem;
    margin-bottom: 0.8em;
    font-family: "Cormorant Upright", serif;
  }
  h3 {
    font-size: 4rem;
    text-align: center;
    line-height: 0.9;
    color: var(--golden);
    letter-spacing: 1.2px;
    margin: 20px 0;
    @media (max-width: 991px) {
      font-size: 2rem;
    }
  }
  p {
    color: var(--white);
  }

  .form-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    form {
      max-width: 730px;
      width: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
      input[type="email" i] {
        background-color: transparent;
        height: 60px;
        font-size: 1rem;
        border: 1px solid #f5efdb;
        padding: 10px;
        font-family: "Cormorant Upright", serif;
        width: 100%;
        color: var(--white2);
        &:placeholder {
          color: var(--white2);
        }
        &:focus {
          outline: none;
        }
      }
      input[type="submit" i] {
        height: 44px;
        border: 2px solid var(--golden);
        background: var(--golden);
        color: var(--black2);
        padding: 10px;
        font-family: "Cormorant Upright", serif;
        width: 100%;
        max-width: 130px;
        transition: 0.5s all;
        cursor: pointer;
        &:hover {
          background: var(--black2);
          color: var(--golden);
        }
      }
      @media (max-width: 991px) {
        flex-direction: column;
      }
      @media (min-width: 99px) {
        margin-top: 40px;
      }
    }
    @media (max-width: 991px) {
      padding: 30px 10px;
    }
  }
  @media (max-width: 991px) {
    margin-bottom: 44px;
  }
`;
export default function FormSuscript() {
  const handlerSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <FormWrapper>
      <div className="form-content">
        <h2 className="">Newsletter</h2>
        <SponImage />
        <h3>Subscribe to Our Newsletter</h3>
        <p>And never miss latest Updates!</p>
        <form onSubmit={handlerSubmit}>
          <input
            type="email"
            name="newsLetter"
            id="newsLetter"
            placeholder="Email Address"
          />
          <input type="submit" value="Subscribe" />
        </form>
      </div>
    </FormWrapper>
  );
}
