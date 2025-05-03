
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Camera, AreaChart, Play, StopCircle, AlertTriangle } from 'lucide-react'; // Added Play, StopCircle, AlertTriangle
import { Skeleton } from '@/components/ui/skeleton';

// --- IMPORTANT NOTES ---
// 1. Security: Direct streaming from cameras to the browser can be insecure.
//    Ideally, use a secure intermediate server (media server like Frigate, ZoneMinder, or a cloud service)
//    that handles authentication and provides secure stream URLs (e.g., HLS, WebRTC).
// 2. CORS: The camera feeds or media server must have appropriate CORS headers configured
//    to allow the web application's domain to access the streams.
// 3. Authentication: Access to camera streams must be authenticated and authorized.
//    This might involve passing tokens or using cookies managed by the intermediate server.
// 4. Performance: Streaming multiple high-resolution feeds can be resource-intensive
//    for both the server and the client browser. Consider optimizations like lower resolution
//    previews, only loading streams when visible, etc.
// 5. Intelbras Integration: Specific integration depends heavily on the Intelbras camera models
//    and their available streaming protocols (RTSP, MJPEG, specific SDKs/APIs).
//    Direct RTSP streaming in browsers is not natively supported and usually requires WebRTC or transcoding.
// -----------------------

interface CameraLocation {
    id: string;
    name: string; // e.g., "Piscina", "Quadra Esportiva", "Entrada Bloco A"
    // --- Placeholder URL ---
    // Replace with the actual secure stream URL provided by your media server or camera API
    streamUrl: string; // Example: Could be HLS (.m3u8), MJPEG, or a WebRTC endpoint
    protocol: 'hls' | 'mjpeg' | 'webrtc' | 'unavailable'; // Indicate the expected protocol
}

