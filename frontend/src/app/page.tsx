import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind is working!</h1>
      <p className="text-gray-700">You can now build your Mood-Based Book Recommender UI.</p>
    </div>


  );
}
