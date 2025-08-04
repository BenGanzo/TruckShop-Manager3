
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UploadCloud, File as FileIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminImportPage() {
  const [dataType, setDataType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      toast({
        variant: 'destructive',
        title: 'File Upload Error',
        description: `File is larger than 10MB or is not a CSV file.`,
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
    console.log('Importing', file?.name, 'for', dataType);
    toast({
      title: 'Import Started (Simulated)',
      description: `Your file ${file?.name} is being processed.`,
    });
  };
  
  const isImportDisabled = !dataType || !file;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Import Data</h1>
      <p className="mt-2 text-muted-foreground">
        Import data from CSV files. Please select the data type you wish to import and upload the corresponding file.
      </p>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Import Settings</CardTitle>
          <CardDescription>Select the data type and the CSV file to be imported.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="data-type">Data Type to Import</Label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger id="data-type">
                <SelectValue placeholder="Select data type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trucks">Trucks</SelectItem>
                <SelectItem value="trailers">Trailers</SelectItem>
                <SelectItem value="parts">Parts</SelectItem>
                <SelectItem value="suppliers">Suppliers</SelectItem>
                <SelectItem value="users">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Upload File</Label>
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
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isImportDisabled} onClick={handleImport}>
            Import Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
