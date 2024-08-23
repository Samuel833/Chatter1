import React, { FormEvent, useState } from "react";
import { useLoginModal } from "@/app/hook/useModal";
import Modal from "../Modal";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


const GoogleSigninButton = () => {
  function handleGoogleSignin() {
    const callbackUrl = window.location.pathname
    signIn("google", {
      callbackUrl: callbackUrl,
    });
  }

  return (
    <button
      onClick={handleGoogleSignin}
      className="w-full text-gray-900 focus:ring-2 border focus:ring-primary-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      type="button"
    >
      Sign In with Google
      <span className="ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline w-4 h-4 mr-3 text-gray-900 fill-current"
          viewBox="0 0 48 48"
          width="48px"
          height="48px"
        >
          <path
            fill="#fbc02d"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#e53935"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4caf50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1565c0"
            d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
      </span>
    </button>
  );
};

const GitHubSigninButton = () => {
  function handleGitHubSignin() {
    const callbackUrl = window.location.pathname
    signIn("github", {
      callbackUrl: callbackUrl,
    });
  }

  return (
    <button
      onClick={handleGitHubSignin}
      className="w-full text-gray-900 focus:ring-2 border focus:ring-primary-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      type="button"
    >
                  {/* className="inline w-4 h-4 mr-3 text-gray-900 fill-current" */}
      Sign In with GitHub
      <span className="ml-2">
          <svg aria-hidden="true" className="octicon octicon-mark-github inline w-4 h-4 mr-3 text-gray-900 fill-current" height="24" version="1.1" viewBox="0 0 16 16" width="24">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z">
            </path>
          </svg>
      </span>
    </button>
  );
};

const LoginModal: React.FC = () => {
  const loginModal = useLoginModal();
  const [error, setError] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);

    const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginInProgress(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    // const callbackUrl = window.location.pathname;

    console.log(email, password)

    const signinResponse = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: `${window.location.pathname}`
    });

    if (signinResponse?.error) {
      setError(signinResponse.error as string);
      setLoginInProgress(false);
      return;
    }


    console.log(signinResponse);
    loginModal.onClose();
    router.push(window.location.href);
  };
  return (
    <Modal
      disabled={false}
      isOpen={loginModal.isOpen}
      onClose={loginModal.onClose}
      onSubmit={(() => console.log('login successfully'))}
      body={
        <div className="flex justify-center items-center overflow-y-auto p-4 bg-white">
          <form
           onSubmit={handleSubmit}
            className="bg-white border border-gray-300 rounded-lg shadow-lg px-8 py-10 w-full max-w-md"
          >
            {error && (
              <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}

            <h1 className="text-3xl font-semibold mb-6 text-center">Log In</h1>
            <input
              type="text"
              data-testid="Email"
              placeholder="somemail@example.com"
              name="email"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full text-black placeholder-gray-500"
            />
            <input
              type="password"
              data-testid="Password"
              placeholder="******"
              name="password"
              className="border border-gray-300 rounded px-4 py-2 mb-4 w-full text-black placeholder-gray-500"
            />
            <div className="text-right text-gray-500 mb-4">
              <a href="/forgot-password" className="underline">
                Forgot password?
              </a>
            </div>

            <button
              disabled={loginInProgress}
              data-testid="Login"
              className={`bg-black text-white rounded px-4 py-2 w-full ${
                loginInProgress ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
            >
              {loginInProgress ? "Logging in..." : "Login"}
            </button>

            <div className="my-4 text-center text-gray-500">
              or login with provider
            </div>

            <GoogleSigninButton />
            <GitHubSigninButton />

            <div className="text-center mt-4 text-gray-500 border-t pt-4">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline">
                Sign up here &raquo;
              </a>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default LoginModal
