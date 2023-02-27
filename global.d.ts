declare module 'scroll-into-view';

type Message = {
  content: string;
  author: string;
  timestamp?: string;
  isAI: boolean;
  id?: number;
  chat_id: number;
};

interface Character {
  id: number;
  created_at: Date;
  name: string;
  avatar?: any;
  description?: any;
  context: string;
  gender: string;
  age: number;
  created_by: string;
}


interface Chat {
  ai: Character;
  chat_id: number;
  last_message: Message;
  messages_count: number;
}

interface ChatRaw {
  ai_id: number;
  created_at: Date;
  id: number;
  user_id: string;
}