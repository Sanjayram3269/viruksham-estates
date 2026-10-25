"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

type AdminProject = {
  id: string;
  title?: string;
  subtitle?: string;
  category?: string;
  status?: string;
  location?: string;
  pricing?: string;
  description?: string;
  highlights?: unknown;
  amenities?: unknown;
  overview?: string;
  is_published?: boolean;
  display_order?: number;
  slug?: string;
};

const categories = ["RESIDENTIAL", "PLOTS", "COMMERCIAL", "CONSTRUCTION"];
const statuses = ["LIVE", "ONGOING", "COMPLETED", "UPCOMING", "SOLD_OUT"];

export const dynamic = "force-dynamic";

export default function AdminProjectEditPage() {
  const router = useRouter();
  const { id: projectId } = useParams<{ id: string }>();
  const [project, setProject] = useState<AdminProject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    fetch(`${window.location.origin}/api/admin/projects`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data) => {
        const foundProject = (data.projects as readonly AdminProject[]).find(
          (p) => p.id === projectId
        );
        setProject(foundProject ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project"
        );
      });
  }, [projectId]);

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId || !project) return;
    setLoading(true);
    setError(null);
    try {
      const onSubmitData = Object.fromEntries(
        new FormData(event.currentTarget).entries()
      ) as Record<string, unknown>;
      const updateResponse = await fetch(
        `${window.location.origin}/api/admin/projects`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...onSubmitData,
            id: projectId,
            slug:
              (onSubmitData.slug as string | undefined) ??
              (project.slug as string | undefined),
          }),
          credentials: "include",
        }
      );

      if (!updateResponse.ok) {
        const body = await updateResponse.json().catch(() => ({}));
        throw new Error(
          typeof body.error === "string"
            ? body.error
            : "Failed to update project"
        );
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-6">
          <svg
            className="h-4 w-4 text-red-600 flex-shrink-0 mr-2"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c-1.1 0-2-.9-2-2v-4c0-1.1-.9-2-2-2zm-8 2c0-1.1-.89-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.89 2 2 2h4c1.1 0-2-.9-2-2v-4zm-2 8c0 1.1.89 2 2 2h4c-1.1 0-2-.9-2-2v-4c0 1.1.89 2-2 2H6zM6 10c0-1.1.89-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.89 2-2-2H6v-4zm14-4h-4c0-1.1.9-2 2-2v4c0-1.1.9-2 2-2h4c1.1 0 2-.9 2-2v-4c0-1.1.9-2 2-2zm-4 6h-2v-2h2v2zM6 18h2v-2H6v2zm0-4h2v-2H6v2z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {!project && (
        <div className="py-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Project Not Found
          </h1>
          <p className="mt-2 text-stone-600">
            The project you requested could not be found.
          </p>
          <Button
            onClick={() => router.push("/admin/projects")}
            variant="secondary"
          >
            Back to Projects
          </Button>
        </div>
      )}

      {project && (
        <Section className="bg-[#faf8f5]">
          <Container className="max-w-2xl mx-auto space-y-8">
            <SectionHeading
              eyebrow="PROJECT CATALOGUE"
              title="Edit Project"
              description="Modify the project details"
            />

            {/* Back button */}
            <div className="mb-6">
              <Button
                onClick={() => router.push("/admin/projects")}
                variant="outline"
              >
                ← Back to Projects
              </Button>
            </div>

            {/* Form fields */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Basic project info */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Title
                </label>
                <div className="relative">
                  <input
                    name="title"
                    defaultValue={String(project?.title ?? "")}
                    type="text"
                    placeholder="e.g. Anugraham Nagar Phase 2"
                    className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Subtitle
                </label>
                <div className="relative">
                  <input
                    name="subtitle"
                    defaultValue={String(project?.subtitle ?? "")}
                    type="text"
                    placeholder="Optional subtitle"
                    className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    defaultValue={String(project?.category ?? "")}
                    className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    defaultValue={String(project?.status ?? "")}
                    className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="">Select status</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      name="location"
                      defaultValue={String(project?.location ?? "")}
                      type="text"
                      placeholder="e.g. Chennai"
                      className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Price (optional)
                  </label>
                  <div className="relative">
                    <input
                      name="pricing"
                      defaultValue={String(project?.pricing ?? "")}
                      type="text"
                      placeholder="e.g. ₹1.2 Cr onwards"
                      className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    defaultValue={String(project?.description ?? "")}
                    rows={3}
                    placeholder="Describe the project highlights and features..."
                    className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Highlights (optional)
                  </label>
                  <div className="relative">
                    <textarea
                      name="highlights"
                      defaultValue={String(project?.highlights ?? "")}
                      rows={2}
                      placeholder="e.g. Gated community, 24/7 security, Landscaped gardens"
                      className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Amenities (optional)
                  </label>
                  <div className="relative">
                    <textarea
                      name="amenities"
                      defaultValue={String(project?.amenities ?? "")}
                      rows={2}
                      placeholder="e.g. Swimming pool, Gym, Parking"
                      className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Overview (optional)
                </label>
                <div className="relative">
                  <textarea
                    name="overview"
                    defaultValue={String(project?.overview ?? "")}
                    rows={2}
                    placeholder="Brief overview for the project description..."
                    className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Published
                  </label>
                  <div className="relative">
                    <select
                      name="is_published"
                      defaultValue={
                        project?.is_published === true ? "true" : "false"
                      }
                      className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    >
                      <option value="false">Draft</option>
                      <option value="true">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Display Order
                  </label>
                  <div className="relative">
                    <input
                      defaultValue={String(project?.display_order ?? 0)}
                      type="number"
                      min="0"
                      name="display_order"
                      placeholder="0"
                      className="block w-full rounded-md border border-stone-300 pl-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Button type="submit" disabled={loading} className="w-full">
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
                    <span>Update Project</span>
                  )}
                </Button>
              </div>
            </form>
          </Container>
        </Section>
      )}
    </div>
  );
}