import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Quiz Display Garden</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Play</h2>
            <p className="text-gray-600 mb-4">
              Start playing the quiz and test your knowledge.
            </p>
            <Link to="/play" className="text-purple-600 hover:text-purple-800">
              Play Now
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Search</h2>
            <p className="text-gray-600 mb-4">
              Search for specific questions or topics.
            </p>
            <Link
              to="/search"
              className="text-purple-600 hover:text-purple-800"
            >
              Search
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Quiz Demo</h2>
            <p className="text-gray-600 mb-4">See our new question and answer display system in action</p>
            <Link to="/quiz-demo" className="text-purple-600 hover:text-purple-800">
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
