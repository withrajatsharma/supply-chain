import userModel from "@/models/user.model";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "enter email and password",
        })
      );
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "user does not exist",
        })
      );
    }

    if (await bcrypt.compare(password, user.password)) {
      user.password = undefined;
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "24h",
      });

      cookies().set("token", accessToken, {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });

      return new Response(
        JSON.stringify({
          success: true,
          user: user,
          token: accessToken,
          message: "user logged in successfully",
        })
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "password incorrect",
        })
      );
    }
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
