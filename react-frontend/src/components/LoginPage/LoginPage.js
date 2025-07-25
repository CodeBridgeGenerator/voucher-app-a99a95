import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import client from '../../services/restClient';
import { codeGen } from '../../utils/codegen';
import illustration2 from '../../assets/media/login illustration 2.png';
import emailSent from '../../assets/media/email.png';
import { emailRegex } from '../../utils/regex';
import AppFooter from '../Layouts/AppFooter';

const LoginPage = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = /login/.test(location.pathname);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [maskPassword, setMaskPassword] = useState(true);
    const [showForgotPassword, setForgotPassword] = useState(false);
    const [verificationError, setVerificationError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isSend, setIsSend] = useState(false);

    useEffect(() => {
        if (props.isLoggedIn === true) navigate('/', { replace: true });
    }, [props.isLoggedIn]);

    const onEnter = (e) => {
        if (e.key === 'Enter') login();
    };

    const _getEmail = async () => {
        return await client.service('userInvites').find({ query: { emailLogin: email } });
    };

    const login = () => {
        setLoading(true);
        if (validate()) {
            props.login({ email, password })
                .then(async (res) => {
                    try {
                        await client.service('loginHistory').create({ userId: res.user._id });
                    } catch (historyError) {
                        console.error('Failed to save login history:', historyError);
                    }
                    navigate('/project');
                    setLoading(false);
                })
                .catch(() => {
                    props.alert({ title: 'User Login failed.', type: 'error', message: 'Invalid Login' });
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    const validate = () => {
        let isValid = true;
        if (!emailRegex.test(email)) {
            setEmailError('Please Enter a valid Email address');
            isValid = false;
        }
        if (password.length < 6) {
            setPasswordError('Please enter a valid password. Must be at least 6 characters');
            isValid = false;
        }
        return isValid;
    };

    const sendToForgotResetPage = async () => {
        if (!emailRegex.test(email)) {
            props.alert({ title: 'Invalid email', type: 'error', message: 'Please enter a valid email' });
            setVerificationError('user email not valid');
            return;
        }

        const userData = await client.service('users').find({ query: { email: email } });
        const userInviteData = await client.service('userInvites').find({ query: { emailToInvite: email } });

        if (userData.data?.length === 0 && userInviteData.data?.length === 0) {
            props.alert({ title: 'Invalid email', type: 'error', message: 'Please enter a valid email' });
            setVerificationError('user email not found');
            return;
        }

        setLoading(true);
        const userLoginData = await _getEmail();
        const userLogin = userLoginData?.data[0];

        try {
            if (!userLogin) {
                setVerificationError('user has not attempted to logged in');
            } else if (!userLogin?.status) {
                setVerificationError('user has not logged in successfully.');
            } else if (isNaN(Number(userLogin?.code))) {
                setVerificationError('user has not been verified');
            } else {
                const userCPData = await client.service('userChangePassword').find({
                    query: { userEmail: email, $sort: { createdAt: -1 }, $limit: 1 }
                });
                const userCP = userCPData?.data[0];

                const _data = {
                    userEmail: email,
                    server: window.location.href,
                    environment: process.env.REACT_APP_ENV,
                    code: codeGen(),
                    status: false,
                    sendEmailCounter: (userCP?.sendEmailCounter || 0) + 1
                };

                if (!userCP || _data.sendEmailCounter <= 3) {
                    if (!userCP) {
                        await client.service('userChangePassword').create(_data);
                    } else {
                        await client.service('userChangePassword').patch(userCP._id, _data);
                    }
                    props.alert({
                        title: `Reset password email sent to ${email}.`,
                        type: 'warn',
                        message: `Account ${email} verification (${_data.sendEmailCounter}) under process.`
                    });
                    setIsSend(true);
                } else {
                    setVerificationError('Too many tries, please contact admin');
                }
            }
        } catch (error) {
            throw Error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const resendEmail = () => {
        props.alert({
            title: 'Email resent',
            type: 'success',
            message: 'Successfully resend email. Please check your inbox or Junk/Span folder.'
        });
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <div className="md:w-3/5 w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
                <img
                    src="https://images.unsplash.com/photo-1679193559811-b3a3a6353230?q=80&w=2396&auto=format&fit=crop"
                    alt="Login Illustration"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="md:w-2/5 w-full flex items-center justify-center p-6 bg-white shadow-lg">
                <div className="w-full max-w-md space-y-6">
                    {!showForgotPassword && !isSend && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-center text-secondary">Carter Bank Rewards</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Email</label>
                                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={classNames('w-full', emailError && 'p-invalid')} onKeyDown={onEnter} />
                                    <small className="p-error">{emailError}</small>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Password</label>
                                    <div className="relative">
                                        <i className={`pi ${maskPassword ? 'pi-eye' : 'pi-eye-slash'} absolute right-3 top-3 cursor-pointer`} onMouseDown={() => setMaskPassword(false)} onMouseUp={() => setMaskPassword(true)} onMouseLeave={() => setMaskPassword(true)} />
                                        <InputText type={maskPassword ? 'password' : 'text'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={classNames('w-full', passwordError && 'p-invalid')} onKeyDown={onEnter} />
                                    </div>
                                    <small className="p-error">{passwordError}</small>
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center gap-2 text-sm">
                                        <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.checked)} />
                                        Remember me
                                    </label>
                                    <span className="text-sm font-semibold text-primary cursor-pointer" onClick={() => setForgotPassword(true)}>Forgot your password?</span>
                                </div>
                                <Button label="Sign in" className="w-full !rounded-full py-3 text-[16px]" onClick={login} loading={loading} />
                            </div>
                            <div className="text-center text-sm">
                                Haven't activated your account? <Link to="/signup" className="text-primary font-semibold">Set up now</Link>
                            </div>
                        </div>
                    )}

                    {showForgotPassword && !isSend && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-center text-primary">Forgot your password?</h2>
                            <p className="text-center text-sm">Enter your registered email and we’ll send instructions to reset your password.</p>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Email</label>
                                <InputText className="w-full" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                                <small className="p-error">{verificationError}</small>
                            </div>
                            <Button label="Send reset instructions" className="w-full !rounded-full py-3 text-[16px]" loading={loading} disabled={!email} onClick={sendToForgotResetPage} />
                            <div className="text-center">
                                <span className="text-primary font-semibold cursor-pointer" onClick={() => setForgotPassword(false)}>Back to login</span>
                            </div>
                        </div>
                    )}

                    {isSend && (
                        <div className="space-y-6 text-center">
                            <img src={emailSent} alt="email sent" className="mx-auto w-2/3 max-w-xs" />
                            <h2 className="text-2xl font-bold">Check your email</h2>
                            <p className="text-sm">We’ve sent reset instructions to your email. Check spam if it doesn’t arrive. Still having issues? Resend the email or contact support.</p>
                            <Button label="Back to login" className="w-full !rounded-full py-3 text-[16px]" onClick={() => { setForgotPassword(false); setIsSend(false); }} loading={loading} disabled={!email} />
                            <p className="text-primary font-semibold cursor-pointer" onClick={resendEmail}>Resend email</p>
                        </div>
                    )}

                    <AppFooter />
                </div>
            </div>
        </div>
    );
};

const mapState = (state) => ({ isLoggedIn: state.auth.isLoggedIn });
const mapDispatch = (dispatch) => ({
    login: (data) => dispatch.auth.login(data),
    alert: (data) => dispatch.toast.alert(data)
});

export default connect(mapState, mapDispatch)(LoginPage);
