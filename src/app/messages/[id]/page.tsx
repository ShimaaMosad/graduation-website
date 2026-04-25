"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  BarChart3, Bell, Briefcase, Calendar, Download, Edit, FileText,
  Grid2X2, HelpCircle, ImageIcon, Mail, MessageSquare, MoreVertical,
  Paperclip, Phone, Search, Send, Settings, ShoppingCart, Smile,
  Star, User, Video,
} from "lucide-react";

import {
  ChatData,
  ChatMessage,
  Conversation,
  getConversationById,
  getConversations,
  reportConversation,
  scheduleMeeting,
  sendCustomOffer,
  sendMessage,
} from "@/src/lib/messages-api";


function Sidebar() {
  return (
    <aside className="hidden h-screen w-[280px] shrink-0 border-r border-violet-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-[70px] items-center border-b border-violet-100 px-7">
        <Link href="/" className="text-[28px] font-bold text-violet-700">MySite</Link>
      </div>

      <div className="border-b border-violet-100 px-7 py-5">
        <div className="flex items-center gap-4">
          <img src="https://i.pravatar.cc/100?img=13" className="h-12 w-12 rounded-full" />
          <div>
            <h3 className="font-bold">Alex Johnson</h3>
            <p className="text-sm text-slate-500">Professional Seller</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5 text-[16px]">
        <Link href="/" className="flex items-center gap-4 rounded-xl px-5 py-3.5 text-slate-600"><Grid2X2 className="h-5 w-5" /> Dashboard</Link>
        <Link href="/gigs" className="flex items-center gap-4 rounded-xl px-5 py-3.5 text-slate-600"><Briefcase className="h-5 w-5" /> My Gigs</Link>
        <Link href="/orders" className="flex items-center gap-4 rounded-xl px-5 py-3.5 text-slate-600"><ShoppingCart className="h-5 w-5" /> Orders</Link>
        <Link href="/messages" className="flex items-center gap-4 rounded-xl border-l-4 border-violet-700 bg-violet-100 px-5 py-3.5 font-semibold text-violet-700"><MessageSquare className="h-5 w-5" /> Messages</Link>
        <Link href="/gigs/modern-logo-brand/analytics" className="flex items-center gap-4 rounded-xl px-5 py-3.5 text-slate-600"><BarChart3 className="h-5 w-5" /> Earnings</Link>
        <Link href="/profile" className="flex items-center gap-4 rounded-xl px-5 py-3.5 text-slate-600"><User className="h-5 w-5" /> Profile</Link>
        <Link href="/settings" className="flex items-center gap-4 rounded-xl px-5 py-3.5 text-slate-600"><Settings className="h-5 w-5" /> Settings</Link>
      </nav>

      <div className="border-t border-violet-100 p-6">
        <button className="mb-5 w-full rounded-lg border border-slate-300 py-3">Switch to Buying</button>
        <div className="flex items-center gap-4 text-slate-500">
          <HelpCircle className="h-5 w-5" /> Help & Support
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-violet-200 bg-white px-7">
      <div className="flex h-12 w-[270px] items-center gap-3 rounded-full bg-violet-100 px-5">
        <Search className="h-5 w-5 text-slate-500" />
        <input placeholder="Search..." className="w-full bg-transparent text-sm outline-none" />
      </div>

      <nav className="hidden items-center gap-10 text-[15px] md:flex">
        <Link href="/gigs">Browse</Link>
        <Link href="#">Explore</Link>
        <Link href="#">Community</Link>
      </nav>

      <div className="flex items-center gap-5">
        <Bell className="h-5 w-5 text-slate-600" />
        <Mail className="h-5 w-5 text-slate-600" />
        <Link href="/freelancer/create-gig" className="rounded-lg border border-violet-600 px-5 py-3 text-violet-700">Post a Gig</Link>
        <img src="https://i.pravatar.cc/100?img=13" className="h-9 w-9 rounded-full" />
      </div>
    </header>
  );
}

