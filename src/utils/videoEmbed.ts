/**
 * Detects whether a video URL is a YouTube/Vimeo link (which needs an
 * <iframe> embed) or a direct video file (playable in a native <video>
 * tag). Pasting a normal YouTube/Vimeo share link into a plain <video>
 * tag silently fails to play — this is what made "Featured Video" look
 * broken even though the URL saved correctly.
 */
export type VideoEmbedInfo =
  | { type: 'youtube' | 'vimeo' | 'instagram'; embedUrl: string }
  | { type: 'file'; url: string }
  | { type: 'none' };

export function getVideoEmbedInfo(url: string | null | undefined): VideoEmbedInfo {
  if (!url) return { type: 'none' };

  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  if (youtubeMatch) {
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  const instagramMatch = url.match(/instagram\.com\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  if (instagramMatch) {
    return { type: 'instagram', embedUrl: `https://www.instagram.com/${instagramMatch[1]}/${instagramMatch[2]}/embed` };
  }

  return { type: 'file', url };
}
