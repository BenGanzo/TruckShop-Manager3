
'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPartRecommendations } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wrench, Cog, List, Info } from 'lucide-react';
import type { WorkOrderPartRecommendationOutput } from '@/ai/flows/work-order-part-recommendation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  problemDescription: z.string().min(1, {
    message: 'Problem description is required to get recommendations.',
  }),
});

export default function WorkOrderForm() {
  const [recommendations, setRecommendations] = useState<WorkOrderPartRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemDescription: '',
    },
  });

  const problemDescription = useWatch({
    control: form.control,
    name: 'problemDescription',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    const result = await getPartRecommendations(values);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="problemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                     {/* The label is provided by the main WO form, so we hide it here */}
                    <Textarea
                      placeholder="e.g., 'Truck is making a grinding noise when braking and pulling to the left.'"
                      className="resize-none sr-only" 
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!problemDescription && (
                 <div className="text-center text-sm text-muted-foreground p-8 bg-muted rounded-lg">
                    Fill in vehicle and problem to get suggestions.
                </div>
            )}
            
            <div className="flex justify-center">
                 <Button type="submit" disabled={isLoading || !problemDescription} variant="outline">
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
          </form>
        </Form>
        
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
