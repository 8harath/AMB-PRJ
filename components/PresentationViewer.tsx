'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GeneratedSlide, TemplateType } from '@/lib/types/presentation';
import {
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2,
    Minimize2,
    Monitor,
    Grid,
    Download,
} from 'lucide-react';

interface PresentationViewerProps {
    slides: GeneratedSlide[];
    template: TemplateType;
    startIndex?: number;
    topic: string;
    onClose: () => void;
    onDownload?: () => void;
}

const TEMPLATE_CONFIG: Record<TemplateType, {
    bg: string;
    titleBg: string;
    titleColor: string;
    subtitleColor: string;
    textColor: string;
    bulletDot: string;
    accentColor: string;
    footerBg: string;
}> = {
    minimal: {
        bg: '#FFFFFF',
        titleBg: '#FFFFFF',
        titleColor: '#1F2937',
        subtitleColor: '#6B7280',
        textColor: '#374151',
        bulletDot: '#3B82F6',
        accentColor: '#3B82F6',
        footerBg: '#F9FAFB',
    },
    professional: {
        bg: '#F8F9FA',
        titleBg: '#003366',
        titleColor: '#003366',
        subtitleColor: '#4B5563',
        textColor: '#222222',
        bulletDot: '#FF6B35',
        accentColor: '#FF6B35',
        footerBg: '#003366',
    },
    creative: {
        bg: '#FAFAFA',
        titleBg: '#7C3AED',
        titleColor: '#7C3AED',
        subtitleColor: '#6B7280',
        textColor: '#1E293B',
        bulletDot: '#EC4899',
        accentColor: '#EC4899',
        footerBg: '#7C3AED',
    },
};

function TitleSlideContent({ slide, config }: { slide: GeneratedSlide; config: typeof TEMPLATE_CONFIG[TemplateType] }) {
    return (
        <div
            className="flex flex-col items-center justify-center h-full text-center px-16 gap-6"
            style={{ backgroundColor: config.bg }}
        >
            {/* Decorative top bar */}
            <div className="w-24 h-1.5 rounded-full mb-2" style={{ backgroundColor: config.accentColor }} />

            <h1
                className="font-extrabold tracking-tight leading-tight max-w-3xl"
                style={{
                    fontSize: 'clamp(28px, 4.5vw, 56px)',
                    color: config.titleColor,
                }}
            >
                {slide.title}
            </h1>

            {slide.bullets[0] && (
                <p
                    className="max-w-2xl leading-relaxed"
                    style={{
                        fontSize: 'clamp(14px, 1.8vw, 24px)',
                        color: config.subtitleColor,
                    }}
                >
                    {slide.bullets[0]}
                </p>
            )}

            {/* Decorative bottom bar */}
            <div className="w-16 h-1 rounded-full mt-2" style={{ backgroundColor: config.accentColor, opacity: 0.4 }} />
        </div>
    );
}

