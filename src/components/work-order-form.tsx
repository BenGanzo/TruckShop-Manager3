
'use client';

import { useState } from 'react';
import { getPartRecommendations } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wrench, Cog, Info } from 'lucide-react';
import type { WorkOrderPartRecommendationOutput } from '@/ai/flows/work-order-part-recommendation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WorkOrderFormProps {
  problemDescription: string;
  onDescriptionChange: (value: string) => void;
}

export default function WorkOrderForm({ problemDescription, onDescriptionChange }: WorkOrderFormProps) {
  const [recommendations, setRecommendations] = useState<WorkOrderPartRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function getRecommendations() {
    if (!problemDescription) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please enter a problem description to get recommendations.',
        });
        return;
    }
    
    setIsLoading(true);
    setRecommendations(null);
    const result = await getPartRecommendations({ problemDescription });
    setIsLoading(false);

    if (result.success && result.data) {
      setRecommendations(result.data);
       toast({
        title: 'Recommendations Ready!',
        description: 'AI suggestions have been generated below.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="text-primary" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription>
          Get smart suggestions for parts and labor based on the problem description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* This textarea is visually hidden but controlled by the main form. 
            This component just reads the value and provides a button to trigger the AI. */}
        <Textarea
            value={problemDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="sr-only"
        />
        
        {!problemDescription && (
             <div className="text-center text-sm text-muted-foreground p-8 bg-muted rounded-lg">
                Fill in the problem description in the card above to get suggestions.
            </div>
        )}
        
        <div className="flex justify-center">
             <Button type="button" onClick={getRecommendations} disabled={isLoading || !problemDescription} variant="outline">
              {isLoading ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Getting Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </Button>
        </div>
        
        {recommendations && (
           <div className="mt-6 space-y-4">
             <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                These are AI-generated suggestions. Review them carefully and add the required items to the work order below.
              </AlertDescription>
            </Alert>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><Cog /> Recommended Parts</h3>
                    <ul className="space-y-2 list-disc pl-5 text-sm">
                        {recommendations.recommendedParts.map((part, index) => (
                        <li key={index}>{part}</li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><Wrench /> Recommended Labor</h3>
                     <ul className="space-y-2 list-disc pl-5 text-sm">
                        {recommendations.recommendedLabor.map((labor, index) => (
                        <li key={index}>{labor}</li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
