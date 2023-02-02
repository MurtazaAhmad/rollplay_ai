type Message = {
  content: string;
  author: string;
  created_at?: Date;
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
