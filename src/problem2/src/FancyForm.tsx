import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import styled from "styled-components";
import { useFormik } from "formik";
import * as yup from "yup";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";

const CenterRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  text-align: center;
`;

// fake some request timing
const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const validationSchema = yup.object({
  ethAddress: yup
    .string()
    .required("Please enter your ETH address")
    .matches(/[a-fA-F0-9]{40}/, "Invalid ETH address"),
  amount: yup
    .number()
    .min(50, "Enter at least 50 ETH to cover the gas fee")
    .max(400000, "Amount exceeds your current wallet value")
    .required("Please enter an amount to send"),
  OTP: yup
    .string()
    .required("Please enter your OTP")
    .matches(/[0-9]{6}/, "OTP should be a 6 digit number")
    .test(
      "OTP-check",
      "OTP is invalid. Please retry.",
      (OTP) => localStorage.getItem("token") == OTP
    ),
});

export const FancyForm: React.FC = () => {
  const [isOTPLoading, setOTPLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      ethAddress: "",
      amount: "",
      OTP: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      console.log(values);
      await sleep(2000);
      if (Math.random() > 2) {
        setFailedMessage("Transaction failed");
        console.log("failed");
      } else {
        setFailedMessage("");
        setSuccess(true);
      }
      setSubmitting(false);
      return;
    },
    validateOnBlur: true,
    validateOnChange: false,
    validateOnMount: false,
  });

  const getToken = async () => {
    setOTPLoading(true);
    const token = Math.floor(100000 + Math.random() * 900000);
    await sleep(2000);
    localStorage.setItem("token", `${token}`);
    toast(
      <>
        New Message from FancyForm
        <br />
        <br />
        Your OTP is <strong>{token}</strong>
      </>
    );
    await sleep(1000);
    setOTPLoading(false);
    return token;
  };

  return (
    <Form onSubmit={formik.handleSubmit} style={{ width: 440 }}>
      <Form.Group
        className={
          formik.errors.ethAddress && formik.touched.ethAddress
            ? "mb-1"
            : "mb-4"
        }
        controlId="ethAddress"
      >
        <Form.Label>ETH Address</Form.Label>
        <InputGroup hasValidation>
          <InputGroup.Text>0x</InputGroup.Text>
          <Form.Control
            placeholder="Enter ETH Address"
            value={formik.values.ethAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isValid={!formik.errors.ethAddress && formik.touched.ethAddress}
            isInvalid={!!formik.errors.ethAddress && formik.touched.ethAddress}
            disabled={formik.isSubmitting}
            maxLength={40}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.ethAddress}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group
        className={
          formik.errors.amount && formik.touched.amount ? "mb-1" : "mb-4"
        }
        controlId="amount"
      >
        <Form.Label>Amount to send</Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            type="number"
            placeholder="ETH Amount"
            value={formik.values.amount}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            isValid={!formik.errors.amount && formik.touched.amount}
            isInvalid={!!formik.errors.amount && formik.touched.amount}
            disabled={formik.isSubmitting}
            inputMode={"decimal"}
          />
          <InputGroup.Text>ETH</InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            {formik.errors.amount}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group
        className={formik.errors.OTP && formik.touched.OTP ? "mb-1" : "mb-4"}
        controlId="OTP"
      >
        <Form.Label>OTP Authentication</Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            placeholder="Your OTP"
            value={formik.values.OTP}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            isValid={!formik.errors.OTP && formik.touched.OTP}
            isInvalid={!!formik.errors.OTP && formik.touched.OTP}
            disabled={formik.isSubmitting}
            type="number"
            maxLength={6}
            min={0}
            max={999999}
          />
          <Button
            variant="outline-primary"
            onClick={getToken}
            disabled={isOTPLoading}
          >
            {isOTPLoading ? (
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              "Send OTP"
            )}
          </Button>
          <Form.Control.Feedback type="invalid">
            {formik.errors.OTP}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <CenterRow>
        <Button variant="primary" type="submit">
          &nbsp;&nbsp;Send Tokens&nbsp;&nbsp;
          {formik.isSubmitting && (
            <Spinner animation="border" role="status" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </Button>
        {!!failedMessage && (
          <div style={{ display: "block" }} className="invalid-feedback">
            {failedMessage}
          </div>
        )}
        {success && (
          <div style={{ display: "block" }} className="valid-feedback">
            {"Transaction successful"}
          </div>
        )}
      </CenterRow>
    </Form>
  );
};
