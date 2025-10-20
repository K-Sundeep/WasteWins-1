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

  // Only show warnings if not in free-only mode
  if (!env.app.isFreeOnlyMode) {
    // Check for recommended but not required keys
    if (!env.mapbox.hasToken()) {
      warnings.push('VITE_MAPBOX_TOKEN not set - using straight-line distance calculations');
    }

    if (!env.climatiq.hasKey()) {
      warnings.push('VITE_CLIMATIQ_API_KEY not set - carbon calculations may be estimates');
    }
  }

  // Log warnings in development (only if not in free-only mode)
  if (env.app.isDevelopment && warnings.length > 0 && !env.app.isFreeOnlyMode) {
    console.warn('⚠️ Environment Configuration Warnings:');
    warnings.forEach((w) => console.warn(`  - ${w}`));
    console.warn('See .env.example for setup instructions');
  }

  // Log free-only mode status
  if (env.app.isDevelopment && env.app.isFreeOnlyMode) {
    console.log('🆓 Running in Free-Only Mode - using built-in alternatives for all features');
  }

  return {
    valid: true, // No hard requirements currently
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
