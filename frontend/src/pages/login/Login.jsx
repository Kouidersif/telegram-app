
import { Alert, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser } from "../../store/slices/userSlice";
import Button from "../../components/ui/Button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, accessToken } = useSelector((state) => state.user);
    useEffect(() => {
        if (accessToken) {
            navigate('/tg-connect');
        }
    }, [accessToken])
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const username = data.get('username');
        const password = data.get('password');
        dispatch(LoginUser({ username, password }));
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50 dark:bg-gray-900 h-screen">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Login to your account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Or <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Create</Link> a new account
                    </p>
                </div>
                <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username1">username</Label>
                        </div>
                        <TextInput name="username" id="username1" type="username" placeholder="name@flowbite.com" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1">password</Label>
                        </div>
                        <TextInput name="password" placeholder="**********" id="password1" type="password" required />
                    </div>
                    <Button disabled={loading} loading={loading} type="submit" textContent={"Submit"} />
                </form>
            </div>
        </div>
    );
}
