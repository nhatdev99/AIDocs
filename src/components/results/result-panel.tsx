"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, CheckCircle, XCircle, AlertCircle, Maximize2 } from "lucide-react";
import { useState } from "react";
import { ResultModal } from "./result-modal";

interface ResultPanelProps {
  title: string;
  description?: string;
  content: string;
  status?: 'success' | 'error' | 'warning';
  type?: 'analysis' | 'summary' | 'rewrite' | 'calculation' | 'other';
  metadata?: Record<string, string | number>;
  maxHeight?: string;
  showExpandButton?: boolean;
}

export function ResultPanel({
  title,
  description,
  content,
  status = 'success',
  type = 'other',
  metadata,
  maxHeight = '300px',
  showExpandButton = true
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
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
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };

    return (
      <Badge className={typeColors[type]} variant="secondary">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{title}</span>
                  {getTypeBadge()}
                </CardTitle>
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
              {showExpandButton && (
                <Button variant="ghost" size="sm" onClick={() => setModalOpen(true)}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
          <div style={{ maxHeight }} className="overflow-y-auto">
            <Textarea
              value={content}
              readOnly
              className="min-h-[200px] resize-none font-mono text-sm"
              placeholder="No content available"
            />
          </div>
        </CardContent>
      </Card>

      <ResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={title}
        description={description}
        content={content}
        status={status}
        type={type}
        metadata={metadata}
      />
    </>
  );
}
