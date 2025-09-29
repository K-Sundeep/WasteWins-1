import { useCallback } from 'react';

// Very rough fallback emission factors (kg CO2e per kg material)
// These are placeholders for demo only; for production, calibrate with a trusted source.
const FALLBACK_FACTORS: Record<string, number> = {
  clothes: 1.8, // diverted textile benefit estimate
  biowaste: 0.1, // composting benefit proxy
  plastic: 2.1, // recycling vs virgin production diff proxy
  default: 1.0,
};

export interface CarbonEstimateInput {
  category: string; // 'clothes' | 'biowaste' | 'plastic' | ...
  weightKg: number;
  distanceKm?: number; // optional, can refine when routing is added
}

export function useCarbon() {
  const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_CLIMATIQ_API_KEY) as
    | string
    | undefined;
  const activityIdClothes = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_CLIMATIQ_ACTIVITY_ID_CLOTHES) as
    | string
    | undefined;
  const activityIdBiowaste = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_CLIMATIQ_ACTIVITY_ID_BIOWASTE) as
    | string
    | undefined;
  const activityIdPlastic = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_CLIMATIQ_ACTIVITY_ID_PLASTIC) as
    | string
    | undefined;
  const activityIdTransport = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_CLIMATIQ_ACTIVITY_ID_TRANSPORT) as
    | string
    | undefined;

  const estimate = useCallback(
    async ({ category, weightKg, distanceKm }: CarbonEstimateInput): Promise<{ co2kg: number; source: 'climatiq' | 'fallback' } | null> => {
      if (!weightKg || weightKg <= 0) return null;

      // If Climatiq key present, attempt a specific activity per category (from env)
      if (apiKey) {
        try {
          let activityId: string | undefined;
          const cat = (category || '').toLowerCase();
          if (cat === 'clothes' || cat === 'textile' || cat === 'textiles') activityId = activityIdClothes;
          else if (cat === 'biowaste' || cat === 'organic') activityId = activityIdBiowaste;
          else if (cat === 'plastic' || cat === 'plastics') activityId = activityIdPlastic;

          // If no explicit mapping, skip to fallback factors
          if (!activityId) throw new Error('No activity id for category');
          const res = await fetch('https://beta3.api.climatiq.io/estimate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              emission_factor: {
                activity_id: activityId,
                // If using a real activity, specify region as needed
              },
              parameters: {
                mass: weightKg,
                mass_unit: 'kg',
              },
            }),
          });
          let materialCo2 = 0;
          if (res.ok) {
            const json = await res.json();
            materialCo2 = json?.co2e ?? json?.co2e_kg ?? 0;
          }

          // Add transport emissions if distance provided
          if (distanceKm && distanceKm > 0) {
            let transportCo2 = 0;
            if (activityIdTransport) {
              const tkm = (weightKg / 1000) * distanceKm; // tonne-km
              const tRes = await fetch('https://beta3.api.climatiq.io/estimate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  emission_factor: {
                    activity_id: activityIdTransport,
                  },
                  parameters: {
                    distance: tkm,
                    distance_unit: 'tonne_kilometer',
                  },
                }),
              });
              if (tRes.ok) {
                const tJson = await tRes.json();
                transportCo2 = tJson?.co2e ?? tJson?.co2e_kg ?? 0;
              }
            } else {
              // Fallback transport factor ~0.12 kg CO2e per tkm (very rough placeholder)
              const tkm = (weightKg / 1000) * distanceKm;
              transportCo2 = 0.12 * tkm;
            }
            const total = materialCo2 + transportCo2;
            if (total > 0) return { co2kg: total, source: 'climatiq' };
          }

          if (materialCo2 > 0) return { co2kg: materialCo2, source: 'climatiq' };
        } catch {
          // fallthrough to fallback
        }
      }

      // Fallback simple factors
      const factor = FALLBACK_FACTORS[category] ?? FALLBACK_FACTORS.default;
      let co2kg = factor * weightKg;
      // Add simple transport fallback if distance provided
      if (distanceKm && distanceKm > 0) {
        const tkm = (weightKg / 1000) * distanceKm;
        co2kg += 0.12 * tkm; // very rough placeholder
      }
      return { co2kg, source: 'fallback' };
    },
    [apiKey]
  );

  return { estimate };
}
