import { useState } from "react";
import axios from "axios";

export default function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("formal");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });
      setResponse(res.data);
    } catch (error) {
      setResponse("❌ Error: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">✉️ AI Email Generator</h1>

        <textarea
          className="w-full border rounded-lg p-3 mb-3"
          rows="5"
          placeholder="Enter your email content..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />

        <select
          className="w-full border rounded-lg p-3 mb-3"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
        </select>

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Reply"}
        </button>

        {response && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h2 className="font-semibold mb-2">AI Reply:</h2>
            <p className="whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
