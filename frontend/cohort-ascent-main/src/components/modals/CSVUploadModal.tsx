import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileSpreadsheet, AlertCircle, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GradientButton } from '@/components/ui/GradientButton';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: Record<string, string>[]) => void;
  title: string;
  requiredColumns: string[];
}

export const CSVUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  title,
  requiredColumns,
}: CSVUploadModalProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    const data: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    return data;
  };

  const handleFile = async (selectedFile: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const text = await selectedFile.text();
      const data = parseCSV(text);

      if (data.length === 0) {
        setError('No data found in the file');
        return;
      }

      const headers = Object.keys(data[0]);
      const missingColumns = requiredColumns.filter(
        col => !headers.includes(col.toLowerCase().replace(/\s+/g, '_'))
      );

      if (missingColumns.length > 0) {
        setError(`Missing required columns: ${missingColumns.join(', ')}`);
        return;
      }

      setFile(selectedFile);
      setParsedData(data);
    } catch (err) {
      setError('Failed to parse file. Please ensure it is a valid CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleSubmit = () => {
    onUpload(parsedData);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!file ? (
            <>
              <div
                className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragOver ? 'border-primary bg-primary/5' : 'border-border/50'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) handleFile(selectedFile);
                  }}
                />
                <Upload className={`mx-auto h-12 w-12 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Drag & Drop your file here
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Or click to browse (CSV or Excel files)
                </p>
                <GradientButton
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </GradientButton>
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <h4 className="text-sm font-medium text-foreground">Required Columns:</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {requiredColumns.map((col) => (
                    <span key={col} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success/10 p-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-success" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {parsedData.length} records found
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setParsedData([]);
                  }}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {parsedData.length > 0 && (
                <div className="max-h-64 overflow-auto rounded-lg border border-border/30">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/80">
                      <tr>
                        {Object.keys(parsedData[0]).slice(0, 5).map((header) => (
                          <th key={header} className="px-3 py-2 text-left font-medium text-foreground">
                            {header.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-t border-border/30">
                          {Object.values(row).slice(0, 5).map((value, j) => (
                            <td key={j} className="px-3 py-2 text-muted-foreground">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.length > 5 && (
                    <p className="bg-muted/50 px-3 py-2 text-center text-sm text-muted-foreground">
                      ... and {parsedData.length - 5} more records
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <GradientButton variant="ghost" onClick={handleClose}>
              Cancel
            </GradientButton>
            <GradientButton
              variant="primary"
              disabled={parsedData.length === 0 || isProcessing}
              onClick={handleSubmit}
              icon={<Check className="h-4 w-4" />}
            >
              Import {parsedData.length > 0 ? `${parsedData.length} Records` : ''}
            </GradientButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};