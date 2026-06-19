export interface SubscriptionData {
  message: string;
  code: string;
}

export interface SubscriptionResponse {
  status: string;
  data: SubscriptionData;
}
