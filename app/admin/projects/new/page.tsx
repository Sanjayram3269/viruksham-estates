"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminProjectCreatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Admin status is checked via API route; initialize form state
  }, []);

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = Object.fromEntries(
        new FormData(event.currentTarget).entries()
      ) as Record<string, unknown>;
      const createResponse = await fetch(
        `${window.location.origin}/api/admin/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            slug:
              (formData.slug as string | undefined) ??
              (formData.title as string | undefined) ??
              `project-${Date.now()}`,
          }),
          credentials: "include",
        }
      );

      if (!createResponse.ok) {
        const body = await createResponse.json().catch(() => ({}));
        throw new Error(
          typeof body.error === "string"
            ? body.error
            : "Failed to create project"
        );
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="bg-[#faf8f5]">
      <Container className="max-w-2xl mx-auto space-y-8">
        <SectionHeading
          eyebrow="PROJECT CATALOGUE"
          title="Create New Project"
          description="Add a new property development to the catalogue"
        />

        <div className="mb-6">
          <Button
            onClick={() => router.push("/admin/projects")}
            variant="outline"
          >
            ← Back to Projects
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-6">
            <svg
              className="h-4 w-4 text-red-600 flex-shrink-0 mr-2"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0-2 .9-2-2v-4c0-1.1-.9-2-2-2zm-2-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0-2 .9-2-2v-4zm-8 2c-1.1-0.89-2-2-2-2h-4c-1.1 0-2 .9-2 2v4c-0.89 1.1-2 2-2H6zM6 10c0-1.1.89-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.89 2-2 2H6v-4zm14-4h-4c0-1.1.9-2 2-2v4c0 1.1.9-2 2-2h4c1.1 0 2-.9 2-2v-4c0 1.1-.9-2-2-2zm-4 6h-2v-2h2v2zM6 18h2v-2H6v2zm0-4h2v-2H6v2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Title
            </label>
            <div className="relative">
              <input
                required
                type="text"
                name="title"
                placeholder="e.g. Anugraham Nagar Phase 2"
                className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Subtitle
            </label>
            <div className="relative">
              <input
                type="text"
                name="subtitle"
                placeholder="Optional subtitle"
                className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="">Select category</option>
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="PLOTS">PLOTS</option>
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="CONSTRUCTION">CONSTRUCTION</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="">Select status</option>
                <option value="LIVE">LIVE</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="UPCOMING">UPCOMING</option>
                <option value="SOLD_OUT">SOLD_OUT</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Location
            </label>
            <div className="relative">
              <input
                required
                type="text"
                name="location"
                placeholder="e.g. Chennai"
                className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Price (optional)
            </label>
            <div className="relative">
              <input
                type="text"
                name="pricing"
                placeholder="e.g. ₹1.2 Cr onwards"
                className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Description
            </label>
            <div className="relative">
              <textarea
                rows={3}
                name="description"
                placeholder="Describe the project highlights and features..."
                className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Highlights (optional)
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  name="highlights"
                  placeholder="e.g. Gated community, 24/7 security, Landscaped gardens"
                  className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Amenities (optional)
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  name="amenities"
                  placeholder="e.g. Swimming pool, Gym, Parking"
                  className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Overview (optional)
            </label>
            <div className="relative">
              <textarea
                rows={2}
                name="overview"
                placeholder="Brief overview for the project description..."
                className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Published
              </label>
              <div className="relative">
                <select
                  name="is_published"
                  defaultValue="false"
                  className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                >
                  <option value="false">Draft</option>
                  <option value="true">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Display Order
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  name="display_order"
                  defaultValue={0}
                  className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="5"
                      fill="none"
                      strokeWidth="1"
                      stroke="currentColor"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <span>Create Project</span>
              )}
            </Button>
          </div>
        </form>
      </Container>
    </Section>
  );
}
