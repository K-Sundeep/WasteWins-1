/**
 * Environment variable utilities with validation
 */

export const env = {
  // Climatiq API
  climatiq: {
    apiKey: (import.meta as any)?.env?.VITE_CLIMATIQ_API_KEY || '',
    hasKey: () => Boolean((import.meta as any)?.env?.VITE_CLIMATIQ_API_KEY),
  },

  // Mapbox API
  mapbox: {
    token: (import.meta as any)?.env?.VITE_MAPBOX_TOKEN || '',
    hasToken: () => Boolean((import.meta as any)?.env?.VITE_MAPBOX_TOKEN),
  },

  // App settings
  app: {
    defaultPickupDistanceKm: Number((import.meta as any)?.env?.VITE_DEFAULT_PICKUP_DISTANCE_KM) || 5,
    isFreeOnlyMode: String((import.meta as any)?.env?.VITE_FREE_ONLY_MODE).toLowerCase() === 'true',
    isDevelopment: import.meta.env?.MODE === 'development',
    isProduction: import.meta.env?.MODE === 'production',
  },
};

/**
 * Validate required environment variables
 * Call this at app startup to catch configuration issues early
 */
export function validateEnv(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Environment validation - warnings only in development
  if (import.meta.env.DEV) {
    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      warnings.push('VITE_MAPBOX_TOKEN not set');
    }

    if (!import.meta.env.VITE_CLIMATIQ_API_KEY) {
      warnings.push('VITE_CLIMATIQ_API_KEY not set');
    }

    if (warnings.length > 0) {
      console.warn('⚠️ Env warnings:', warnings.join(', '));
    }
  }

  return {
    valid: true,
    warnings,
  };
}

/**
 * Get a safe display value for debugging (masks sensitive data)
 */
export function getEnvDebugInfo(): Record<string, any> {
  return {
    climatiq: env.climatiq.hasKey() ? '✓ Set' : '✗ Not set',
    mapbox: env.mapbox.hasToken() ? '✓ Set' : '✗ Not set',
    mode: import.meta.env?.MODE || 'unknown',
    freeOnlyMode: env.app.isFreeOnlyMode,
    defaultDistance: env.app.defaultPickupDistanceKm,
  };
}
