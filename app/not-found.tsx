import React from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#faf8f5] py-16 text-center">
      <Container className="max-w-md space-y-6">
        <Eyebrow>404 — PAGE NOT FOUND</Eyebrow>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-4xl">
          Space Not Found
        </h1>
        <p className="text-sm text-[#645d57] leading-relaxed">
          The page or resource you are looking for does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Button href="/" variant="primary">
            Return to Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
