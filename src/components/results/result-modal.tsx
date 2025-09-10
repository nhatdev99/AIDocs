"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  content: string;
  status?: 'success' | 'error' | 'warning';
  type?: 'analysis' | 'summary' | 'rewrite' | 'calculation' | 'chart' | 'other';
  metadata?: Record<string, string | number>;
}

export function ResultModal({
  isOpen,
  onClose,
  title,
  description,
  content,
  status = 'success',
  type = 'other',
  metadata
}: ResultModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTypeBadge = () => {
    const typeColors = {
      analysis: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      summary: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rewrite: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      calculation: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      chart: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };

    return (
      <Badge className={`${typeColors[type]}`} variant="secondary">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <DialogTitle className="flex items-center space-x-2">
                  <span>{title}</span>
                  {getTypeBadge()}
                </DialogTitle>
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Metadata */}
          {metadata && Object.keys(metadata).length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <Textarea
            value={content}
            readOnly
            className="min-h-[300px] resize-none font-mono text-sm"
            placeholder="No content available"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
