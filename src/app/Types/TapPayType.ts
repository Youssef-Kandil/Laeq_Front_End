export type TapPayRequest = {
  amount: number;
  currency?: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  description?: string;
  redirect: { url: string }
  source:{
    id:string
  };
  charges: [
    {
      description: string
      amount: number
    }
  ];
};