import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { getStaggerStyle } from '../../utils/motion';
import { Clock, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { activities, navigateToTask } = useNervel();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = activities.filter((act) => {
    if (filterCategory === 'all') return true;
    return act.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header: 22-24px heading */}
      <div
        style={getStaggerStyle(0)}
        className="animate-nervel-enter flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#17171A]"
      >
        <div>
          <h2 className="text-[22px] sm:text-2xl font-bold text-[#F4F4F5] leading-tight">
            رویدادها و ممیزی سامانه
          </h2>
          <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
            دفتر وقایع سیستم، ثبت تغییر وضعیت تسک‌ها، تراکنش‌ها و پایش ضربان ورکرها
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-sm">
          {[
            { id: 'all', label: 'همه وقایع' },
            { id: 'task', label: 'تسک‌ها' },
            { id: 'wallet', label: 'مالی' },
            { id: 'worker', label: 'ورکرها' },
            { id: 'system', label: 'سیستم' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded text-sm transition-colors whitespace-nowrap font-medium ${
                filterCategory === cat.id
                  ? 'bg-[#17171A] text-[#F4F4F5]'
                  : 'text-[#71717A] hover:text-[#D4D4D8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit List - Flat border, clean layout */}
      <div style={getStaggerStyle(1)} className="animate-nervel-enter border border-[#17171A] rounded overflow-hidden">
        <div className="divide-y divide-[#17171A]">
          {filtered.map((item) => {
            let icon = <Clock className="h-4.5 w-4.5 text-[#71717A]" />;
            if (item.category === 'wallet') icon = <CheckCircle2 className="h-4.5 w-4.5 text-[#71717A]" />;
            if (item.category === 'system') icon = <AlertTriangle className="h-4.5 w-4.5 text-[#F59E0B]" />;
            if (item.category === 'worker') icon = <Terminal className="h-4.5 w-4.5 text-[#71717A]" />;

            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 sm:p-5 hover:bg-[#080808] transition-colors"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center mt-0.5">
                  {icon}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-base text-[#F4F4F5] truncate">{item.title}</span>
                    <span className="text-xs text-[#71717A] shrink-0">{item.timestamp}</span>
                  </div>

                  <p className="text-[#A1A1AA] text-sm sm:text-base leading-relaxed">{item.description}</p>

                  {item.taskId && (
                    <button
                      onClick={() => navigateToTask(item.taskId!)}
                      className="inline-block text-xs sm:text-sm text-[#7C3AED] hover:underline pt-0.5 font-medium"
                      dir="ltr"
                    >
                      تسک: {item.taskId} ←
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
