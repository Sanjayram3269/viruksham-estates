import React from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { journalPosts } from "@/lib/content";

interface JournalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (journalPosts.length === 0) {
    return [{ slug: "_placeholder" }];
  }
  return journalPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function JournalDetailPage({ params }: JournalDetailPageProps) {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <Section className="bg-[#faf8f5]">
      <Container>
        <article className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Eyebrow>{post.category}</Eyebrow>
              <span className="text-xs text-[#645d57]">•</span>
              <span className="text-xs text-[#645d57]">{post.publishedAt}</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#1c1917] sm:text-5xl leading-tight">
              {post.title}
            </h1>

            <p className="text-sm font-medium text-[#2e523c]">
              By {post.author.name} {post.author.role ? `(${post.author.role})` : ""}
            </p>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-[#f2ece4]">
            <MediaPlaceholder label={post.title} className="h-full w-full" />
          </div>

          <div className="prose prose-stone max-w-none text-base text-[#645d57] leading-relaxed space-y-4">
            <p className="text-lg font-medium text-[#1c1917]">{post.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </Container>
    </Section>
  );
}
