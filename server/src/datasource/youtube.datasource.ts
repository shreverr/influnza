import { logger } from '@logger';
import { youtube_v3 } from 'googleapis';
import { youtubeClient } from '../config/youtubeClient';

export async function getVideoDetails(videoId: string): Promise<youtube_v3.Schema$Video | null> {
  try {
    const response = await youtubeClient.getYouTubeClient().videos.list({
      auth: youtubeClient.getAuth(),
      part: ['snippet', 'statistics', 'contentDetails'],
      id: [videoId]
    });

    return response.data.items?.[0] || null;
  } catch (error) {
    logger.error(`Error fetching video details for ${videoId}:`, error);
    throw error;
  }
}

export async function getChannelDetails(channelId: string): Promise<youtube_v3.Schema$Channel | null> {
  try {
    const response = await youtubeClient.getYouTubeClient().channels.list({
      auth: youtubeClient.getAuth(),
      part: ['snippet', 'statistics', 'contentDetails'],
      id: [channelId]
    });

    return response.data.items?.[0] || null;
  } catch (error) {
    logger.error(`Error fetching channel details for ${channelId}:`, error);
    throw error;
  }
}

export async function getPlaylistItems(playlistId: string, options?: {
  maxResults?: number;
  pageToken?: string;
}): Promise<{
  items: youtube_v3.Schema$PlaylistItem[];
  nextPageToken?: string | null;
}> {
  try {
    const response = await youtubeClient.getYouTubeClient().playlistItems.list({
      auth: youtubeClient.getAuth(),
      part: ['snippet', 'contentDetails'],
      playlistId: playlistId,
      maxResults: options?.maxResults || 50,
      pageToken: options?.pageToken
    });

    return {
      items: response.data.items || [],
      nextPageToken: response.data.nextPageToken
    };
  } catch (error) {
    logger.error(`Error fetching playlist items for ${playlistId}:`, error);
    throw error;
  }
}

export async function searchVideos(options: {
  channelId?: string;
  query?: string;
  maxResults?: number;
  pageToken?: string;
  publishedAfter?: Date;
  publishedBefore?: Date;
  type?: ('video' | 'playlist' | 'channel')[];
}): Promise<{
  items: youtube_v3.Schema$SearchResult[];
  nextPageToken?: string | null;
}> {
  try {
    const response = await youtubeClient.getYouTubeClient().search.list({
      auth: youtubeClient.getAuth(),
      part: ['id', 'snippet'],
      channelId: options.channelId,
      q: options.query,
      maxResults: options.maxResults || 50,
      pageToken: options.pageToken,
      publishedAfter: options.publishedAfter?.toISOString(),
      publishedBefore: options.publishedBefore?.toISOString(),
      type: options.type || ['video']
    });

    return {
      items: response.data.items || [],
      nextPageToken: response.data.nextPageToken
    };
  } catch (error) {
    logger.error('Error searching videos:', error);
    throw error;
  }
}

export async function getCommentThreads(options: {
  videoId: string;
  maxResults?: number;
  pageToken?: string;
  order?: 'time' | 'relevance';
}): Promise<{
  items: youtube_v3.Schema$CommentThread[];
  nextPageToken?: string | null;
}> {
  try {
    const response = await youtubeClient.getYouTubeClient().commentThreads.list({
      auth: youtubeClient.getAuth(),
      part: ['snippet', 'replies'],
      videoId: options.videoId,
      maxResults: options.maxResults || 100,
      pageToken: options.pageToken,
      order: options.order
    });

    return {
      items: response.data.items || [],
      nextPageToken: response.data.nextPageToken
    };
  } catch (error) {
    logger.error(`Error fetching comment threads for video ${options.videoId}:`, error);
    throw error;
  }
}
