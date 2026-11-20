import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const sampleData = [
      {
        'Title': 'Lenovo ThinkPad T480 - Intel Core i5 8th Gen (16GB RAM / 512GB SSD)',
        'Brand': 'Lenovo',
        'Series': 'ThinkPad',
        'Condition': 'Like New',
        'Price': 24999,
        'OriginalPrice': 78000,
        'Stock': 1,
        'Processor': 'Intel Core i5',
        'ProcessorModel': 'Core i5 8350U',
        'ProcessorGen': '8th Gen',
        'RAM_GB': 16,
        'RAM_Type': 'DDR4',
        'Storage_GB': 512,
        'Storage_Type': 'NVMe SSD',
        'ScreenSize': '14.0 Inch FHD',
        'DisplayResolution': '1920 x 1080 FHD IPS',
        'GraphicsCard': 'Intel UHD Graphics 620',
        'OS': 'Windows 11 Pro',
        'BatteryHealth': '90% Certified OEM Health',
        'BatteryBackupHours': '6-8 Hours',
        'WarrantyMonths': 12,
        'IncludedAccessories': 'Original Charger, Power Cable, Lappy Square Laptop Bag, 45-Point Certificate',
        'WeightKg': '1.58 kg',
        'Description': 'Enterprise-grade ThinkPad laptop in pristine condition. Certified 45-point inspection passed.'
      },
      {
        'Title': 'Dell Latitude 7490 - Intel Core i7 8th Gen (16GB RAM / 512GB SSD)',
        'Brand': 'Dell',
        'Series': 'Latitude',
        'Condition': 'Excellent',
        'Price': 27499,
        'OriginalPrice': 89000,
        'Stock': 2,
        'Processor': 'Intel Core i7',
        'ProcessorModel': 'Core i7 8650U',
        'ProcessorGen': '8th Gen',
        'RAM_GB': 16,
        'RAM_Type': 'DDR4',
        'Storage_GB': 512,
        'Storage_Type': 'M.2 NVMe SSD',
        'ScreenSize': '14.0 Inch FHD',
        'DisplayResolution': '1920 x 1080 Anti-Glare',
        'GraphicsCard': 'Intel UHD Graphics 620',
        'OS': 'Windows 11 Pro',
        'BatteryHealth': '88% Certified Health',
        'BatteryBackupHours': '5-7 Hours',
        'WarrantyMonths': 12,
        'IncludedAccessories': 'Original Dell Adapter, Power Cord, Lappy Square Bag, Warranty Card',
        'WeightKg': '1.4 kg',
        'Description': 'Sleek and lightweight magnesium alloy business laptop with all-day battery.'
      },
      {
        'Title': 'HP EliteBook 840 G6 - Intel Core i5 8th Gen (16GB RAM / 512GB SSD)',
        'Brand': 'HP',
        'Series': 'EliteBook',
        'Condition': 'Like New',
        'Price': 25999,
        'OriginalPrice': 82000,
        'Stock': 1,
        'Processor': 'Intel Core i5',
        'ProcessorModel': 'Core i5 8265U',
        'ProcessorGen': '8th Gen',
        'RAM_GB': 16,
        'RAM_Type': 'DDR4',
        'Storage_GB': 512,
        'Storage_Type': 'High Speed SSD',
        'ScreenSize': '14.0 Inch FHD',
        'DisplayResolution': '1920 x 1080 IPS',
        'GraphicsCard': 'Intel UHD Graphics',
        'OS': 'Windows 11 Pro',
        'BatteryHealth': '92% Certified Health',
        'BatteryBackupHours': '6-8 Hours',
        'WarrantyMonths': 12,
        'IncludedAccessories': 'HP Original Smart AC Adapter, Power Cord, Laptop Bag',
        'WeightKg': '1.48 kg',
        'Description': 'Premium aluminum finish business notebook with Bang & Olufsen sound.'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    
    // Set nice column widths
    const colWidths = [
      { wch: 45 }, // Title
      { wch: 12 }, // Brand
      { wch: 15 }, // Series
      { wch: 14 }, // Condition
      { wch: 10 }, // Price
      { wch: 14 }, // OriginalPrice
      { wch: 8 },  // Stock
      { wch: 15 }, // Processor
      { wch: 18 }, // ProcessorModel
      { wch: 14 }, // ProcessorGen
      { wch: 10 }, // RAM_GB
      { wch: 10 }, // RAM_Type
      { wch: 12 }, // Storage_GB
      { wch: 14 }, // Storage_Type
      { wch: 16 }, // ScreenSize
      { wch: 22 }, // DisplayResolution
      { wch: 24 }, // GraphicsCard
      { wch: 16 }, // OS
      { wch: 26 }, // BatteryHealth
      { wch: 20 }, // BatteryBackupHours
      { wch: 16 }, // WarrantyMonths
      { wch: 40 }, // IncludedAccessories
      { wch: 12 }, // WeightKg
      { wch: 45 }, // Description
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laptops_Import_Template');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Lappy_Square_Product_Import_Template.xlsx"',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to generate template';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
