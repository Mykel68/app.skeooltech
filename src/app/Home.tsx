"use client";

import { SchoolCodeForm } from "@/components/SchoolCodeForm";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-primary/30 z-10" />

      {/* Foreground content */}
      <div className="container relative z-20 max-w-md px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl space-y-6"
        >
          <div className="">
            {/* Logo placeholder */}
            <div className="flex items-center justify-center mb-4 ">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={400}
                height={400}
                className="h-16 w-16 object-cover object-center"
              />
            </div>

            <div className="space-y-1 text-center">
              <motion.h1
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome
              </motion.h1>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Enter your school code to continue
              </motion.p>
            </div>
          </div>

          <SchoolCodeForm />

          <div className="pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Contact your school administrator
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
