// pages/login.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Login() {
  const [passcode, setPasscode] = useState("");
  const [storedPasscode, setStoredPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch the passcode from the custom API endpoint
    fetch("/api/passcode")
      .then((response) => response.json())
      .then((data) => {
        setStoredPasscode(data.passcode);
      });
  }, []);

  const handleLogin = () => {

    if (passcode === storedPasscode) {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      setError("你不是我朋友");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-white rounded shadow-md">
          <h1 className="mb-4 text-2xl font-bold">登录 &#x1F9F6;
 &#x1F408;&#x200D;&#x2B1B;
</h1>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="我是谁"
            className="w-full p-2 mb-4 border rounded"
          />
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full p-2 text-white bg-blue-500 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
