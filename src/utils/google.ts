export interface FetchReviewsOptions {
  gmbLocationId: string;
  oauthToken: any;
}

export interface PostReplyOptions {
  gmbLocationId: string;
  reviewId: string;
  replyText: string;
  oauthToken: any;
}

export async function fetchReviews(options: FetchReviewsOptions) {
  console.log('Fetching Google reviews for', options.gmbLocationId);
  // TODO: call Google My Business API
  return [];
}

export async function postReply(options: PostReplyOptions) {
  console.log('Posting Google reply', options);
  // TODO: call Google My Business API
  return { success: true };
}
