import * as XLSX from 'xlsx';
import { ImportPreviewRow } from '../types';

export const generateBarcode = () => {
  const prefix = 'BAR';
  const timestamp = Date.now().toString().slice(-9);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const validateAssetRow = (row: any, rowNumber: number, existingBarcodes: string[]): ImportPreviewRow => {
  const errors: string[] = [];
  
  if (!row.Category || row.Category.trim() === '') {
    errors.push('Category is required');
  }
  
  if (!row.Brand || row.Brand.trim() === '') {
    errors.push('Brand is required');
  }
  
  if (!row.Model || row.Model.trim() === '') {
    errors.push('Model is required');
  }
  
  // Auto-generate barcode if empty
  if (!row.Barcode || row.Barcode.trim() === '') {
    row.Barcode = generateBarcode();
  }
  
  // Check for duplicate barcode
  if (existingBarcodes.includes(row.Barcode)) {
    errors.push(`Duplicate barcode: ${row.Barcode}`);
  }
  
  return {
    rowNumber,
    data: row,
    errors,
    isValid: errors.length === 0,
  };
};

export const validateConsumableRow = (row: any, rowNumber: number): ImportPreviewRow => {
  const errors: string[] = [];
  
  if (!row.Category || row.Category.trim() === '') {
    errors.push('Category is required');
  }
  
  if (!row.Name || row.Name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!row.Quantity || isNaN(parseInt(row.Quantity))) {
    errors.push('Valid quantity is required');
  }
  
  if (!row.MinThreshold || isNaN(parseInt(row.MinThreshold))) {
    errors.push('Valid min threshold is required');
  }
  
  return {
    rowNumber,
    data: row,
    errors,
    isValid: errors.length === 0,
  };
};

export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

export const generateAssetTemplate = () => {
  const template = [
    {
      Category: 'Access Points',
      Brand: 'Ubiquiti',
      Model: 'UniFi AP AC Pro',
      SerialNumber: 'UAP-AC-PRO-003',
      Barcode: '', // Leave empty for auto-generation
      Description: 'Wireless access point for office',
    },
    {
      Category: 'Switches',
      Brand: 'Cisco',
      Model: 'Catalyst 2960',
      SerialNumber: 'FCW2145G0QZ',
      Barcode: 'BAR001234575',
      Description: '24-port managed switch',
    },
  ];
  
  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Assets');
  XLSX.writeFile(wb, 'Asset_Import_Template.xlsx');
};

export const generateConsumableTemplate = () => {
  const template = [
    {
      Category: 'Consumables',
      Name: 'CAT6 Cable (305m)',
      Quantity: 5,
      MinThreshold: 2,
      Description: 'Network cable roll',
    },
    {
      Category: 'Consumables',
      Name: 'RJ45 Connectors (100pcs)',
      Quantity: 20,
      MinThreshold: 10,
      Description: 'Ethernet connectors',
    },
  ];
  
  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Consumables');
  XLSX.writeFile(wb, 'Consumable_Import_Template.xlsx');
};
