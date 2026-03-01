'use client';

/**
 * Presentation generation page with form, progress tracking, slide preview & presentation mode
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PresentationForm from '@/components/PresentationForm';
import GenerationProgress from '@/components/GenerationProgress';
import SlidePreviewGrid from '@/components/SlidePreviewGrid';
import PresentationViewer from '@/components/PresentationViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { GenerationRequest, GenerationJob, TemplateType } from '@/lib/types/presentation';
import { toast } from 'sonner';
import { Download, ArrowLeft, Monitor, RotateCcw, Eye } from 'lucide-react';

export default function GeneratePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('professional');
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentStartIndex, setPresentStartIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'progress'>('progress');

  // Poll for job status
  useEffect(() => {
    if (!jobId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status/${jobId}`);
        const data = await response.json();

        if (!response.ok) {
          toast.error('Failed to fetch job status');
          return;
        }

        setJob(data.data);

        // Stop polling if complete or error
        if (data.data.status === 'complete' || data.data.status === 'error') {
          clearInterval(pollInterval);
          setIsLoading(false);

          if (data.data.status === 'complete') {
            toast.success('Presentation generated successfully!');
            // Switch to preview tab when done
            if (data.data.slides?.length) {
              setActiveTab('preview');
            }
          } else {
            toast.error(`Generation failed: ${data.data.error}`);
          }
        }
      } catch (error) {
        console.error('[v0] Error polling status:', error);
        toast.error('Connection error while checking status');
      }
    }, 1000);

    return () => clearInterval(pollInterval);
  }, [jobId]);

  const handleGenerateSubmit = useCallback(async (data: GenerationRequest) => {
    setIsLoading(true);
    setSelectedTemplate(data.template);
    setActiveTab('progress');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Failed to start generation');
        setIsLoading(false);
        return;
      }

      const newJobId = result.data?.jobId || result.jobId;
      setJobId(newJobId);
      setJob({
        jobId: newJobId,
        status: 'generating',
        progress: 0,
        currentSlide: 0,
        totalSlides: data.slideCount,
        topic: data.topic,
        template: data.template,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success('Generation started! This may take a few minutes...');
    } catch (error) {
      console.error('[v0] Error starting generation:', error);
      toast.error('Failed to start generation. Please try again.');
      setIsLoading(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!jobId) return;

    try {
      const response = await fetch(`/api/download/${jobId}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to retrieve download');
        return;
      }

      const link = document.createElement('a');
      link.href = data.data.downloadUrl;
      link.download = data.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started!');
    } catch (error) {
      console.error('[v0] Error downloading:', error);
      toast.error('Failed to download presentation');
    }
  }, [jobId]);

  const handlePresent = useCallback((startIndex: number) => {
    setPresentStartIndex(startIndex);
    setPresentationMode(true);
  }, []);

  const handleReset = useCallback(() => {
    setJob(null);
    setJobId(null);
    setIsLoading(false);
    setPresentationMode(false);
    setActiveTab('progress');
  }, []);

  const isComplete = job?.status === 'complete';
  const hasSlides = isComplete && job?.slides && job.slides.length > 0;
  const effectiveTemplate = job?.template || selectedTemplate;
  const effectiveTopic = job?.topic || '';

  return (
    <>
      {/* Presentation viewer overlay */}
      {presentationMode && hasSlides && (
        <PresentationViewer
          slides={job!.slides!}
          template={effectiveTemplate}
          startIndex={presentStartIndex}
          topic={effectiveTopic}
          onClose={() => setPresentationMode(false)}
          onDownload={handleDownload}
        />
      )}

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Presentation Generator</h1>
              <p className="mt-2 text-slate-600">
                Create professional PowerPoint presentations in minutes
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isComplete && hasSlides && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresent(0)}
                    className="gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    Present
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </>
              )}
              {(job || jobId) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              )}
            </div>
          </div>

          {/* Main content */}
          {!job || job.status === 'error' ? (
            <div className="space-y-4">
              <PresentationForm
                onSubmit={handleGenerateSubmit}
                isLoading={isLoading}
              />
              {job?.status === 'error' && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tab bar: only shown when complete and has slides */}
              {isComplete && hasSlides && (
                <div className="flex gap-1 p-1 bg-slate-200 rounded-xl w-fit">
                  <button
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'preview'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                    onClick={() => setActiveTab('preview')}
                  >
                    <Eye className="h-4 w-4" />
                    Slide Preview
                  </button>
                  <button
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'progress'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                    onClick={() => setActiveTab('progress')}
                  >
                    Status
                  </button>
                </div>
              )}

              {/* Progress view */}
              {(!isComplete || activeTab === 'progress') && (
                <GenerationProgress job={job} />
              )}

              {/* Slide preview grid */}
              {isComplete && hasSlides && activeTab === 'preview' && (
                <SlidePreviewGrid
                  slides={job!.slides!}
                  template={effectiveTemplate}
                  onPresent={handlePresent}
                />
              )}

              {/* Completion actions card */}
              {isComplete && (
                <Card
                  className={hasSlides ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}
                >
                  <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className={`font-semibold ${hasSlides ? 'text-green-900' : 'text-blue-900'}`}>
                        ✓ Your presentation is ready!
                      </p>
                      <p className={`text-sm mt-0.5 ${hasSlides ? 'text-green-700' : 'text-blue-700'}`}>
                        {hasSlides
                          ? `${job.slides!.length} slides generated — preview, present, or download below`
                          : 'Click download to save your PowerPoint file'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hasSlides && (
                        <Button
                          onClick={() => handlePresent(0)}
                          className="gap-2"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                          <Monitor className="h-4 w-4" />
                          Present
                        </Button>
                      )}
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="gap-2 border-green-300 hover:bg-green-100"
                      >
                        <Download className="h-4 w-4" />
                        Download PPTX
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="gap-2"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Create Another
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
