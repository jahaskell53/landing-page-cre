import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM for Brokers | OpenMidmarket",
};

export default function BrokersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
