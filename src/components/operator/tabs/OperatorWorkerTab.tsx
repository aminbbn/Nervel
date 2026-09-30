import React, { useState } from 'react';
import { useNervel } from '../../../context/NervelContext';
import { toast } from '../../../context/ToastContext';
import { toPersianDigits } from '../../../utils/formatters';
import {
  Server,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  Shield,
  Layers,
  Cpu,
  Clock,
  Play,
  RotateCcw,
} from 'lucide-react';

export const OperatorWorkerTab: React.FC = () => {
  const {
    operatorNode,
    onboardingSteps,
    toggleOperatorStatus,
    runDiagnosticPing,
    runSandboxTest,
    runSystemHealthCheck,
    simulateHeartbeatProbeFail,
    resetHeartbeatHealth,
  } = useNervel();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeInstallType, setActiveInstallType] = useState<'bash' | 'docker' | 'systemd'>('bash');
  const [isPinging, setIsPinging] = useState(false);

  const isOnline = operatorNode.status === 'online';
  const missedHeartbeats = operatorNode.missedHeartbeats;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.info('دستور در حافظه کپی شد');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRunPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      runDiagnosticPing();
      setIsPinging(false);
      toast.info('پایش ضربان ورکر انجام شد', `تاخیر: ${operatorNode.latencyMs} میلی‌ثانیه`);
    }, 600);
  };

  const bashInstallCmd = `curl -fsSL https://agent.nervel.net/install.sh | sudo bash -s -- --token=nrv_pair_8a92b49c01`;
  const systemdService = `[Unit]
Description=Nervel Worker Daemon
After=network.target docker.service

[Service]
Type=simple
User=nervel
ExecStart=/usr/local/bin/nervel-worker --config=/etc/nervel/worker.conf
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target`;

  const dockerRunCmd = `docker run -d \\
  --name nervel-worker \\
  --restart always \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  -e NERVEL_TOKEN="nrv_pair_8a92b49c01" \\
  -e CODEX_KEY="env:CODEX_API_KEY" \\
  nervel/worker-agent:v1.2.0`;

  return (
    <div className="space-y-8 animate-nervel-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">گره ورکر (Worker)</h1>
          <p className="text-sm text-[#71717A] mt-1.5">
            وضعیت اتصال زنده، چرخه راه‌اندازی، پایش پایا و سلامت محیط سندباکس ایزوله
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleRunPing}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs sm:text-sm bg-[#141418] hover:bg-[#1E1E24] text-[#D4D4D8] border border-[#27272A] transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>پایش پینگ زنده</span>
          </button>

          <button
            onClick={toggleOperatorStatus}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
              isOnline
                ? 'border-[#27272A] text-[#D4D4D8] hover:bg-[#18181D]'
                : 'border-[#7C3AED] bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-[#10B981]' : 'bg-[#71717A]'}`} />
            <span>{isOnline ? 'توقف موقت ورکر' : 'اتصال مجدد'}</span>
          </button>
        </div>
      </div>

      {/* Liveness Logic & Heartbeat Monitoring Grid */}
      <div className="p-5 rounded-lg bg-[#09090C] border border-[#18181C] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#141418]">
          <div className="flex items-center gap-2.5">
            <Activity className="h-4.5 w-4.5 text-[#7C3AED]" />
            <h3 className="text-base font-bold text-[#F4F4F5]">پایش ضربان و منطق لایونس (Liveness Health)</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#71717A]">پروتکل پایش:</span>
            <span className="text-[#D4D4D8]">دوره ۶۰ ثانیه‌ای · ۳ تلاش تا اعلام قطعی</span>
          </div>
        </div>

        {/* 3 Probe Attempt Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded bg-[#060608] border border-[#141418] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#71717A]">تلاش اول (Probe 1/3):</span>
              <span className={missedHeartbeats >= 1 ? 'text-[#EF4444] font-medium' : 'text-[#10B981] font-medium'}>
                {missedHeartbeats >= 1 ? 'ناموفق' : 'پاسخ دریافت شد'}
              </span>
            </div>
            <div className="w-full bg-[#18181C] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  missedHeartbeats >= 1 ? 'bg-[#EF4444] w-full' : 'bg-[#10B981] w-full'
                }`}
              />
            </div>
            <span className="text-xs text-[#71717A] block">درخواست ضربان پایا در ثانیه صفر</span>
          </div>

          <div className="p-3.5 rounded bg-[#060608] border border-[#141418] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#71717A]">تلاش دوم (Probe 2/3):</span>
              <span className={missedHeartbeats >= 2 ? 'text-[#EF4444] font-medium' : missedHeartbeats === 1 ? 'text-[#F59E0B]' : 'text-[#10B981] font-medium'}>
                {missedHeartbeats >= 2 ? 'ناموفق' : missedHeartbeats === 1 ? 'در حال انتظار' : 'سالم'}
              </span>
            </div>
            <div className="w-full bg-[#18181C] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  missedHeartbeats >= 2 ? 'bg-[#EF4444] w-full' : missedHeartbeats === 1 ? 'bg-[#F59E0B] w-full' : 'bg-[#10B981] w-full'
                }`}
              />
            </div>
            <span className="text-xs text-[#71717A] block">پایش مجدد در ثانیه ۶۰</span>
          </div>

          <div className="p-3.5 rounded bg-[#060608] border border-[#141418] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#71717A]">تلاش سوم و قطعی (Probe 3/3):</span>
              <span className={missedHeartbeats >= 3 ? 'text-[#EF4444] font-bold' : 'text-[#10B981] font-medium'}>
                {missedHeartbeats >= 3 ? 'ورکر از دسترس خارج شد' : 'سالم (پایش آنلاین)'}
              </span>
            </div>
            <div className="w-full bg-[#18181C] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  missedHeartbeats >= 3 ? 'bg-[#EF4444] w-full' : 'bg-[#10B981] w-full'
                }`}
              />
            </div>
            <span className="text-xs text-[#71717A] block">پس از ۱۸۰ ثانیه: بازتخصیص تسک بر اساس سیاست مشتری</span>
          </div>
        </div>

        {/* Liveness Diagnostics Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[#141418]">
          <div className="flex items-center gap-4 text-[#71717A]">
            <span>آخرین ضربان: <span className="text-[#F4F4F5]">{operatorNode.lastHeartbeat}</span></span>
            <span>·</span>
            <span>تأخیر رفت‌وبرگشت (RTT): <span className="text-[#10B981] font-latin tabular-nums font-medium" dir="ltr">{operatorNode.latencyMs} ms</span></span>
            <span>·</span>
            <span>نرخ پایداری: <span className="text-[#F4F4F5] tabular-nums">٪{toPersianDigits(operatorNode.uptimeRate)}</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={simulateHeartbeatProbeFail}
              className="text-xs text-[#A1A1AA] hover:text-[#EF4444] underline transition-colors cursor-pointer"
            >
              شبیه‌سازی افت پایش ({toPersianDigits(missedHeartbeats)}/۳)
            </button>
            {missedHeartbeats > 0 && (
              <button
                onClick={resetHeartbeatHealth}
                className="text-xs text-[#10B981] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>بازیابی اتصال سالم</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 9-Step Onboarding & Setup Lifecycle */}
      <div className="p-5 rounded-lg bg-[#09090C] border border-[#18181C] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#141418]">
          <div>
            <h3 className="text-base font-bold text-[#F4F4F5]">چرخه راه‌اندازی و اعتبارسنجی ورکر (Onboarding Lifecycle)</h3>
            <p className="text-xs text-[#71717A] mt-0.5">
              مراحل ۹ گانه از نصب باینری تا پیوستن نهایی به کلاستر محاسباتی
            </p>
          </div>
          <span className="text-xs text-[#10B981] font-medium flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>تمام مراحل با موفقیت تایید شده‌اند</span>
          </span>
        </div>

        {/* 9 Steps Timeline */}
        <div className="space-y-3">
          {onboardingSteps.map((step) => (
            <div
              key={step.id}
              className="flex items-start gap-3.5 p-3 rounded bg-[#060608] border border-[#141418] hover:border-[#1E1E24] transition-colors"
            >
              <div className="h-6 w-6 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold tabular-nums">
                {toPersianDigits(step.stepNumber)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-[#F4F4F5]">{step.title}</h4>
                  <span className="text-xs text-[#10B981] flex items-center gap-1 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                    <span>تکمیل‌شده</span>
                  </span>
                </div>
                <p className="text-sm text-[#71717A] mt-0.5 leading-relaxed">{step.description}</p>
                {step.details && (
                  <div className="text-xs text-[#71717A] font-latin mt-1" dir="ltr">
                    {step.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provider & Model Availability (Provider-Agnostic Design) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coding Provider Setup */}
        <div className="p-5 rounded-lg bg-[#09090C] border border-[#18181C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#141418]">
            <div className="flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-[#7C3AED]" />
              <h3 className="text-base font-bold text-[#F4F4F5]">پرووایدر کدنویسی (Coding Provider)</h3>
            </div>
            <span className="text-xs text-[#10B981] font-medium">متصل و فعال</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-[#060608] border border-[#141418]">
              <span className="text-[#71717A]">پرووایدر فعال فعلی:</span>
              <span className="text-[#F4F4F5] font-medium">{operatorNode.activeProvider}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#060608] border border-[#141418]">
              <span className="text-[#71717A]">طرح اشتراک و سهمیه:</span>
              <span className="text-[#D4D4D8] font-latin font-medium">{operatorNode.providerPlan}</span>
            </div>

            <div className="space-y-1.5 p-2.5 rounded bg-[#060608] border border-[#141418]">
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">سهمیه باقی‌مانده ساعتی:</span>
                <span className="text-[#10B981] font-medium tabular-nums">
                  ٪{toPersianDigits(operatorNode.remainingProviderQuotaPercent)}
                </span>
              </div>
              <div className="w-full bg-[#18181C] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#10B981] h-full"
                  style={{ width: `${operatorNode.remainingProviderQuotaPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[#71717A] block">مدل‌های آماده پذیرش در این گره:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {operatorNode.supportedModels.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded bg-[#141418] border border-[#222226] text-xs text-[#D4D4D8] font-latin font-medium"
                    dir="ltr"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Specs & Sandbox Check */}
        <div className="p-5 rounded-lg bg-[#09090C] border border-[#18181C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#141418]">
            <div className="flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-[#10B981]" />
              <h3 className="text-base font-bold text-[#F4F4F5]">مشخصات هاست و سندباکس ایزوله</h3>
            </div>
            <button
              onClick={() => {
                runSandboxTest();
                toast.success('تست سلامت سندباکس موفق بود', 'ایزولاسیون gVisor و پایش وضعیت کانتینرها تایید شد.');
              }}
              className="text-xs text-[#7C3AED] hover:text-[#9061F9] cursor-pointer"
            >
              تست سلامت سندباکس
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded bg-[#060608] border border-[#141418]">
              <span className="text-[#71717A] block">سیستم‌عامل سرور:</span>
              <span className="text-[#F4F4F5] block font-latin font-medium mt-0.5 truncate" dir="ltr">
                {operatorNode.os}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#060608] border border-[#141418]">
              <span className="text-[#71717A] block">موتور سندباکس:</span>
              <span className="text-[#10B981] block font-latin font-medium mt-0.5 truncate" dir="ltr">
                {operatorNode.isolationType}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#060608] border border-[#141418]">
              <span className="text-[#71717A] block">مشخصات سخت‌افزار:</span>
              <span className="text-[#F4F4F5] block mt-0.5 tabular-nums">
                {toPersianDigits(operatorNode.cpuCores)} هسته CPU · {toPersianDigits(operatorNode.memoryGb)} گیگابایت RAM
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#060608] border border-[#141418]">
              <span className="text-[#71717A] block">نام هاست ورکر:</span>
              <span className="text-[#A1A1AA] font-latin font-medium block mt-0.5 truncate" dir="ltr">
                {operatorNode.hostname}
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#060608] border border-[#141418] text-xs text-[#71717A] space-y-1">
            <span className="text-[#D4D4D8] font-medium block">تضمین امنیت کانتینر:</span>
            سندباکس داکر با هسته gVisor پیکربندی شده است. پس از کلون شدن مخزن مشتری، دسترسی شبکه بیرونی محدود شده و کلیه تغییرات فایل‌ها در فضای دیسک موقت tmpfs مانیتور می‌شوند.
          </div>
        </div>
      </div>

      {/* Copyable Installation Scripts */}
      <div className="p-5 rounded-lg bg-[#09090C] border border-[#18181C] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#141418]">
          <h3 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#71717A]" />
            <span>دستورات نصب و همگام‌سازی Agent در سرور جدید</span>
          </h3>

          <div className="flex items-center gap-1">
            {(['bash', 'docker', 'systemd'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveInstallType(type)}
                className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeInstallType === type
                    ? 'bg-[#18181D] text-[#F4F4F5] font-medium'
                    : 'text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                {type === 'bash' ? 'اسکریپت شل' : type === 'docker' ? 'کانتینر Docker' : 'فایل systemd'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre
            className="p-4 rounded bg-[#040405] border border-[#141418] font-code text-xs text-[#A1A1AA] overflow-x-auto leading-relaxed"
            dir="ltr"
          >
            {activeInstallType === 'bash' && bashInstallCmd}
            {activeInstallType === 'docker' && dockerRunCmd}
            {activeInstallType === 'systemd' && systemdService}
          </pre>

          <button
            onClick={() =>
              handleCopy(
                activeInstallType === 'bash'
                  ? bashInstallCmd
                  : activeInstallType === 'docker'
                  ? dockerRunCmd
                  : systemdService,
                'code_copy'
              )
            }
            className="absolute top-3 right-3 p-1.5 rounded bg-[#18181D] hover:bg-[#222228] text-[#71717A] hover:text-[#F4F4F5] transition-colors cursor-pointer"
            aria-label="کپی دستور"
          >
            {copiedCode === 'code_copy' ? (
              <Check className="h-3.5 w-3.5 text-[#10B981]" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
