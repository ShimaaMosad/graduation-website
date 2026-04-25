export type Conversation = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials?: string;
  orderId: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  archived?: boolean;
  activeOrder?: boolean;
};

export type ChatMessage = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
};

export type SharedFile = {
  id: string;
  name: string;
  date: string;
  type: "pdf" | "image" | "doc";
};

export type ActiveContext = {
  orderId: string;
  title: string;
  dueDate: string;
  progress: number;
  status: string;
};

export type ChatData = {
  conversation: Conversation;
  messages: ChatMessage[];
  files: SharedFile[];
  context: ActiveContext;
};

export type ApiResponse = {
  success: boolean;
  message: string;
};

/*
BACKEND READY

GET  /messages/conversations
GET  /messages/conversations/:id
POST /messages/conversations/:id/send
PATCH /messages/conversations/read-all
POST /messages/conversations/:id/schedule-meeting
POST /messages/conversations/:id/custom-offer
POST /messages/conversations/:id/report
*/

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    name: "Sara Ahmed",
    role: "Senior UX/UI Designer",
    avatar: "https://i.pravatar.cc/100?img=47",
    orderId: "ORD-4821",
    lastMessage: "I'll review the attached PDF an...",
    time: "10:42 AM",
    unread: 2,
    online: true,
    activeOrder: true,
  },
  {
    id: "conv-2",
    name: "Marcus Chen",
    role: "Frontend Developer",
    initials: "MC",
    orderId: "ORD-4899",
    lastMessage: "The new files look great. Can we hop on a quick call tomorrow?",
    time: "Yesterday",
    unread: 1,
    activeOrder: true,
  },
  {
    id: "conv-3",
    name: "David Rodriguez",
    role: "Backend Developer",
    avatar: "https://i.pravatar.cc/100?img=12",
    orderId: "ORD-4850",
    lastMessage: "Thanks, the final delivery was exactly what I needed.",
    time: "Mon",
    unread: 0,
  },
  {
    id: "conv-4",
    name: "Emily Watson",
    role: "Client",
    avatar: "https://i.pravatar.cc/100?img=32",
    orderId: "ORD-4801",
    lastMessage: "Are you available for a new project starting next week?",
    time: "Oct 12",
    unread: 0,
    online: true,
  },
  {
    id: "conv-5",
    name: "Tom Harris",
    role: "Client",
    avatar: "https://i.pravatar.cc/100?img=15",
    orderId: "ORD-4910",
    lastMessage: "I've uploaded the source files to the shared folder.",
    time: "Oct 10",
    unread: 2,
    online: true,
  },
  {
    id: "conv-6",
    name: "Anna Lee",
    role: "Client",
    initials: "AL",
    orderId: "ORD-4822",
    lastMessage: "Perfect, approved. Please proceed to the next milestone.",
    time: "Oct 08",
    unread: 0,
  },
  {
    id: "conv-7",
    name: "Chloe Martin",
    role: "Client",
    avatar: "https://i.pravatar.cc/100?img=44",
    orderId: "ORD-4772",
    lastMessage: "Can you send over the invoice for the last consulting session?",
    time: "Oct 05",
    unread: 0,
  },
  {
    id: "conv-8",
    name: "Robert Brown",
    role: "Client",
    initials: "RB",
    orderId: "ORD-4790",
    lastMessage: "Got it. I will review and get back to you by EOD.",
    time: "Sep 28",
    unread: 0,
    archived: true,
  },
];

export const mockChatData: ChatData = {
  conversation: mockConversations[0],
  context: {
    orderId: "ORD-4821",
    title: "Dashboard UI Design Redux",
    dueDate: "Oct 24, 2023",
    progress: 72,
    status: "In Progress",
  },
  files: [
    { id: "file-1", name: "Dashboard_Concept...", date: "Today, 10:15 AM", type: "pdf" },
    { id: "file-2", name: "Reference_Moodbo...", date: "Oct 18, 2:30 PM", type: "image" },
    { id: "file-3", name: "Project_Brief_Final...", date: "Oct 15, 9:00 AM", type: "doc" },
  ],
  messages: [
    {
      id: "msg-1",
      sender: "them",
      text: "Hi Alex, I've put together the initial sketches for the new dashboard layout based on our discussion yesterday.",
      time: "9:30 AM",
    },
    {
      id: "msg-2",
      sender: "me",
      text: "That was fast! I'm really looking forward to seeing them. Did you manage to incorporate the fluid grid concept we talked about?",
      time: "Read 9:45 AM",
    },
    {
      id: "msg-3",
      sender: "them",
      text: "Yes, absolutely. I've attached a PDF presentation that breaks down the grid logic alongside the visual concepts. Let me know your thoughts.",
      time: "10:15 AM",
      attachment: {
        name: "Dashboard_Concepts_v1.pdf",
        size: "2.4 MB",
        type: "PDF Document",
      },
    },
  ],
};

export async function getConversations(): Promise<Conversation[]> {
  // const res = await fetch("http://localhost:5000/api/messages/conversations");
  // if (!res.ok) throw new Error("Failed to fetch conversations");
  // return res.json();

  return mockConversations;
}

export async function getConversationById(id: string): Promise<ChatData> {
  // const res = await fetch(`http://localhost:5000/api/messages/conversations/${id}`);
  // if (!res.ok) throw new Error("Failed to fetch conversation");
  // return res.json();

  const conversation = mockConversations.find((item) => item.id === id) || mockConversations[0];
  return { ...mockChatData, conversation };
}

export async function sendMessage(conversationId: string, text: string) {
  // const res = await fetch(`http://localhost:5000/api/messages/conversations/${conversationId}/send`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ text }),
  // });
  // if (!res.ok) throw new Error("Failed to send message");
  // return res.json();

  return {
    success: true,
    message: {
      id: Date.now().toString(),
      sender: "me" as const,
      text,
      time: "Sent now",
    },
  };
}

export async function markAllMessagesRead(): Promise<ApiResponse> {
  // const res = await fetch("http://localhost:5000/api/messages/conversations/read-all", {
  //   method: "PATCH",
  // });
  // if (!res.ok) throw new Error("Failed to mark messages read");
  // return res.json();

  return { success: true, message: "All messages marked as read." };
}

export async function scheduleMeeting(conversationId: string): Promise<ApiResponse> {
  return { success: true, message: "Meeting scheduling opened." };
}

export async function sendCustomOffer(conversationId: string): Promise<ApiResponse> {
  return { success: true, message: "Custom offer flow opened." };
}

export async function reportConversation(conversationId: string): Promise<ApiResponse> {
  return { success: true, message: "Issue reported successfully." };
}