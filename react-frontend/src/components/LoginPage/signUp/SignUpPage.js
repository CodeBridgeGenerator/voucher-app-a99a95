import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import client from "../../../services/restClient";
import { Toast } from "primereact/toast";
import { emailRegex } from "../../../utils/regex";
import { codeGen } from "../../../utils/codegen";
import SignUpStep from "./SignUpStep";
import EnterDetailsStep from "./step/EnterDetails";
import VerificationStep from "./step/Verification";
import SetUpPassword from "./step/SetUpPassword";
import AppFooter from "../../Layouts/AppFooter";

const SignUpPage = (props) => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState();
  const [sysCode, setSysCode] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const showToast = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const _getInviteEmail = async () =>
    await client.service("userInvites").find({ query: { emailToInvite: email } });

  const _getUserEmail = async () =>
    await client.service("users").find({ query: { email } });

  const _setCounter = async (id, count) =>
    await client.service("userInvites").patch(id, { sendMailCounter: count });

  const validateEmailStep = () => {
    const err = {};
    if (!emailRegex.test(email)) err.email = "Please enter a valid email";
    if (!name.trim()) err.name = "Name is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const resendMail = async () => {
    const loginEmailData = await _getInviteEmail();
    let invite = loginEmailData?.data?.[0];

    if (!invite) {
      const newInvite = await client.service("userInvites").create({
        emailToInvite: email,
        access: null,
        code: codeGen(),
        sendMailCounter: 0,
      });
      invite = newInvite;
    }

    if (invite.sendMailCounter >= 3)
      return showToast("error", "Too many attempts", "Please contact admin.");
    if (!invite.code || invite.code <= 10000)
      return showToast("error", "Invalid code", "Contact admin.");

    setSysCode(invite.code);

    await client.service("mailQues").create({
      name: "onCodeVerifyEmail",
      type: "signup",
      from: "info@cloudbasha.com",
      recipients: [email],
      status: true,
      data: { name, code: invite.code },
      subject: "Email code verification",
      templateId: "onCodeVerify",
    });

    await _setCounter(invite._id, invite.sendMailCounter + 1);
    showToast("success", "Verification Sent", `Check your email: ${email}`);
    setStep(2);
  };

  const onFinishStepOne = () => validateEmailStep() && resendMail();

  const onFinishStepTwo = () => {
    code?.length === 6
      ? setStep(3)
      : setErrors({ code: "Enter the 6-digit code" });
  };

  const onFinishStepThree = async () => {
    const err = {};
    if (!password) err.password = "Password is required";
    if (password !== confirmPassword)
      err.confirmPassword = "Passwords do not match";
    setErrors(err);

    if (Object.keys(err).length === 0) await signup();
  };

  const signup = async () => {
    const userExists = await _getUserEmail();
    if (userExists?.data?.length > 0) {
      navigate("/login");
      return showToast("warn", "Account exists", "Proceed to login");
    }

    try {
      await props.createUser({ name, email, password, status: true });
      navigate("/login");
      showToast("success", "Account created", "Proceed to login");
    } catch (error) {
      showToast("error", "Signup failed", error.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Toast ref={toast} position="bottom-center" />

      <Link to="/login" className="text-blue-700 font-semibold flex items-center gap-1">
        <i className="pi pi-angle-left"></i> Back to login
      </Link>

      <header className="bg-white shadow p-5 flex justify-between items-center">
        <div className="text-xl font-semibold text-blue-700">&nbsp;</div>
        <SignUpStep step={step} />
      </header>

      <main className="flex-1 flex justify-center items-center p-6">
        {step === 1 && (
          <EnterDetailsStep
            name={name} setName={setName}
            nameError={errors.name}
            email={email} setEmail={setEmail}
            emailError={errors.email}
            onNext={onFinishStepOne}
            loading={loading}
          />
        )}

        {step === 2 && (
          <VerificationStep
            code={code} sysCode={sysCode} setCode={setCode}
            codeError={errors.code}
            setCodeError={(e) => setErrors(prev => ({ ...prev, code: e }))}
            onNext={onFinishStepTwo}
            resendCode={resendMail}
            loading={loading} setLoading={setLoading}
          />
        )}

        {step === 3 && (
          <SetUpPassword
            password={password} setPassword={setPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            passwordError={errors.password}
            setPasswordError={(e) => setErrors(prev => ({ ...prev, password: e }))}
            confirmPasswordError={errors.confirmPassword}
            setConfirmPasswordError={(e) => setErrors(prev => ({ ...prev, confirmPassword: e }))}
            onNext={onFinishStepThree}
            loading={loading}
          />
        )}
      </main>

      <AppFooter />
    </div>
  );
};

const mapState = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  passwordPolicyErrors: state.auth.passwordPolicyErrors,
});

const mapDispatch = (dispatch) => ({
  createUser: (data) => dispatch.auth.createUser(data),
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SignUpPage);
