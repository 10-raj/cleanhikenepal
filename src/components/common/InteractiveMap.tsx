import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '../../services/supabase';

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

const defaultMapUrl = 'https://maps.google.com/maps?q=Champadevi+Trail+Kathmandu&z=13&output=embed';

export function InteractiveMap() {
  const [embedUrl, setEmbedUrl] = useState(defaultMapUrl);
  const [label, setLabel] = useState('Next Hike Location');

  useEffect(() => {
    async function fetchMapUrl() {
      try {
        const { data } = await supabase
          .from('website_settings')
          .select('next_hike_map_url, next_hike_name, next_hike_location')
          .limit(1)
          .maybeSingle();
        if (data) {
          if (data.next_hike_map_url) {
            setEmbedUrl(toEmbedUrl(data.next_hike_map_url));
          }
          if (data.next_hike_name || data.next_hike_location) {
            setLabel(`${data.next_hike_name || 'Next Hike'} — ${data.next_hike_location || ''}`);
          }
        }
      } catch { /* use defaults */ }
    }
    fetchMapUrl();
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg h-72 md:h-80">
      <iframe
        src={embedUrl}
        title="Next Hike Location"
        className="w-full h-full"
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
