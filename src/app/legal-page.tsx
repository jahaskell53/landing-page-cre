import { marked } from "marked";
import { SiteFooter } from "./welcome/site-footer";
import { SiteHeader } from "./welcome/site-header";

export function LegalPage({ markdown }: { markdown: string }) {
    const html = marked.parse(markdown, { async: false, gfm: true }) as string;

    return (
        <div className="min-h-dvh bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <SiteHeader />
            <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <article
                    className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-a:text-blue-700 dark:prose-a:text-blue-400 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold dark:[&_th]:border-gray-800 dark:[&_th]:bg-gray-900 [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 dark:[&_td]:border-gray-800"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </main>
            <SiteFooter />
        </div>
    );
}
