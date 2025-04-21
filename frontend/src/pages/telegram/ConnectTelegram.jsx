import React from 'react'
import { flags } from './flags';
import { Card, Label, TextInput } from 'flowbite-react';
import Button from '../../components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { connectTelegram as connectTelegramApi, setCodeVerified, verifyCode } from '../../store/slices/telegramSlice';
import { useNavigate } from 'react-router-dom';

const ConnectTelegram = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showCountries, setShowCountries] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState(flags[0]);
    const { tg_ssid, accessToken } = useSelector((state) => state.user);
    const { loading, success, phone_code_hash, codeVerified } = useSelector((state) => state.telegram);
    const [verificationCode, setVerificationCode] = React.useState('');

    React.useEffect(() => {
        if (codeVerified) {
            console.log('code verified then navigate to home');
            dispatch(setCodeVerified(false))
            // navigate('/');
            window.location.href = '/';
        }
    }, [codeVerified]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('handle submit', tg_ssid);
        console.log('handle submit', accessToken);
        const form = e.target;
        const data = new FormData(form);
        const phoneNumber = data.get('phone_number');
        
        if (!phoneNumber.match(/^\d+$/)) {
            return;
        }
        const phoneNumberWithCountryCode = `${selectedCountry.code}${phoneNumber}`;
        dispatch(connectTelegramApi({ phone_number: phoneNumberWithCountryCode }));
    }

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        if (!verificationCode) return;
        dispatch(verifyCode({
            code: verificationCode,
            phone_code_hash: phone_code_hash,
            session_id: tg_ssid,
        }));
        setVerificationCode('');
    }



    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md">
                <Card className="flex flex-col gap-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Connect Telegram
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enter your phone number to connect your Telegram account
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="phone-input" className="mb-2 block">
                                Phone number
                            </Label>
                            <div className="flex">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowCountries(!showCountries)}
                                        type="button"
                                        className="h-full w-fit cursor-pointer z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                                    >
                                        <span className="mr-2">{selectedCountry.emoji}</span>
                                        {selectedCountry.code}
                                    </button>
                                    <div
                                        className={`absolute left-0 top-full mt-1 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-52 dark:bg-gray-700 ${showCountries ? "block" : "hidden"}`}
                                    >
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-60 overflow-y-auto">
                                            {flags.map((flag, i) => (
                                                <li key={i}>
                                                    <button
                                                        type="button"
                                                        className="cursor-pointer inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        onClick={() => {
                                                            setSelectedCountry(flag);
                                                            setShowCountries(false);
                                                        }}
                                                    >
                                                        <span className="inline-flex items-center">
                                                            <span className="mr-2">{flag.emoji}</span>
                                                            {flag.name} ({flag.code})
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    name="phone_number"
                                    id="phone-input"
                                    className="block flex-1 p-2.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-s-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            loading={loading}
                            textContent="Send Code"
                        />
                        </form>
                    ) : (
                        <form onSubmit={handleVerificationSubmit} className="flex flex-col gap-4">
                            <div>
                                <Label htmlFor="verification-code" className="mb-2 block">
                                    Verification Code
                                </Label>
                                <TextInput
                                    type="text"
                                    id="verification-code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Enter verification code"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                loading={loading}
                                textContent="Verify Code"
                            />
                        </form>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default ConnectTelegram;