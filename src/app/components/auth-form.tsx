"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./auth-form.module.css";

type AuthData = {
  email: string;
  password: string;
};

type SignupResponse = {
  error?: string;
};

const stripTags = (s: string): string =>
  String(s ?? "").replace(/<\/?[^>]+>/g, "");

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState<AuthData>({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (callbackUrl !== "/") {
      setStatusMessage("Please sign in to continue");
    } else {
      setStatusMessage("");
    }
  }, [callbackUrl]);

  const handleToggle = (): void => {
    setIsLogin((prev) => !prev);
    setErrors("");
    setData({ email: "", password: "" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;

    if (id === "email" || id === "password") {
      setData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const loginUser = async (email: string, password: string): Promise<void> => {
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setErrors(result.error);
      return;
    }

    router.push(result?.url || callbackUrl);
    router.refresh();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors("");
    setIsSubmitting(true);

    const email = stripTags(data.email);
    const password = stripTags(data.password);

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const responseData: SignupResponse = await res.json();

        if (!res.ok || responseData.error) {
          setErrors(responseData.error || "Registration failed.");
          return;
        }

        await loginUser(email, password);
      }
    } catch {
      setErrors("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{isLogin ? "Sign In" : "Register"}</h1>

        {statusMessage && (
          <p className={styles.statusMessage}>{statusMessage}</p>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>

          {errors && <p className={styles.error}>{errors}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !data.email || !data.password}
          >
            {isSubmitting
              ? isLogin
                ? "Signing in..."
                : "Registering..."
              : isLogin
                ? "Sign In"
                : "Register"}
          </button>
        </form>

        <div className={styles.toggle}>
          <p>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button type="button" onClick={handleToggle}>
            {isLogin ? "Register" : "Sign In"}
          </button>
          <button onClick={() => signIn("github", { callbackUrl })}>
            Sign in with GitHub
          </button>
          <button onClick={() => signIn("google", { callbackUrl })}>
              Sign in with Google
            </button>
        </div>
      </div>
    </div >
  );
}