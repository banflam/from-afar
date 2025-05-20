export interface Letter {
  letter_id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  deliveryTime: string;
  isRead: boolean;
  readAt?: string;
}
