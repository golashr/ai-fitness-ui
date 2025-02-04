"use client";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { signUpWithPassword } from "@/redux/features/authSlice";
import toast from "react-hot-toast";

export default function SignUp() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signUpWithPassword({ email, password })).unwrap();
      setIsRegistered(true);
      toast.success("Registration successful! Please check your email to verify your account.");
    } catch (err: any) {
      toast.error(err || "Failed to register");
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>
            <p className="text-center text-gray-600">
              We've sent a verification link to <strong>{email}</strong>. 
              Please check your email and click the link to verify your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ... rest of the component remains the same
} 