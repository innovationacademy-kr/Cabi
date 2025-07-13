import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full py-10 px-6 bg-gray-900 text-white flex flex-col items-center justify-center">
      <nav className="flex flex-wrap justify-center gap-8 mb-8">
        <Link
          to="/presentations/about"
          className="text-sm font-medium uppercase tracking-wider hover:text-blue-200 transition-colors duration-200"
        >
          About Us
        </Link>
        <Link
          to="/presentations/community"
          className="text-sm font-medium uppercase tracking-wider hover:text-blue-200 transition-colors duration-200"
        >
          Community Rules
        </Link>
        <a
          href="https://42born2code.slack.com/?redir=%2Farchives%2FC02V6GE8LD7%3Fname%3DC02V6GE8LD7"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium flex items-center gap-1 uppercase tracking-wider hover:text-blue-200 transition-colors duration-200"
        >
          Contact Us
          <ExternalLink className="w-4 h-4" />
        </a>
        <a
          href="https://www.42seoul.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium flex items-center gap-1 uppercase tracking-wider hover:text-blue-200 transition-colors duration-200"
        >
          42 Seoul
          <ExternalLink className="w-4 h-4" />
        </a>
        <a
          href="https://ams.codyssey.kr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium flex items-center gap-1 uppercase tracking-wider hover:text-blue-200 transition-colors duration-200"
        >
          Codyssey
          <ExternalLink className="w-4 h-4" />
        </a>
      </nav>
      <a
        href="https://profile.intra.42.fr/legal/terms/5"
        className="text-xs opacity-75 hover:opacity-100 transition-opacity duration-200"
      >
        Privacy Policy
      </a>
    </footer>
  );
}
