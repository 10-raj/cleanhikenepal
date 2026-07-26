import { useState, useEffect } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { supabase } from '../../services/supabase';

// Google's short links (maps.app.goo.gl, goo.gl/maps) redirect rather than
// serve embeddable content directly — Google blocks these from working
// inside an iframe. For these, we skip embedding entirely and show a
// clickable "Open in Google Maps" card that links straight to the URL
// the admin set, opening in a new tab.
function isShortLink(url: string): boolean {
  return /maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url);
}

function toEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('output=embed')) return url;
  if (url.includes('google.com/maps')) {
    if (url.includes('q=') && !url.includes('output=embed')) {
      return url + (url.includes('?') ? '&' : '?') + 'output=embed';
    }
    const placeMatch = url.match(/\/place\/([^/]+)/);
    if (placeMatch) {
      return `https://maps.google.com/maps?q=${decodeURIComponent(placeMatch[1])}&z=13&output=embed`;
    }
  }
  if (url.startsWith('http')) {
    return url + (url.includes('?') ? '&' : '?') + 'output=embed';
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&z=13&output=embed`;
}

const defaultMapUrl = 'https://maps.google.com/maps?q=Jamacho+Gumba+Kathmandu&z=13&output=embed';


export function InteractiveMap() {
  const [embedUrl, setEmbedUrl] = useState(defaultMapUrl);
  const [linkOnlyUrl, setLinkOnlyUrl] = useState('');
  const [label, setLabel] = useState('Next Hike Location');

  useEffect(() => {
    async function fetchMapUrl() {
      try {
        const { data } = await supabase
          .from('website_settings')
          .select('next_hike_map_url, next_hike_name, next_hike_location')
          .order('id', { ascending: true })
          .limit(1)
          .maybeSingle();
        if (data) {
          if (data.next_hike_map_url) {
            if (isShortLink(data.next_hike_map_url)) {
              setLinkOnlyUrl(data.next_hike_map_url);
            } else {
              setEmbedUrl(toEmbedUrl(data.next_hike_map_url));
              setLinkOnlyUrl('');
            }
          }
          if (data.next_hike_name || data.next_hike_location) {
            setLabel(`${data.next_hike_name || 'Next Hike'} — ${data.next_hike_location || ''}`);
          }
        }
      } catch { /* use defaults */ }
    }
    fetchMapUrl();
  }, []);

  if (linkOnlyUrl) {
    return (
      <a
        href={linkOnlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/10 hover:from-emerald-100 hover:to-green-200 dark:hover:from-emerald-900/30 dark:hover:to-green-900/20 transition-colors group"
      >
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
          <MapPin className="w-7 h-7 text-emerald-600" />
        </div>
        <div className="text-center px-6">
          <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{label}</p>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>
    );
  }

  return (
    <div className="relative w-full h-full">
      <iframe
        src={embedUrl}
        title="Next Hike Location"
        className="w-full h-full block"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </div>
      </div>
    </div>
  );
}
