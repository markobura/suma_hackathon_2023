import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <div className="text-center bg-gray-50 text-gray-800 py-24 px-6">
      <h1 className="text-5xl md:text-6xl xl:text-6xl font-bold tracking-tight mb-12">
        Revolutionize your coding education with <br />
        <span className="text-blue-700"> Code grAIder</span>'s AI-powered code grading
      </h1>
      <Link
        className="inline-block px-7 py-3 mr-2 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        role="button"
        href="/subject/1"
      >
        Get started
      </Link>
    </div>
  );
}
