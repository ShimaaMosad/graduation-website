"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  UserCircle,
  BookOpen,
  MessageSquare,
  Clock,
  Shield,
  CreditCard,
  Bot,
  User,
  FileText,
  Rocket,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  Mail,
} from "lucide-react";
import {
  createSupportTicket,
  getSupportData,
  sendSupportMessage,
  ChatMessage,
  FAQ,
  SupportData,
  Topic,
} from  "@/src/lib/supportApi";

const quickTags = ["Getting Started", "Billing", "AI Matching", "Contracts"];
const faqTabs: ("All" | "Freelancers" | "Clients")[] = [
  "All",
  "Freelancers",
  "Clients",
];

export default function SupportPage() {
  const [data, setData] = useState<SupportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainSearch, setMainSearch] = useState("");
  const [faqTab, setFaqTab] = useState<"All" | "Freelancers" | "Clients">(
    "All"
  );
  const [openFaq, setOpenFaq] = useState(1);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [ticketMessage, setTicketMessage] = useState("");

  useEffect(() => {
    getSupportData().then((res) => {
      setData(res);
      setChatMessages(res.chatMessages);
      setLoading(false);
    });
  }, []);

  const filteredTopics = useMemo(() => {
    if (!data) return [];
    if (!mainSearch.trim()) return data.topics;

    const q = mainSearch.toLowerCase();

    return data.topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q)
    );
  }, [data, mainSearch]);

  const filteredFaqs = useMemo(() => {
    if (!data) return [];

    let result = data.faqs;

    if (faqTab !== "All") {
      result = result.filter(
        (faq) => faq.category === faqTab || faq.category === "All"
      );
    }

    if (mainSearch.trim()) {
      const q = mainSearch.toLowerCase();

      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q)
      );
    }

    return result;
  }, [data, faqTab, mainSearch]);

  async function handleSendMessage() {
    const value = chatInput.trim();
    if (!value) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: value,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    const botMessage = await sendSupportMessage(value);
    setChatMessages((prev) => [...prev, botMessage]);
  }

  async function handleCreateTicket() {
    const res = await createSupportTicket();
    setTicketMessage(`Ticket created successfully. Ticket ID: ${res.ticketId}`);
  }

  if (loading || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff7ff]">
        <p className="text-gray-500">Loading support center...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fff7ff] text-[#17151f]">
      <header className="sticky top-0 z-40 flex h-[64px] items-center justify-between border-b border-purple-100 bg-white px-7">
        <h1 className="text-[24px] font-black">MySite</h1>

        <nav className="flex items-center gap-9 text-[14px]">
          <button>Explore</button>
          <button>Jobs</button>
          <button>Messages</button>
          <button className="border-b-2 border-purple-700 pb-2 text-purple-700">
            Support
          </button>
        </nav>

        <div className="flex h-9 w-[190px] items-center gap-2 rounded-full bg-gray-100 px-4">
          <Search size={16} className="text-gray-500" />
          <input
            placeholder="Search..."
            value={mainSearch}
            className="w-full bg-transparent text-sm outline-none"
            onChange={(e) => setMainSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-5">
          <button>Login</button>
          <button className="rounded-lg bg-purple-700 px-5 py-2.5 font-semibold text-white">
            Post a Job
          </button>
          <Bell size={20} />
          <HelpCircle size={20} />
          <UserCircle size={25} />
        </div>
      </header>

      <section className="bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-600 px-6 pb-24 pt-24 text-center text-white">
        <h1 className="text-[58px] font-bold leading-tight">
          How can we help?
        </h1>

        <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-7 text-white/90">
          Search our knowledge base or browse categories below to find answers to
          your questions.
        </p>

        <div className="mx-auto mt-8 flex h-[58px] max-w-[720px] items-center gap-3 rounded-xl bg-white px-5 shadow-lg">
          <Search size={22} className="text-gray-600" />
          <input
            value={mainSearch}
            onChange={(e) => setMainSearch(e.target.value)}
            placeholder="Search for articles, topics, or issues..."
            className="w-full bg-transparent text-[16px] text-gray-800 outline-none"
          />
        </div>

        <div className="mt-7 flex justify-center gap-4">
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setMainSearch(tag)}
              className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm backdrop-blur transition hover:bg-white/20"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto -mt-8 w-[97%] max-w-[1720px] px-4">
        <div className="grid grid-cols-4 gap-6">
          {data.stats.map((stat) => {
            const Icon = getStatIcon(stat.icon);

            return (
              <div
                key={stat.id}
                className="rounded-xl border border-purple-100 bg-white p-7 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <Icon size={22} />
                </div>

                <h3 className="text-[23px] font-bold">{stat.value}</h3>
                <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-9">
          <h2 className="mb-5 text-[26px] font-bold">Popular Topics</h2>

          <div className="grid grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const Icon = getTopicIcon(topic.icon);

              return (
                <button
                  key={topic.id}
                  className="flex min-h-[110px] gap-5 rounded-xl border border-purple-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3 className="text-[19px] font-bold">{topic.title}</h3>
                    <p className="mt-2 text-[14px] leading-6 text-gray-600">
                      {topic.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-9 rounded-xl border border-purple-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[27px] font-bold">
              Frequently Asked Questions
            </h2>

            <div className="flex rounded-lg bg-purple-50 p-1">
              {faqTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFaqTab(tab)}
                  className={`rounded-md px-5 py-2 text-sm ${
                    faqTab === tab
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No FAQs match your search.
            </p>
          ) : (
            <div className="divide-y divide-purple-100">
              {filteredFaqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  open={openFaq === faq.id}
                  onClick={() => setOpenFaq(openFaq === faq.id ? 0 : faq.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-9">
          <h2 className="mb-5 text-[26px] font-bold">Still need help?</h2>

          {ticketMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-5 py-3 text-green-700">
              {ticketMessage}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            <HelpCard
              icon={<Bot size={26} />}
              title="Ask AI Concierge"
              description="Get instant, personalized answers to your questions 24/7."
              button="Chat Now"
              primary
              onClick={() => setChatOpen(true)}
            />

            <HelpCard
              icon={<Mail size={26} />}
              title="Submit a Ticket"
              description="For complex issues requiring human review. Usually replies in < 2 hrs."
              button="Create Ticket"
              onClick={handleCreateTicket}
            />

            <HelpCard
              icon={<MessageSquare size={26} />}
              title="Community Forum"
              description="Ask questions, share tips, and connect with other users."
              button="Browse Forums"
              onClick={() => alert("Opening community forum...")}
            />
          </div>
        </div>
      </section>

      {chatOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-[380px] overflow-hidden rounded-xl border border-purple-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-700 to-blue-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot size={19} />
              </div>
              <div>
                <h3 className="font-bold">AI Concierge</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>

            <button onClick={() => setChatOpen(false)}>
              <X size={21} />
            </button>
          </div>

          <div className="max-h-[340px] space-y-3 overflow-y-auto bg-[#fff7ff] p-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                    msg.sender === "user"
                      ? "bg-purple-700 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex h-14 items-center gap-2 border-t border-purple-100 bg-white px-3">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Type your message..."
              className="h-10 flex-1 rounded-full border border-purple-100 px-4 text-sm outline-none focus:border-purple-500"
            />

            <button
              onClick={handleSendMessage}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 text-white"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <footer className="mt-28 flex h-[110px] items-center justify-between border-t bg-white px-8">
        <h2 className="text-[20px] font-bold">MySite</h2>

        <div className="flex gap-8 text-sm text-gray-600">
          <button>Terms</button>
          <button>Privacy</button>
          <button>Cookies</button>
          <button>Security</button>
          <button>Contact</button>
        </div>

        <p className="text-sm text-gray-600">
          © 2024 MySite AI. Empowering the global workforce.
        </p>
      </footer>
    </main>
  );
}

function FAQItem({
  faq,
  open,
  onClick,
}: {
  faq: FAQ;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div>
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[18px] font-semibold">{faq.question}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <div className="pb-6 text-[15px] leading-7 text-gray-600">
          <p>{faq.answer}</p>
          <button className="mt-4 font-medium text-purple-700">
            View full tutorial →
          </button>
        </div>
      )}
    </div>
  );
}

function HelpCard({
  icon,
  title,
  description,
  button,
  primary,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  button: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-xl border border-purple-100 bg-white p-8 text-center shadow-sm">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl ${
          primary ? "bg-purple-700 text-white" : "bg-purple-100 text-purple-700"
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-[20px] font-bold">{title}</h3>
      <p className="mx-auto mt-3 min-h-[48px] max-w-[330px] text-sm leading-6 text-gray-600">
        {description}
      </p>

      <button
        onClick={onClick}
        className={`mt-5 h-11 w-full rounded-md text-sm font-semibold ${
          primary
            ? "bg-purple-700 text-white hover:bg-purple-800"
            : "border border-gray-400 bg-white hover:bg-gray-50"
        }`}
      >
        {button}
      </button>
    </div>
  );
}

function getStatIcon(icon: string) {
  if (icon === "articles") return BookOpen;
  if (icon === "community") return MessageSquare;
  if (icon === "time") return Clock;
  return Shield;
}

function getTopicIcon(icon: Topic["icon"]) {
  if (icon === "payment") return CreditCard;
  if (icon === "ai") return Bot;
  if (icon === "account") return User;
  if (icon === "contract") return FileText;
  if (icon === "security") return Shield;
  return Rocket;
}