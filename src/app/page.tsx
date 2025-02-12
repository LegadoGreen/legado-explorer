"use client";
import GlobeComponent from "./components/Globe";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <h1 className="text-white text-2xl mb-4">My Globe</h1>
      <GlobeComponent />
    </main>
  );
}
