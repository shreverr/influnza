import { google, youtube_v3 } from 'googleapis';
import { logger } from '@logger';

export interface YouTubeClientConfig {
  apiKey?: string;
}

class YouTubeClient {
  static instance: YouTubeClient;
  youtube: youtube_v3.Youtube;
  config: YouTubeClientConfig;

  private constructor(config: YouTubeClientConfig) {
    if (!config.apiKey) {
      throw new Error('YouTube API key is required');
    }
    this.config = config;
    this.youtube = google.youtube('v3');
  }

  public static getInstance(config: YouTubeClientConfig): YouTubeClient {
    if (!YouTubeClient.instance) {
      YouTubeClient.instance = new YouTubeClient(config);
    }
    return YouTubeClient.instance;
  }

  public getAuth() {
    return this.config.apiKey;
  }

  public getYouTubeClient(): youtube_v3.Youtube {
    return this.youtube;
  }
}

export const youtubeClient = YouTubeClient.getInstance({
  apiKey: process.env.GOOGLE_API_KEY
});
