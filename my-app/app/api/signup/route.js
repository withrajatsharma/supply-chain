import userModel from "@/models/user.model";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "one of the mandotary field is emptyyyyyyy",
        })
      );
    }

    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return new Response(
        JSON.stringify({
          existUser,
          success: false,
          message: "user already exists",
        })
      );
    }

    let securedPassword;

    try {
      securedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "hashing was unsuccessful",
        })
      );
    }

    const user = await userModel.create({
      name,
      email,
      password: securedPassword,
      role,
    });

    user.password = undefined;

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    cookies().set("token", accessToken, {
      expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: user,
        token: accessToken,
        message: "user created successfully",
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "error occurred",
        error: error,
      })
    );
  }
};
