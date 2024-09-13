"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import image1 from "@/public/Image1.png";
import image2 from "@/public/3629606_767.jpg";
import image3 from "@/public/2910191_479.jpg";
import image4 from "@/public/3628739_619.jpg";
import image5 from "@/public/3628746_626.jpg";

const page = () => {
  return (
    <main className="bg-gradient-to-b  from-purple-950 to-indigo-400 pb-10">
      <nav className=" border-gray-200 dark:bg-gray-900 pt-8">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
          <a className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-4xl font-semibold text-white whitespace-nowrap dark:text-white">
              Supply Guard
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className=" flex justify-center gap-5 ">
              <Link href={"/signup"}>
                <Button
                  variant={"secondary"}
                  className="bg-slate-200 hover:bg-slate-100 px-8 py-6"
                >
                  Sign Up
                </Button>
              </Link>

              <Link href={"/login"}>
                <Button className="px-8 py-6">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className=" w-full px-24 mt-32 flex  justify-around">
        <Image
          src={image1}
          className="w-[30%] rounded-md"
          width={500}
          height={500}
        />

        <div className=" flex flex-col  text-white items-center gap-2 justify-center">
          <p className="text-7xl font-bold">INNOVATION</p>
          <p className="text-4xl">is Our tradition</p>
        </div>
      </div>

      <div className=" w-full flex-row-reverse px-24 mt-32 flex  justify-around">
        <Image
          src={image2}
          className="w-[40%] rounded-md"
          width={500}
          height={500}
        />

        <div className=" flex flex-col  text-white items-center gap-2 justify-center">
          <p className="w-[80%] text-lg">
            Revolutionize Your Parcel Tracking with Our Blockchain Solution:
            Unmatched Transparency, Security, and Real-Time Updates. Ensure
            Every Parcel’s Journey is Secure, Transparent, and Traceable from
            Seller to Buyer with Our Decentralized, Immutable Ledger.
            SupplyGuard aims to revolutionize the logistics and supply chain
            industry by leveraging blockchain technology for enhanced
            transparency, security, and efficiency. This system will offer a
            decentralized, immutable ledger to track parcels from the seller to
            the buyer, ensuring real-time updates, fraud prevention, and an
            audit trail.
          </p>
        </div>
      </div>

      <div className=" w-full px-10 mt-32 flex   justify-center gap-10">
        <div className=" flex flex-col bg-indigo-900 rounded-lg pb-5  text-white items-center ">
          <Image
            src={image3}
            className=" h-[70%] rounded-md"
            width={500}
            height={500}
          />

          <p className="text-2xl py-2">Blockchain Integration</p>
          <p className="w-[90%]">
            Utilize blockchain technology to create a decentralized ledger that
            records every transaction and checkpoint in the parcel's journey.
          </p>
        </div>

        <div className=" flex flex-col bg-indigo-900 rounded-lg pb-5  text-white items-center">
          <Image
            src={image4}
            className=" h-[70%] rounded-md"
            width={500}
            height={500}
          />

          <p className="text-2xl py-2">Confidentiality</p>
          <p className="w-[90%]">
            Unique to our solution is the confidentiality feature, which ensures
            that only the seller and buyer know all the checkpoints.
          </p>
        </div>
        <div className="flex flex-col bg-indigo-900 rounded-lg pb-5  text-white items-center ">
          <Image
            src={image5}
            className=" h-[70%] rounded-md"
            width={500}
            height={500}
          />

          <p className="text-2xl py-2">Easy Parcel Recovery System</p>
          <p className="w-[90%]">
            {" "}
            In the event a parcel is lost during shipping, our system allows you
            to quickly identify the last recorded checkpoint.{" "}
          </p>
        </div>
      </div>
    </main>
  );
};

export default page;
