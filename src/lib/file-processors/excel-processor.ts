import * as XLSX from 'xlsx';
import { ChartData } from '@/types/chart';

export interface ExcelData {
  headers: string[];
  rows: (string | number | null)[][];
  sheetName: string;
  totalRows: number;
  totalColumns: number;
}

export interface ExcelProcessingResult {
  data: ExcelData;
  calculations?: {
    sum?: Record<string, number>;
    average?: Record<string, number>;
    min?: Record<string, number>;
    max?: Record<string, number>;
  };
  sortedData?: ExcelData;
  filteredData?: ExcelData;
  chartData?: ChartData;
  error?: string;
}

export async function processExcelFile(file: File): Promise<ExcelProcessingResult> {
  try {
    // Check if file has arrayBuffer method (File-like object)
    if (typeof file.arrayBuffer !== 'function') {
      throw new Error("File object does not support arrayBuffer method. Please upload a valid file.");
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Parse Excel file
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!jsonData || jsonData.length === 0) {
      throw new Error("No data found in the Excel file");
    }

    // Extract headers and rows
    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1) as (string | number | null)[][];

    const data: ExcelData = {
      headers,
      rows,
      sheetName,
      totalRows: rows.length,
      totalColumns: headers.length,
    };

    return { data };
  } catch (error) {
    console.error("Error processing Excel file:", error);
    return {
      data: {
        headers: [],
        rows: [],
        sheetName: '',
        totalRows: 0,
        totalColumns: 0,
      },
      error: error instanceof Error ? error.message : "Failed to process Excel file",
    };
  }
}

export function calculateSum(data: ExcelData): Record<string, number> {
  const sums: Record<string, number> = {};

  // Identify numeric columns
  const numericColumns: number[] = [];
  data.headers.forEach((header, index) => {
    const sampleValues = data.rows.slice(0, 10).map(row => row[index]);
    const hasNumbers = sampleValues.some(value =>
      typeof value === 'number' || (!isNaN(Number(value)) && value !== '')
    );
    if (hasNumbers) {
      numericColumns.push(index);
    }
  });

  // Calculate sums for numeric columns
  numericColumns.forEach(colIndex => {
    const header = data.headers[colIndex];
    let sum = 0;
    let count = 0;

    data.rows.forEach(row => {
      const value = row[colIndex];
      const numValue = typeof value === 'number' ? value : Number(value);
      if (!isNaN(numValue)) {
        sum += numValue;
        count++;
      }
    });

    if (count > 0) {
      sums[header] = sum;
    }
  });

  return sums;
}

export function calculateAverage(data: ExcelData): Record<string, number> {
  const averages: Record<string, number> = {};

  // Identify numeric columns
  const numericColumns: number[] = [];
  data.headers.forEach((header, index) => {
    const sampleValues = data.rows.slice(0, 10).map(row => row[index]);
    const hasNumbers = sampleValues.some(value =>
      typeof value === 'number' || (!isNaN(Number(value)) && value !== '')
    );
    if (hasNumbers) {
      numericColumns.push(index);
    }
  });

  // Calculate averages for numeric columns
  numericColumns.forEach(colIndex => {
    const header = data.headers[colIndex];
    let sum = 0;
    let count = 0;

    data.rows.forEach(row => {
      const value = row[colIndex];
      const numValue = typeof value === 'number' ? value : Number(value);
      if (!isNaN(numValue)) {
        sum += numValue;
        count++;
      }
    });

    if (count > 0) {
      averages[header] = sum / count;
    }
  });

  return averages;
}

export function findMinMax(data: ExcelData): { min: Record<string, number>, max: Record<string, number> } {
  const min: Record<string, number> = {};
  const max: Record<string, number> = {};

  // Identify numeric columns
  const numericColumns: number[] = [];
  data.headers.forEach((header, index) => {
    const sampleValues = data.rows.slice(0, 10).map(row => row[index]);
    const hasNumbers = sampleValues.some(value =>
      typeof value === 'number' || (!isNaN(Number(value)) && value !== '')
    );
    if (hasNumbers) {
      numericColumns.push(index);
    }
  });

  // Find min/max for numeric columns
  numericColumns.forEach(colIndex => {
    const header = data.headers[colIndex];
    let minValue = Infinity;
    let maxValue = -Infinity;
    let hasValidValues = false;

    data.rows.forEach(row => {
      const value = row[colIndex];
      const numValue = typeof value === 'number' ? value : Number(value);
      if (!isNaN(numValue)) {
        minValue = Math.min(minValue, numValue);
        maxValue = Math.max(maxValue, numValue);
        hasValidValues = true;
      }
    });

    if (hasValidValues) {
      min[header] = minValue;
      max[header] = maxValue;
    }
  });

  return { min, max };
}

export function sortData(data: ExcelData, columnIndex: number, ascending: boolean = true): ExcelData {
  const sortedRows = [...data.rows].sort((a, b) => {
    const aValue = a[columnIndex];
    const bValue = b[columnIndex];

    // Handle different data types
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return ascending ? aValue - bValue : bValue - aValue;
    }

    const aStr = String(aValue || '').toLowerCase();
    const bStr = String(bValue || '').toLowerCase();

    if (ascending) {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  return {
    ...data,
    rows: sortedRows,
  };
}

export function filterData(data: ExcelData, columnIndex: number, filterValue: string): ExcelData {
  const filteredRows = data.rows.filter(row => {
    const cellValue = String(row[columnIndex] || '').toLowerCase();
    const filter = filterValue.toLowerCase();
    return cellValue.includes(filter);
  });

  return {
    ...data,
    rows: filteredRows,
    totalRows: filteredRows.length,
  };
}

export function generateChartData(data: ExcelData, xAxisColumn: number, yAxisColumn: number): ChartData {
  const chartData = data.rows
    .filter(row => row[xAxisColumn] !== undefined && row[yAxisColumn] !== undefined)
    .map(row => ({
      name: String(row[xAxisColumn]),
      value: typeof row[yAxisColumn] === 'number' ? row[yAxisColumn] : Number(row[yAxisColumn]) || 0,
    }));

  return {
    data: chartData,
    xAxis: data.headers[xAxisColumn],
    yAxis: data.headers[yAxisColumn],
  };
}
