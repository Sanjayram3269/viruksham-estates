"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export default function AdminProjectsPage() {
  return (
    <Container className="bg-[#faf8f5] space-y-10">
      <SectionHeading
        eyebrow="PROJECT CATALOGUE"
        title="Our Developments"
        description="Explore residential communities, premium plots, and commercial spaces by Viruksham Estates."
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Projects will be fetched and displayed here */}
      </div>
    </Container>
  );
}