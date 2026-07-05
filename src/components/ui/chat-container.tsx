"use client";

import React from "react";
import { StickToBottom } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";

export type ChatContainerRootProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerContentProps = {
    children: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type ChatContainerScrollAnchorProps = {
    className?: string;
    ref?: React.RefObject<HTMLDivElement | null>;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Scroll container that keeps the transcript pinned to the latest message while
 * still letting the user scroll up. Vendored from the prompt-kit chat set; the
 * stick-to-bottom behaviour comes from `use-stick-to-bottom`.
 */
function ChatContainerRoot({ children, className, ...props }: ChatContainerRootProps) {
    return (
        <StickToBottom className={cn("flex overflow-y-auto", className)} resize="smooth" initial="smooth" role="log" {...props}>
            {children}
        </StickToBottom>
    );
}

function ChatContainerContent({ children, className, ...props }: ChatContainerContentProps) {
    return (
        <StickToBottom.Content className={cn("flex w-full flex-col", className)} {...props}>
            {children}
        </StickToBottom.Content>
    );
}

function ChatContainerScrollAnchor({ className, ...props }: ChatContainerScrollAnchorProps) {
    return <div className={cn("h-px w-full shrink-0 scroll-mt-4", className)} aria-hidden="true" {...props} />;
}

export { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor };
