"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, Calculator, Brain, PenTool, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { ResultModal } from "./result-modal";

interface ResultItem {
  id: string;
  title: string;
  description?: string;
  content: string;
  status: 'success' | 'error' | 'warning';
  type: 'analysis' | 'summary' | 'rewrite' | 'calculation' | 'chart' | 'other';
  metadata?: Record<string, string | number>;
  timestamp: Date;
}

interface ResultsSummaryProps {
  results: ResultItem[];
  onClearResult?: (id: string) => void;
  onClearAll?: () => void;
  title?: string;
  description?: string;
}

export function ResultsSummary({
  results,
  onClearResult,
  onClearAll,
  title = "Processing Results",
  description = "Summary of all processed files and AI responses"
}: ResultsSummaryProps) {
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewResult = (result: ResultItem) => {
    setSelectedResult(result);
    setModalOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return <Brain className="w-4 h-4 text-blue-500" />;
      case 'summary':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'rewrite':
        return <PenTool className="w-4 h-4 text-purple-500" />;
      case 'calculation':
        return <Calculator className="w-4 h-4 text-orange-500" />;
      case 'chart':
        return <BarChart3 className="w-4 h-4 text-pink-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
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

  const getTypeBadge = (type: string) => {
    const typeColors = {
      analysis: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      summary: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rewrite: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      calculation: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      chart: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };

    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || typeColors.other} variant="secondary">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors]} variant="secondary">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentPreview = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Group results by status
  const successResults = results.filter(r => r.status === 'success');
  const errorResults = results.filter(r => r.status === 'error');
  const warningResults = results.filter(r => r.status === 'warning');

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No results available</p>
            <p className="text-sm">Process some files to see results here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {onClearAll && (
              <Button variant="outline" size="sm" onClick={onClearAll}>
                Clear All
              </Button>
            )}
          </div>

          {/* Summary Stats */}
          <div className="flex space-x-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{successResults.length}</p>
              <p className="text-sm text-muted-foreground">Success</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{errorResults.length}</p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{warningResults.length}</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {getTypeIcon(result.type)}
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium truncate">{result.title}</p>
                      {getTypeBadge(result.type)}
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {getContentPreview(result.content)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(result.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewResult(result)}
                  >
                    View
                  </Button>
                  {onClearResult && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClearResult(result.id)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedResult && (
        <ResultModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedResult.title}
          description={selectedResult.description}
          content={selectedResult.content}
          status={selectedResult.status}
          type={selectedResult.type}
          metadata={selectedResult.metadata}
        />
      )}
    </>
  );
}
