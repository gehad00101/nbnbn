"use client";

import { useState, useRef, useEffect } from "react";
import { askVoiceAssistant, type VoiceAssistantOutput } from "@/ai/flows/voice-assistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, Send, User, Bot, Volume2, CircleStop } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export function VoiceAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for browser support for SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'ar-SA';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        stopRecording();
        handleSubmit(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        toast({
          variant: "destructive",
          title: "خطأ في التعرف على الكلام",
          description: "لم نتمكن من معالجة صوتك. الرجاء المحاولة مرة أخرى."
        });
        stopRecording();
      };
    } else {
        // Let user know their browser doesn't support this feature
        // console.warn("Speech recognition not supported in this browser.");
    }
  }, [toast]);


  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch(e) {
         toast({
          variant: "destructive",
          title: "خطأ في بدء التسجيل",
          description: "تأكد من أن الميكروفون مسموح به."
        });
      }
    } else {
        toast({
            variant: "destructive",
            title: "الميزة غير مدعومة",
            description: "متصفحك لا يدعم ميزة التعرف على الكلام."
          });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleSubmit = async (text: string) => {
    const question = text.trim();
    if (!question) return;

    setInput("");
    setIsLoading(true);
    setAudioUrl(null);
    setMessages(prev => [...prev, { sender: 'user', text: question }]);

    try {
      const result = await askVoiceAssistant({ question });
      setMessages(prev => [...prev, { sender: 'ai', text: result.answer }]);
      setAudioUrl(result.audio);
    } catch (error) {
      console.error("Voice assistant error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "عذراً، حدث خطأ ما. حاول مرة أخرى." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      playAudio();
    }
  }, [audioUrl]);

  return (
    <Card className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>اسأل أي شيء عن عملك</CardTitle>
        <CardDescription>استخدم صوتك أو اكتب سؤالك للحصول على رؤى فورية.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                {message.sender === 'ai' && (
                  <Avatar>
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg p-3 max-w-sm ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{message.text}</p>
                   {message.sender === 'ai' && audioUrl && messages.length -1 === index && (
                      <Button onClick={playAudio} variant="ghost" size="icon" className="mt-2 h-7 w-7">
                          <Volume2 className="h-4 w-4" />
                      </Button>
                   )}
                </div>
                {message.sender === 'user' && (
                  <Avatar>
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar>
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-center gap-2">
          <Textarea
            placeholder="اكتب سؤالك هنا..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(input);
                }
            }}
            className="flex-grow resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} onClick={() => handleSubmit(input)}>
            <Send className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            size="icon" 
            variant={isRecording ? "destructive" : "outline"}
            onClick={isRecording ? stopRecording : startRecording} 
            disabled={isLoading}
          >
            {isRecording ? <CircleStop className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
        {audioUrl && <audio ref={audioRef} className="hidden" />}
      </CardFooter>
    </Card>
  );
}
