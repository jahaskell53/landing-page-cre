"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";

export type MessageProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

/** Row wrapper for a single chat message. Vendored from the prompt-kit chat set. */
function Message({ children, className, ...props }: MessageProps) {
    return (
        <div className={cn("flex gap-3", className)} {...props}>
            {children}
        </div>
    );
}

export type MessageAvatarProps = {
    src: string;
    alt: string;
    fallback?: string;
    delayMs?: number;
    className?: string;
};

function MessageAvatar({ src, alt, fallback, delayMs, className }: MessageAvatarProps) {
    return (
        <Avatar className={cn("h-8 w-8 shrink-0", className)}>
            <AvatarImage src={src} alt={alt} />
            {fallback && <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>}
        </Avatar>
    );
}

export type MessageContentProps = {
    children: React.ReactNode;
    markdown?: boolean;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Message body. When `markdown` is set and the children is a string, it is
 * rendered through the shared Markdown component; otherwise the children are
 * rendered as-is (e.g. a plain-text user bubble).
 */
function MessageContent({ children, markdown = false, className, ...props }: MessageContentProps) {
    const classNames = cn("rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal", className);

    return markdown && typeof children === "string" ? (
        <Markdown className={classNames}>{children}</Markdown>
    ) : (
        <div className={classNames} {...props}>
            {children}
        </div>
    );
}

export type MessageActionsProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function MessageActions({ children, className, ...props }: MessageActionsProps) {
    return (
        <div className={cn("flex items-center gap-2 text-muted-foreground", className)} {...props}>
            {children}
        </div>
    );
}

export { Message, MessageAvatar, MessageContent, MessageActions };