function Avatar({ conversation }: { conversation: Conversation }) {
  if (conversation.avatar) {
    return (
      <div className="relative shrink-0">
        <img src={conversation.avatar} className="h-12 w-12 rounded-full object-cover" />
        {conversation.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />}
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold">
      {conversation.initials}
    </div>
  );
}

export default function MessageDetailsPage() {
  const params = useParams();
  const id = String(params.id);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getConversations().then(setConversations);
  }, []);

  useEffect(() => {
    getConversationById(id).then(setChatData);
  }, [id]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [conversations, search]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatData) return;

    const res = await sendMessage(id, messageText);

    if (res.success) {
      setChatData({ ...chatData, messages: [...chatData.messages, res.message] });
      setMessageText("");
    }
  };

  const handleAction = async (type: "meeting" | "offer" | "report") => {
    let res;
    if (type === "meeting") res = await scheduleMeeting(id);
    if (type === "offer") res = await sendCustomOffer(id);
    if (type === "report") res = await reportConversation(id);
    if (res?.success) setNotice(res.message);
  };

  if (!chatData) return <main className="p-10">Loading...</main>;

  return (
    <main className="flex h-screen overflow-hidden bg-[#fcf5ff] text-slate-950">
      <Sidebar />

      <section className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        {notice && (
          <div className="mx-5 mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-[360px_minmax(520px,1fr)_310px] overflow-hidden">
          <aside className="min-h-0 overflow-y-auto border-r border-violet-200 bg-white">
            <div className="flex items-center justify-between px-5 py-6">
              <h1 className="text-[24px] font-bold">Messages</h1>
              <Edit className="h-5 w-5 text-slate-500" />
            </div>

            <div className="px-5 pb-5">
              <div className="flex h-12 items-center gap-3 rounded-lg border border-violet-200 px-4">
                <Search className="h-5 w-5 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations"
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {filteredConversations.map((conversation) => {
              const active = id === conversation.id;

              return (
                <Link
                  href={`/messages/${conversation.id}`}
                  key={conversation.id}
                  className={`flex w-full items-center gap-4 border-l-4 px-5 py-4 text-left ${
                    active ? "border-violet-700 bg-violet-100" : "border-transparent bg-white"
                  }`}
                >
                  <Avatar conversation={conversation} />

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3">
                      <h3 className="truncate font-bold">{conversation.name}</h3>
                      <span className="text-sm text-violet-700">{conversation.time}</span>
                    </div>
                    <p className="mt-2 truncate text-sm text-slate-500">{conversation.lastMessage}</p>
                  </div>
                </Link>
              );
            })}
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col border-r border-violet-200 bg-[#fcf5ff]">
            <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-violet-200 bg-white px-7">
              <div className="flex items-center gap-4">
                <Avatar conversation={chatData.conversation} />
                <div>
                  <h2 className="font-bold">{chatData.conversation.name}</h2>
                  <p className="text-sm text-slate-500">
                    <span className="text-emerald-500">● Online</span> · Local time 10:45 AM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-slate-600">
                <Phone className="h-5 w-5" />
                <Video className="h-5 w-5" />
                <MoreVertical className="h-5 w-5" />
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-8 py-6">
              <div className="mx-auto w-fit rounded-full bg-violet-100 px-5 py-2 text-sm">
                Today, 9:30 AM
              </div>

              {chatData.messages.map((message: ChatMessage) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[430px]">
                    <div
                      className={`rounded-2xl px-6 py-5 text-[16px] leading-7 shadow-sm ${
                        message.sender === "me"
                          ? "rounded-br-none bg-violet-700 text-white"
                          : "rounded-bl-none bg-white text-slate-900"
                      }`}
                    >
                      <p>{message.text}</p>

                      {message.attachment && (
                        <button className="mt-5 flex w-full items-center justify-between rounded-xl border border-violet-200 bg-white p-4 text-left text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-3 text-red-600">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold">{message.attachment.name}</p>
                              <p className="text-sm text-slate-500">
                                {message.attachment.size} • {message.attachment.type}
                              </p>
                            </div>
                          </div>
                          <Download className="h-5 w-5 text-slate-500" />
                        </button>
                      )}
                    </div>

                    <p className={`mt-2 text-sm text-slate-500 ${message.sender === "me" ? "text-right" : "text-left"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 border-t border-violet-200 bg-white p-5">
              <div className="rounded-xl border border-violet-300 bg-[#fcf5ff] p-4">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="h-12 w-full resize-none bg-transparent text-[16px] outline-none"
                />

                <div className="flex items-center justify-between border-t border-violet-100 pt-3">
                  <div className="flex items-center gap-5 text-slate-500">
                    <Paperclip className="h-5 w-5" />
                    <b>B</b>
                    <Smile className="h-5 w-5" />
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="rounded-lg bg-violet-700 px-8 py-2.5 font-semibold text-white shadow-md disabled:opacity-50"
                  >
                    Send <Send className="ml-1 inline h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="min-h-0 overflow-y-auto bg-white px-7 py-7">
            <h2 className="mb-6 text-[22px] font-bold">Active Context</h2>

            <Link href={`/orders/${chatData.context.orderId}/active`} className="block rounded-xl border border-violet-200 border-l-4 border-l-violet-700 bg-violet-50 p-5">
              <div className="mb-3 flex justify-between">
                <span className="rounded bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                  #{chatData.context.orderId}
                </span>
                <span>↗</span>
              </div>
              <h3 className="text-[18px] font-bold">{chatData.context.title}</h3>
              <p className="mt-2 text-sm text-slate-500">Due: {chatData.context.dueDate}</p>
              <div className="mt-5 h-2 rounded-full bg-violet-200">
                <div className="h-2 rounded-full bg-violet-700" style={{ width: `${chatData.context.progress}%` }} />
              </div>
              <p className="mt-2 text-right text-sm">{chatData.context.status}</p>
            </Link>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[20px] font-bold">Shared Files</h2>
                <button className="text-sm text-violet-700">View All</button>
              </div>

              <div className="space-y-4">
                {chatData.files.map((file) => (
                  <button key={file.id} className="flex w-full items-center gap-4 text-left">
                    <div className={`rounded-lg p-3 ${
                      file.type === "pdf" ? "bg-red-100 text-red-600" :
                      file.type === "image" ? "bg-blue-100 text-blue-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {file.type === "image" ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-[20px] font-bold">Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => handleAction("meeting")} className="w-full rounded-lg border border-violet-200 py-3">
                  <Calendar className="mr-2 inline h-4 w-4" /> Schedule Meeting
                </button>
                <button onClick={() => handleAction("offer")} className="w-full rounded-lg border border-violet-200 py-3">
                  <FileText className="mr-2 inline h-4 w-4" /> Send Custom Offer
                </button>
                <button onClick={() => handleAction("report")} className="w-full rounded-lg bg-violet-200 py-3">
                  Report Issue
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-violet-100 pt-7 text-center">
              <img src={chatData.conversation.avatar} className="mx-auto h-20 w-20 rounded-full object-cover" />
              <h3 className="mt-4 text-[18px] font-bold">{chatData.conversation.name}</h3>
              <p className="text-sm text-slate-500">{chatData.conversation.role}</p>

              <div className="mx-auto mt-4 w-fit rounded-full border border-violet-200 px-4 py-2 text-sm">
                <Star className="mr-1 inline h-4 w-4 fill-orange-400 text-orange-400" />
                4.9 (124 reviews)
              </div>

              <div className="mx-auto mt-4 w-fit rounded bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                Pro Verified Member
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}