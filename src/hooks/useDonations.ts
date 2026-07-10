import { useState, useEffect } from 'react';
import { getDonationCampaigns } from '../services/donations';
import { Donation } from '../types';

export function useDonationCampaigns(filters?: { category?: string }) {
  const [campaigns, setCampaigns] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true);
        const data = await getDonationCampaigns(filters);
        setCampaigns(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch campaigns'));
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, [filters?.category]);

  return { campaigns, loading, error };
}
