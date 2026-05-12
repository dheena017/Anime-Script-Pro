import React from 'react';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = React.useMemo(() => {
    if (!content) return [];
    return content.split('\n')
      .filter(line => line.startsWith('## '))
      .map(line => {
        // Strip markdown bold/italic syntax from the text for clean display
        const text = line.replace(/#/g, '').replace(/\*/g, '').replace(/_/g, '').trim();
        // Create an ID that matches what ReactMarkdown custom components will generate
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return { text, id };
      });
  }, [content]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="toc-container">
      <h4 className="toc-header">
        <List className="w-4 h-4 text-studio" /> Quick Navigation
      </h4>
      <ul className="toc-list">
        {headings.map((heading, i) => (
          <li key={i} className="toc-item">
            <div className="toc-dot" />
            <a 
              href={`#${heading.id}`}
              onClick={(e) => handleScroll(e, heading.id)}
              className="toc-link"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}




