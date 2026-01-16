import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getDb } from '@/lib/db';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { content, printerName } = await req.json();
    let targetPrinter = printerName;

    if (!targetPrinter) {
      // Fetch default from settings
      const db = await getDb();
      const row = await db.get("SELECT value FROM settings WHERE key = ?", ['selectedPrinter']);
      if (row) {
        try {
            // value might be JSON string like "PrinterName" or just "PrinterName" depending on how it was saved.
            // In config route we do JSON.stringify.
            // So if I saved "HP Deskjet", it is stored as "\"HP Deskjet\"".
            targetPrinter = JSON.parse(row.value);
        } catch {
            targetPrinter = row.value;
        }
      }
    }

    if (!targetPrinter) {
      return NextResponse.json({ error: "Nenhuma impressora selecionada." }, { status: 400 });
    }

    // Sanitize printer name to avoid command injection (basic check)
    // PowerShell handles quotes, but let's be safe.
    const safePrinterName = targetPrinter.replace(/["$]/g, ''); 
    
    // For testing, we just print a simple text.
    // In production, we might want to print a PDF or raw bytes.
    // Using Out-Printer.
    const textToPrint = content || "Teste de impressão do Sistema de Restaurante.";
    const safeContent = textToPrint.replace(/["$]/g, '');

    const command = `powershell -Command "Write-Output '${safeContent}' | Out-Printer -Name '${safePrinterName}'"`;

    console.log(`Printing to ${safePrinterName}: ${safeContent}`);
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error('Print stderr:', stderr);
    }

    return NextResponse.json({ success: true, message: `Enviado para ${safePrinterName}` });

  } catch (error: any) {
    console.error('Print error:', error);
    return NextResponse.json({ error: "Falha na impressão: " + error.message }, { status: 500 });
  }
}
