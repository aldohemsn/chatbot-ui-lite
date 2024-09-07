// pages/login.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Login() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Debugging: Log environment variable on component mount
    console.log("Environment variable NEXT_PUBLIC_PASSCODE:", process.env.NEXT_PUBLIC_PASSCODE);
  }, []);

  const handleLogin = () => {
    console.log("Entered passcode:", passcode); // Debugging: Log entered passcode
    console.log("Expected passcode:", process.env.NEXT_PUBLIC_PASSCODE); // Debugging: Log expected passcode

    if (passcode === process.env.NEXT_PUBLIC_PASSCODE) {
      localStorage.setItem("isLoggedIn", "true");
      console.log("Passcode correct. Redirecting to home page."); // Debugging: Log success message
      router.push("/");
    } else {
      setError("Incorrect passcode. Please try again.");
      console.log("Passcode incorrect."); // Debugging: Log failure message
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-white rounded shadow-md">
          <h1 className="mb-4 text-2xl font-bold">Login</h1>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
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
