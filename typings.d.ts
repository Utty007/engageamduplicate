export type Post = {
  id: number;
  userid: number;
  title: string;
  description: string;
  social_platform: string;
  niche: string;
  link: string;
  engagement_no: number;
  engagement_no_reached: number;
  engagement_type: string;
  date_created: string;
  status: number;
}

export interface AllPost {
  id: string;
  name: string;
  username: string;
  img: StaticImageData;
  description: string;
  engagement_type: string;
  status: PostStatus;
  link?: string;
  engagementState: EngagementState;
  engagementTimestamp?: number;
  social_platform?: string;
  niche?: string;
  completed?: number;
  className?: string;
  user: {
    fullname: string;
    username: string;
    id: number;
  },
  engaged: number
}

export type UserData = {
  id: number;
  token: string;
  login: string;
  pass: string;
  firstname: string;
  lastname: string;
  nicename: string;
  email: string;
  phonenumber: string;
  balance: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  plan: string;
  pending_engagement: number;
  completed_engagement: number;
  profile_image: string;
  account_notification: number;
  product_update_notification: number;
  promotional_email_notification: number;
  tips_notification: number;
  survey_notification: number;
  url: string;
  registered: string;
  activation_key: string;
  status: number;
  display_name: string;
};

export type pointsProps = {
    id: number,
    point_no: number,
    amount: number,
}


export interface Engagement {
  id: number;
  userid: number;
  role: string;
  postid: number;
  date_created: string;
  status: number;
  status_code: string;
  status_engager: string;
  status_poster: string;
  flagged: number;
  engager_data: {
    id: number;
    username: string;
    fullname: string;
    instagram: string;
    tiktok: string;
    twitter: string;
  };
  post_data: {
    id: number;
    title: string;
    posterid: number;
    description: string;
    social_platform: string;
    engagement_type: string;
    engagement_no: number;
    engagement_no_reached: number;
  };
}

export interface EngagementResponse {
  success: boolean;
  message: string;
  data: Engagement[];
}
