type TabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const tabs = [
  { label: "Active Jobs", count: 12 },
  { label: "In Progress", count: 8 },
  { label: "Completed", count: 45 },
  { label: "Drafts", count: 3 },
  { label: "Closed", count: 10 },
];

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-8 md:gap-10">
        {tabs.map((tab) => {
          const isActive = tab.label === activeTab;

          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`border-b-2 pb-3 text-[20px] font-medium transition ${
                isActive
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}