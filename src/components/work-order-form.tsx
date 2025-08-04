'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPartRecommendations } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wrench, Cog, List } from 'lucide-react';
import type { WorkOrderPartRecommendationOutput } from '@/ai/flows/work-order-part-recommendation';

const formSchema = z.object({
  problemDescription: z.string().min(10, {
    message: 'Problem description must be at least 10 characters.',
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    const result = await getPartRecommendations(values);
    setIsLoading(false);

    if (result.success && result.data) {
      setRecommendations(result.data);
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
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="problemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Truck is making a grinding noise when braking and pulling to the left.'"
                      className="resize-none"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Getting Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </form>
        </Form>
        
        {recommendations && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cog />
                  Recommended Parts
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-2">
                    {recommendations.recommendedParts.map((part, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <List className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{part}</span>
                      </li>
                    ))}
                  </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench />
                  Recommended Labor
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-2">
                    {recommendations.recommendedLabor.map((labor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <List className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{labor}</span>
                      </li>
                    ))}
                  </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
