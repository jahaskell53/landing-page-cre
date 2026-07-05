import { Search } from "lucide-react";

// Shared browser-window chrome (traffic-light dots + URL pill) so landing-page
// previews read as screenshots of the real app rather than freestanding UI.
export function BrowserWindow({ url, children, className = "" }: { url: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`.trim()}>
            <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
                <span className="size-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                <span className="size-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                <span className="size-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="mx-auto flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
                    <Search className="size-3.5" />
                    {url}
                </div>
            </div>
            {children}
        </div>
    );
}