function ContentSlideContent({ slide, config }: { slide: GeneratedSlide; config: typeof TEMPLATE_CONFIG[TemplateType] }) {
    return (
        <div className="flex flex-col h-full" style={{ backgroundColor: config.bg }}>
            {/* Title bar */}
            <div
                className="px-12 py-6 flex-shrink-0"
                style={{ backgroundColor: config.titleBg === config.bg ? 'transparent' : config.titleBg }}
            >
                <div
                    className="w-10 h-1 rounded-full mb-3"
                    style={{ backgroundColor: config.accentColor }}
                />
                <h2
                    className="font-bold leading-tight"
                    style={{
                        fontSize: 'clamp(18px, 2.6vw, 36px)',
                        color: config.titleBg !== config.bg ? '#ffffff' : config.titleColor,
                    }}
                >
                    {slide.title}
                </h2>
            </div>

            {/* Bullets */}
            <div className="flex-1 px-12 py-8 flex flex-col justify-center gap-4 overflow-hidden">
                {slide.bullets.map((bullet, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-4 group"
                        style={{
                            animation: `slideIn ${0.15 + i * 0.08}s ease-out both`,
                        }}
                    >
                        <div
                            className="flex-shrink-0 rounded-full mt-1"
                            style={{
                                width: 'clamp(6px, 0.8vw, 10px)',
                                height: 'clamp(6px, 0.8vw, 10px)',
                                backgroundColor: config.bulletDot,
                                marginTop: '0.4em',
                            }}
                        />
                        <p
                            className="leading-relaxed"
                            style={{
                                fontSize: 'clamp(13px, 1.6vw, 22px)',
                                color: config.textColor,
                                lineHeight: 1.55,
                            }}
                        >
                            {bullet}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SummarySlideContent({ slide, config }: { slide: GeneratedSlide; config: typeof TEMPLATE_CONFIG[TemplateType] }) {
    return (
        <div className="flex flex-col h-full" style={{ backgroundColor: config.bg }}>
            {/* Top accent bar */}
            <div className="h-2 w-full" style={{ backgroundColor: config.accentColor }} />

            <div className="flex-1 px-12 py-10 flex flex-col justify-center">
                <p
                    className="font-semibold mb-3 tracking-widest uppercase"
                    style={{
                        fontSize: 'clamp(10px, 1vw, 14px)',
                        color: config.accentColor,
                    }}
                >
                    Key Takeaways
                </p>
                <h2
                    className="font-bold mb-8 leading-tight"
                    style={{
                        fontSize: 'clamp(20px, 3vw, 40px)',
                        color: config.titleColor,
                    }}
                >
                    {slide.title}
                </h2>

                <div className="flex flex-col gap-5">
                    {slide.bullets.map((bullet, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-5 p-4 rounded-xl"
                            style={{
                                backgroundColor: config.accentColor + '12',
                                borderLeft: `3px solid ${config.accentColor}`,
                            }}
                        >
                            <span
                                className="font-bold flex-shrink-0"
                                style={{
                                    fontSize: 'clamp(14px, 1.6vw, 20px)',
                                    color: config.accentColor,
                                }}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <p
                                className="leading-relaxed"
                                style={{
                                    fontSize: 'clamp(12px, 1.4vw, 19px)',
                                    color: config.textColor,
                                }}
                            >
                                {bullet}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function PresentationViewer({
    slides,
    template,
    startIndex = 0,
    topic,
    onClose,
    onDownload,
}: PresentationViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showThumbnails, setShowThumbnails] = useState(false);
    const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const config = TEMPLATE_CONFIG[template];
    const slide = slides[currentIndex];

    const goTo = useCallback((idx: number, dir: 'left' | 'right') => {
        if (idx < 0 || idx >= slides.length) return;
        setAnimDir(dir);
        setTimeout(() => {
            setCurrentIndex(idx);
            setAnimDir(null);
        }, 120);
    }, [slides.length]);

    const prev = useCallback(() => goTo(currentIndex - 1, 'right'), [currentIndex, goTo]);
    const next = useCallback(() => goTo(currentIndex + 1, 'left'), [currentIndex, goTo]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                e.preventDefault();
                next();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                prev();
            } else if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [next, prev, onClose]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    const THUMB_STYLES: Record<TemplateType, { bg: string; titleColor: string; dot: string }> = {
        minimal: { bg: '#fff', titleColor: '#1F2937', dot: '#3B82F6' },
        professional: { bg: '#F8F9FA', titleColor: '#003366', dot: '#FF6B35' },
        creative: { bg: '#FAFAFA', titleColor: '#7C3AED', dot: '#EC4899' },
    };
    const thumbStyle = THUMB_STYLES[template];

    return (
        <>
            {/* Inline CSS for slide animation */}
            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-40px); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(40px); }
        }
        .slide-exit-left { animation: fadeSlideLeft 0.12s ease-in both; }
        .slide-exit-right { animation: fadeSlideRight 0.12s ease-in both; }
      `}</style>

            {/* Full-screen overlay */}
            <div
                ref={containerRef}
                className="fixed inset-0 z-50 flex flex-col"
                style={{ backgroundColor: '#0f0f0f' }}
            >
                {/* Top control bar */}
                <div
                    className="flex-shrink-0 flex items-center justify-between px-4 py-2 z-10"
                    style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-white/90">
                            <Monitor className="h-4 w-4 text-indigo-400" />
                            <span className="text-sm font-semibold max-w-[200px] truncate">{topic}</span>
                        </div>
                        <span className="text-white/40 text-sm">
                            {currentIndex + 1} / {slides.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {onDownload && (
                            <button
                                onClick={onDownload}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Download
                            </button>
                        )}
                        <button
                            onClick={() => setShowThumbnails(!showThumbnails)}
                            className={`p-2 rounded-md text-sm transition-colors ${showThumbnails ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                            title="Toggle slide panel (G)"
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            title="Toggle fullscreen (F)"
                        >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-red-500/80 transition-colors ml-1"
                            title="Exit (Esc)"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Main area: slide + optional thumbnail panel */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Slide thumbnails panel */}
                    {showThumbnails && (
                        <div
                            className="w-52 flex-shrink-0 flex flex-col gap-2 p-3 overflow-y-auto"
                            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                        >
                            {slides.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        const dir = i > currentIndex ? 'left' : 'right';
                                        goTo(i, dir);
                                    }}
                                    className="flex-shrink-0 w-full rounded-lg overflow-hidden transition-all duration-150 text-left"
                                    style={{
                                        border: i === currentIndex ? '2px solid #6366f1' : '2px solid transparent',
                                        boxShadow: i === currentIndex ? '0 0 0 1px #6366f1' : 'none',
                                        transform: i === currentIndex ? 'scale(1.03)' : 'scale(1)',
                                    }}
                                >
                                    {/* Mini slide */}
                                    <div
                                        className="w-full relative"
                                        style={{
                                            aspectRatio: '16/9',
                                            backgroundColor: thumbStyle.bg,
                                        }}
                                    >
                                        <div className="absolute inset-0 p-[8%] flex flex-col">
                                            {s.type === 'title' ? (
                                                <div className="flex flex-col items-center justify-center h-full text-center">
                                                    <div style={{ fontSize: '5.5px', fontWeight: 700, color: thumbStyle.titleColor, lineHeight: 1.2 }}>
                                                        {s.title.slice(0, 40)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ fontSize: '5px', fontWeight: 700, color: thumbStyle.titleColor, marginBottom: '6%' }}>
                                                        {s.title.slice(0, 35)}
                                                    </div>
                                                    <div className="flex flex-col gap-[5%]">
                                                        {s.bullets.slice(0, 3).map((b, bi) => (
                                                            <div key={bi} className="flex items-start gap-[5%]">
                                                                <div style={{ width: '3px', height: '3px', backgroundColor: thumbStyle.dot, borderRadius: '50%', flexShrink: 0, marginTop: '1px' }} />
                                                                <div style={{ fontSize: '4px', color: '#555', lineHeight: 1.2 }}>
                                                                    {b.slice(0, 40)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className="px-1.5 py-1"
                                        style={{ backgroundColor: i === currentIndex ? '#1e1b4b' : '#1a1a1a' }}
                                    >
                                        <span className="text-[9px] font-medium" style={{ color: i === currentIndex ? '#a5b4fc' : '#9ca3af' }}>
                                            {i + 1}. {s.title.slice(0, 20)}{s.title.length > 20 ? '…' : ''}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main slide view */}
                    <div className="flex-1 flex items-center justify-center p-4 relative">
                        {/* Slide frame */}
                        <div
                            className={`relative shadow-2xl overflow-hidden rounded-2xl ${animDir ? `slide-exit-${animDir}` : ''}`}
                            style={{
                                width: '100%',
                                maxWidth: 'min(calc(100% - 32px), calc((100vh - 120px) * 16/9))',
                                aspectRatio: '16/9',
                                backgroundColor: config.bg,
                            }}
                        >
                            {slide.type === 'title' && <TitleSlideContent slide={slide} config={config} />}
                            {slide.type === 'content' && <ContentSlideContent slide={slide} config={config} />}
                            {slide.type === 'summary' && <SummarySlideContent slide={slide} config={config} />}

                            {/* Slide footer */}
                            <div
                                className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-2"
                                style={{
                                    backgroundColor: config.footerBg,
                                    opacity: 0.9,
                                }}
                            >
                                <span
                                    className="text-xs font-medium truncate max-w-[60%]"
                                    style={{ color: config.footerBg === config.bg ? config.subtitleColor : 'rgba(255,255,255,0.7)' }}
                                >
                                    {topic}
                                </span>
                                <span
                                    className="text-xs font-semibold"
                                    style={{ color: config.footerBg === config.bg ? config.subtitleColor : 'rgba(255,255,255,0.7)' }}
                                >
                                    {currentIndex + 1} / {slides.length}
                                </span>
                            </div>
                        </div>

                        {/* Navigation arrows */}
                        {currentIndex > 0 && (
                            <button
                                onClick={prev}
                                className="absolute left-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all duration-150 hover:scale-110 active:scale-95 backdrop-blur-sm"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                        )}
                        {currentIndex < slides.length - 1 && (
                            <button
                                onClick={next}
                                className="absolute right-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all duration-150 hover:scale-110 active:scale-95 backdrop-blur-sm"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom progress bar + dot indicators */}
                <div
                    className="flex-shrink-0 px-6 py-3 flex flex-col items-center gap-2"
                    style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
                >
                    {/* Dot indicators */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-3xl">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i, i > currentIndex ? 'left' : 'right')}
                                className="rounded-full transition-all duration-200 hover:scale-125"
                                style={{
                                    width: i === currentIndex ? '20px' : '6px',
                                    height: '6px',
                                    backgroundColor: i === currentIndex ? '#6366f1' : 'rgba(255,255,255,0.3)',
                                    borderRadius: '999px',
                                }}
                            />
                        ))}
                    </div>
                    <p className="text-white/30 text-xs">
                        ← → arrow keys to navigate · F for fullscreen · Esc to exit
                    </p>
                </div>
            </div>
        </>
    );
}
