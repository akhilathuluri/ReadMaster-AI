import { FC } from 'react';
import { useEditorStore } from '../store/editorStore';

const templates = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    content: `# Blog Post Title\n\n## Introduction\n\nStart with a compelling introduction...\n\n## Main Content\n\nYour main points here...\n\n## Conclusion\n\nWrap up your post...`,
  },
  {
    id: 'technical-doc',
    name: 'Technical Documentation',
    content: `# Component Name\n\n## Overview\n\nBrief description...\n\n## Installation\n\n\`\`\`bash\nnpm install package-name\n\`\`\`\n\n## Usage\n\nCode examples...`,
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    content: `# Meeting Notes - [Date]\n\n## Attendees\n\n- Person 1\n- Person 2\n\n## Agenda\n\n1. Topic 1\n2. Topic 2\n\n## Action Items\n\n- [ ] Task 1\n- [ ] Task 2`,
  },
];

export const TemplateSelector: FC = () => {
  const { setContent, setCurrentTemplate } = useEditorStore();

  const handleSelectTemplate = (template: typeof templates[0]) => {
    setContent(template.content);
    setCurrentTemplate(template.id);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold mb-4">Templates</h2>
      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
          >
            <div className="text-sm font-medium">{template.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};