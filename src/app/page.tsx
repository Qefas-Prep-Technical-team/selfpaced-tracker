import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="p-10">
        <h1 className="text-9xl font-bold text-bg-green">Welcome to Self-Paced Tracker</h1>
        <p className="mt-4 text-lg">
          Track your learning progress at your own pace.
        </p>
      </div>
    </div>
  );
}
