import React from "react";
import { JournalPost } from "@/types/journal";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JournalCardProps {
  post: JournalPost;
  className?: string;
}

export function JournalCard({ post, className }: JournalCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-sm border border-[#e7e2d9] bg-[#faf8f5] transition-all hover:border-[#1e3a2b]",
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f2ece4]">
        <MediaPlaceholder label={post.title} className="h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#2e523c]">
            <span>{post.category}</span>
            <span className="text-[#645d57] font-normal">{post.publishedAt}</span>
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-[#1c1917] group-hover:text-[#1e3a2b]">
            {post.title}
          </h3>

          <p className="text-sm text-[#645d57] line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#e7e2d9]">
          <Button href={`/journal/${post.slug}`} variant="ghost" className="px-0 font-semibold text-[#1e3a2b]">
            Read Article &rarr;
          </Button>
        </div>
      </div>
    </article>
  );
}
