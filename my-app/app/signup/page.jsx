"use client";
import React, {useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import axios from "axios";

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);

  const { push } = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/signup", {
        name: name,
        email: email,
        password: password,
        role: role,
      });

      if (response.data.existUser) {
        alert("user already exists, login instead");
      }

      if (response.data.success) {
        if (response.data.user.role == "buyer") {
          push("/buyer");
        }
        if (response.data.user.role == "seller") {
          push("/seller");
        }
        if (response.data.user.role == "delivery") {
          push("/service");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center sm:justify-evenly mt-20 sm:mt-28">
        <div className="md:w-96 w-[90vw] md:max-w-96 max-w-80  rounded bg-white px-7 py-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
          <form>
            <h4 className="text-2xl mb-7">SignUp</h4>

            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Name"
                className="input-box"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Email"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={"Password"}
              />

              <Select onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">buyer</SelectItem>
                  <SelectItem value="seller">seller</SelectItem>
                  <SelectItem value="delivery">delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <Button onClick={handleSignUp} className="mt-8 w-full">
              Create Account
            </Button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className=" text-black font-semibold underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