// TODO: Fetch camera locations and stream URLs for the specific condoId from backend
const fetchCameraLocations = async (condoId: number): Promise<CameraLocation[]> => {
    console.log(`Fetching camera locations for condo ID: ${condoId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    // --- Replace with actual secure URLs and protocols ---
    return [
        { id: 'cam1', name: 'Piscina', streamUrl: 'https://example.com/stream/piscina.m3u8', protocol: 'hls' },
        { id: 'cam2', name: 'Quadra Esportiva', streamUrl: 'https://example.com/stream/quadra.mjpeg', protocol: 'mjpeg' },
        { id: 'cam3', name: 'Entrada Bloco A', streamUrl: 'webrtc://example.com/stream/entrada_a', protocol: 'webrtc' },
        { id: 'cam4', name: 'Garagem (Indisponível)', streamUrl: '', protocol: 'unavailable' },
    ];
};

// Placeholder component for rendering different stream types
const CameraStreamPlayer: React.FC<{ location: CameraLocation }> = ({ location }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Cleanup function
        return () => {
             if (videoRef.current && videoRef.current.srcObject) {
                 const stream = videoRef.current.srcObject as MediaStream;
                 stream.getTracks().forEach(track => track.stop());
                 videoRef.current.srcObject = null;
             }
             // TODO: Add cleanup for HLS.js or other libraries if used
        };
    }, [location.id]);


    const handlePlay = async () => {
         setError(null);
         setIsPlaying(true);
         // --- IMPLEMENT STREAM LOADING LOGIC BASED ON PROTOCOL ---
         switch (location.protocol) {
             case 'hls':
                 // Use HLS.js or similar library to attach HLS stream to videoRef.current
                 console.log(`Attempting to play HLS stream: ${location.streamUrl}`);
                 // Example using a hypothetical Hls library:
                 // if (Hls.isSupported()) {
                 //   const hls = new Hls();
                 //   hls.loadSource(location.streamUrl);
                 //   hls.attachMedia(videoRef.current);
                 //   videoRef.current?.play().catch(e => setError(`Error playing HLS: ${e.message}`));
                 // } else { setError('HLS not supported in this browser.'); }
                  setError('HLS playback integration pending.'); // Placeholder
                  setIsPlaying(false);
                 break;
             case 'mjpeg':
                 // MJPEG can sometimes be displayed directly in an <img> tag
                 // Or requires specific handling. This is a simplified video tag attempt.
                  console.log(`Attempting to play MJPEG stream (may not work directly): ${location.streamUrl}`);
                  if (videoRef.current) {
                     // This often doesn't work directly for MJPEG streams in <video>
                     // videoRef.current.src = location.streamUrl;
                     // videoRef.current.play().catch(e => setError(`Error playing MJPEG: ${e.message}`));
                     setError('MJPEG direct playback in <video> often unsupported. Consider <img> tag or server transcoding.'); // Placeholder
                     setIsPlaying(false);
                  }
                 break;
             case 'webrtc':
                 // WebRTC requires complex signaling and peer connection setup.
                 // This would involve backend communication and WebRTC APIs.
                 console.log(`Attempting to connect WebRTC stream: ${location.streamUrl}`);
                 // Example: setupWebRTCConnection(location.streamUrl, videoRef.current);
                 setError('WebRTC integration pending.'); // Placeholder
                 setIsPlaying(false);
                 break;
             default:
                  setError(`Protocol "${location.protocol}" not supported or stream unavailable.`);
                  setIsPlaying(false);
         }
    }

    const handleStop = () => {
         setIsPlaying(false);
         if (videoRef.current) {
             videoRef.current.pause();
              if (videoRef.current.srcObject) {
                 const stream = videoRef.current.srcObject as MediaStream;
                 stream.getTracks().forEach(track => track.stop());
                 videoRef.current.srcObject = null;
             }
             // TODO: Detach HLS.js or other libraries
         }
         setError(null);
         console.log(`Stopped stream: ${location.name}`);
    }

     return (
        <div className="relative aspect-video border bg-black rounded-md overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                // controls // Optionally add browser controls
                muted // Mute by default for background playback/previews
                playsInline
            />
             {!isPlaying && location.protocol !== 'unavailable' && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                     <Button variant="ghost" size="icon" onClick={handlePlay} className="h-16 w-16 text-primary-foreground bg-primary/70 hover:bg-primary rounded-full">
                         <Play className="h-8 w-8 fill-current" />
                     </Button>
                      <p className="mt-2 text-sm">{location.name}</p>
                 </div>
             )}
             {isPlaying && (
                  <Button variant="ghost" size="icon" onClick={handleStop} className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white hover:bg-black/70 rounded-full">
                         <StopCircle className="h-4 w-4" />
                     </Button>
             )}
             {error && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/90 text-destructive-foreground p-4 text-center">
                      <AlertTriangle className="h-6 w-6 mb-2" />
                      <p className="text-sm font-semibold">Erro ao carregar câmera</p>
                      <p className="text-xs mt-1">{error}</p>
                       <Button variant="ghost" size="sm" onClick={handlePlay} className="mt-3">Tentar Novamente</Button>
                  </div>
             )}
             {location.protocol === 'unavailable' && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 text-muted-foreground p-4 text-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <p className="text-sm font-semibold">{location.name}</p>
                      <p className="text-xs mt-1">(Câmera indisponível no momento)</p>
                  </div>
             )}
        </div>
    );
};


export default function SindicoCamerasPage() {
    const searchParams = useSearchParams();
    const condoId = searchParams.get('condoId');
    const [locations, setLocations] = useState<CameraLocation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

     useEffect(() => {
        if (!condoId) {
            toast({ title: "Erro", description: "Condomínio não especificado.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        const loadCameras = async () => {
            setIsLoading(true);
            try {
                const data = await fetchCameraLocations(Number(condoId));
                setLocations(data);
            } catch (error) {
                console.error("Failed to load camera locations:", error);
                toast({ title: "Erro", description: "Não foi possível carregar as localizações das câmeras.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        loadCameras();
    }, [condoId, toast]);

     if (!condoId) {
        return <p className="text-destructive">ID do Condomínio não encontrado na URL.</p>;
     }


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Visualizar Câmeras</h1>
             {/* TODO: Display Condo Name */}
            <p className="text-muted-foreground">Acesse as câmeras de segurança do condomínio.</p>

             <Card>
                <CardHeader>
                    <CardTitle>Feeds das Câmeras</CardTitle>
                    <CardDescription>Clique no botão play para iniciar a visualização. A qualidade e disponibilidade dependem da conexão e das câmeras.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              <Skeleton className="aspect-video rounded-md" />
                              <Skeleton className="aspect-video rounded-md" />
                              <Skeleton className="aspect-video rounded-md" />
                         </div>
                    ) : locations.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {locations.map((location) => (
                                <CameraStreamPlayer key={location.id} location={location} />
                            ))}
                        </div>
                    ) : (
                         <p className="text-center text-muted-foreground py-4">Nenhuma câmera configurada para este condomínio.</p>
                    )}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                     Observação: A visualização pode exigir plugins ou configurações específicas dependendo do navegador e do protocolo da câmera. Para melhor performance, evite abrir muitas câmeras simultaneamente.
                </CardFooter>
             </Card>
        </div>
    );
}
