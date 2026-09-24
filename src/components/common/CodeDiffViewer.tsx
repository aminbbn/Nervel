import React from 'react';
import { ChangedFile } from '../../types';
import { FileCode } from 'lucide-react';

interface CodeDiffViewerProps {
  files: ChangedFile[];
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ files }) => {
  const [selectedFileIndex, setSelectedFileIndex] = React.useState<number>(0);

  if (!files || files.length === 0) {
    return (
      <div className="rounded border border-[#17171A] p-8 text-center text-sm text-[#71717A]">
        هیچ فایلی تغییر نیافته است.
      </div>
    );
  }

  const activeFile = files[selectedFileIndex] || files[0];

  return (
    <div className="rounded border border-[#17171A] overflow-hidden">
      {/* Header bar with file selector tabs */}
      <div className="flex items-center justify-between border-b border-[#17171A] bg-[#060607] px-4 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-sm py-0.5">
          {files.map((file, idx) => {
            const isSelected = idx === selectedFileIndex;
            return (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIndex(idx)}
                className={`flex items-center gap-2 rounded px-3 py-1.5 transition-colors whitespace-nowrap text-sm ${
                  isSelected
                    ? 'bg-[#17171A] text-[#F4F4F5] font-medium'
                    : 'text-[#71717A] hover:text-[#F4F4F5]'
                }`}
              >
                <FileCode className="h-4 w-4 text-[#71717A]" />
                <span dir="ltr">{file.filename}</span>
                <span className="flex items-center gap-1 text-xs tabular-nums">
                  <span className="text-[#10B981]">+{file.additions}</span>
                  {file.deletions > 0 && <span className="text-[#EF4444]">-{file.deletions}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code diff view - genuine code uses font-code */}
      <div className="p-0 bg-[#020202] font-code text-[13px] overflow-x-auto" dir="ltr">
        {activeFile.diffContent ? (
          <div className="py-2.5">
            {activeFile.diffContent.split('\n').map((line, i) => {
              const isAdded = line.startsWith('+');
              const isRemoved = line.startsWith('-');
              const isHeader = line.startsWith('@@');

              let rowClass = 'px-4 py-0.5 leading-relaxed ';
              if (isAdded) rowClass += 'bg-[#10B981]/10 text-[#34D399] border-l-2 border-[#10B981]';
              else if (isRemoved) rowClass += 'bg-[#EF4444]/10 text-[#F87171] border-l-2 border-[#EF4444]';
              else if (isHeader) rowClass += 'bg-[#17171A] text-[#818CF8] font-semibold';
              else rowClass += 'text-[#A1A1AA] hover:bg-[#0A0A0C]';

              return (
                <div key={i} className={`flex items-start ${rowClass}`}>
                  <span className="w-10 select-none text-xs text-[#52525B] text-right pr-3 font-mono">
                    {i + 1}
                  </span>
                  <pre className="font-code whitespace-pre-wrap break-all flex-1 m-0 text-[13px]">
                    {line}
                  </pre>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-10 text-center text-[#71717A] text-sm">
            <span>تغییرات فایل ({activeFile.additions}+ خط اضافه، {activeFile.deletions}- خط حذف) در بسته خروجی Patch موجود است.</span>
          </div>
        )}
      </div>
    </div>
  );
};
