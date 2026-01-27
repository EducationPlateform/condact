import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import shaka from 'shaka-player';

export interface DrmConfig {
  videoId: string;
  drmEnabled: boolean;
  widevineLicenseServer?: string;
  fairPlayLicenseServer?: string;
  certificateUrl?: string;
  manifestUrl: string;
  dashManifestUrl: string;
  licenseToken?: string;
}

export const useDrmPlayer = (
  videoElement: HTMLVideoElement | null,
  drmConfig: DrmConfig | null,
  onError?: (error: Error) => void
) => {
  const playerRef = useRef<shaka.Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!videoElement || !drmConfig) {
      return;
    }

    // Install built-in polyfills
    shaka.polyfill.installAll();

    // Check if browser supports the player
    if (!shaka.Player.isBrowserSupported()) {
      const err = new Error('Browser does not support Shaka Player');
      setError(err);
      onError?.(err);
      return;
    }

    // Create player instance
    const player = new shaka.Player(videoElement);
    playerRef.current = player;

    // Configure DRM if enabled
    if (drmConfig.drmEnabled) {
      player.configure({
        drm: {
          servers: {
            'com.widevine.alpha': drmConfig.widevineLicenseServer || '',
            'com.apple.fps': drmConfig.fairPlayLicenseServer || '',
          },
          advanced: {
            'com.widevine.alpha': {
              serverCertificate: drmConfig.certificateUrl
                ? undefined
                : undefined, // Certificate handling
            },
          },
        },
      });
    }

    // Load manifest
    const loadManifest = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use HLS manifest for Safari, DASH for others
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const manifestUrl = isSafari
          ? `/api/videos/${drmConfig.videoId}/manifest.m3u8`
          : `/api/videos/${drmConfig.videoId}/manifest.mpd`;

        await player.load(manifestUrl);
        setIsLoading(false);
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsLoading(false);
        onError?.(error);
      }
    };

    loadManifest();

    // Error handling
    player.addEventListener('error', (event: any) => {
      const shakaError = event.detail;
      const error = new Error(`Shaka Player error: ${shakaError.message}`);
      setError(error);
      onError?.(error);
    });

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoElement, drmConfig, onError]);

  return {
    player: playerRef.current,
    isLoading,
    error,
  };
};
