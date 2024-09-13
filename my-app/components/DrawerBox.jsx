"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

const drawer = ({ parcel, checkParcelStatus, buttonText }) => {
  return (
    <Drawer>
      <DrawerTrigger
        onClick={checkParcelStatus}
        className=" whitespace-nowrap px-4 hover:bg-zinc-800 py-2  bg-black rounded-lg text-white"
      >
        {buttonText}{" "}
      </DrawerTrigger>

      <DrawerContent className="px-8 bg-white  py-5 pb-10 ">
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold mb-4">
            {parcel.name}
          </DrawerTitle>
          <DrawerDescription className="text-xl">
            {parcel.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex px-4 gap-14 mt-10  justify-between  ">
          <div className="w-1/2 text-lg flex flex-col gap-10 ">
            <p>LOCATION : {parcel.location}</p>
            <p>SERVICE : {parcel.service}</p>
            <p>CHECK POINTS : {parcel.checkPoints}</p>
            {parcel.isLost && (
              <p className="text-red-500 font-bold">Parcel marked for lost </p>
            )}
          </div>

          <div className="w-1/2 flex flex-col gap-12 pl-10">
            {parcel?.allLocations?.map((loc, idx) =>
              parseInt(parcel?.latestCheckpoint) === idx ? (
                <div className="border-4 border-red-500 p-1 rounded-lg border-dotted w-[50%] ">
                  <div className="flex justify-center items-center rounded-lg h-12 bg-zinc-900  text-white  text-base">
                    {loc}
                  </div>
                </div>
              ) : parseInt(parcel?.latestCheckpoint) > idx ? (
                <div className="flex justify-center items-center rounded-lg w-[50%] h-12 bg-zinc-300 text-slate-600 text-base">
                  {loc}
                </div>
              ) : (
                <div className="flex justify-center items-center rounded-lg w-[50%] h-12 bg-zinc-900 text-white text-base">
                  {loc}
                </div>
              )
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default drawer;
