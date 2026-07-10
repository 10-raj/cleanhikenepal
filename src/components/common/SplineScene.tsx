import { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className = '' }: SplineSceneProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Suspense fallback={<SplineLoader />}>
        <Spline scene={scene} className="w-full h-full" />
      </Suspense>
    </div>
  );
}

export function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900/50 to-green-900/50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-emerald-400 text-sm font-medium animate-pulse">Loading 3D Scene...</span>
      </div>
    </div>
  );
}

export function HeroSplineBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-forest-900/70 to-green-900/80 z-10" />
      <Suspense fallback={<SplineLoader />}>
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          className="w-full h-full opacity-40"
        />
      </Suspense>
    </div>
  );
}
