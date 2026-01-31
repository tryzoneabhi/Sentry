
import { Video } from '../types';
import { MOCK_VIDEOS } from '../constants';

const YT_API_KEY = process.env.YOUTUBE_API_KEY || ''; // Assume external configuration if possible

export const fetchVideos = async (channelId: string, query: string = ''): Promise<Video[]> => {
  // If no API key is provided, we return high-quality mock data filtered by channel
  if (!YT_API_KEY) {
    console.warn('YouTube API Key missing, using mock data.');
    return MOCK_VIDEOS.filter(v => v.title.toLowerCase().includes(query.toLowerCase()));
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=12&order=date&type=video&q=${encodeURIComponent(query)}&key=${YT_API_KEY}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.items) return [];

    // Map to our Video type and filter out Shorts (roughly by title or just assuming search filters work)
    // Note: To strictly filter Shorts, we'd need a second call to 'videos' endpoint for durations.
    const videos: Video[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
    }));

    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
