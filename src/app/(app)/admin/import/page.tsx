
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { UploadCloud, File as FileIcon, Trash2, Import } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      toast({
        variant: 'destructive',
        title: 'File Upload Error',
        description: 'File is invalid. Please upload a valid CSV file under 10MB.',
      });
      return;
    }
    setFile(acceptedFiles[0]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleImport = () => {
    // Placeholder for actual import logic
    console.log('Importing', file?.name);
    toast({
      title: 'Import Started (Simulated)',
      description: `Your file ${file?.name} is being processed.`,
    });
  };

  const recommendedHeaders = [
    'Is Active', 'Vin Number', 'Make', 'Model', 'Make Year', 'Plate Number',
    'Trailer Type', 'Purchased On', 'Tag Expire On', 'Inspection Due On'
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Import Asset Data from CSV</h1>
      <p className="mt-2 text-muted-foreground">
        Use this tool to import or update your trucks and trailers in bulk.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Step 1: Prepare CSV */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Prepare Your CSV File</CardTitle>
            <CardDescription>
              Ensure your CSV file has the correct headers. The importer is flexible with capitalization and common names.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="font-semibold">Required Header</Label>
              <div className="mt-2">
                <Badge variant="outline">TruckId</Badge>
                <span className="text-sm text-muted-foreground ml-2">(or TrailerId, Asset ID, id)</span>
              </div>
            </div>

            <div>
              <Label className="font-semibold">Recommended Headers</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {recommendedHeaders.map(header => (
                   <Badge key={header} variant="secondary">{header}</Badge>
                ))}
              </div>
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>The Asset ID (e.g. TruckId) will be used as the unique ID for each asset. Rows without it will be skipped.</li>
              <li>`Is Active` can be 'Yes'/'No'. If not provided, assets will be marked as 'Active'.</li>
              <li>For trucks, leave the `Trailer Type` column blank or omit it. For trailers, specify the type (e.g., 'Reefer').</li>
            </ul>
          </CardContent>
        </Card>

        {/* Step 2: Upload and Import */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Upload and Import</CardTitle>
            <CardDescription>
              Select your prepared CSV file to begin the import process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col">
            <div className="space-y-2">
              <Label>CSV File</Label>
              {file ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                   <div className="flex items-center gap-3">
                     <FileIcon className="h-6 w-6 text-primary" />
                     <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                        </p>
                     </div>
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                     <Trash2 className="h-4 w-4 text-destructive"/>
                     <span className="sr-only">Remove file</span>
                   </Button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                  {isDragActive ? (
                      <p className="font-semibold text-primary">Drop the file here...</p>
                  ) : (
                      <>
                      <p className="mb-2 text-center">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">CSV files up to 10MB</p>
                      </>
                  )}
                </div>
              )}
            </div>
            <Button className="w-full mt-auto" disabled={!file} onClick={handleImport} size="lg">
              <Import className="mr-2" />
              Import Assets
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
