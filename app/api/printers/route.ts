import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Comando PowerShell para listar impressoras em formato JSON
    // Filtra apenas campos relevantes: Nome, Status, Tipo, Porta
    const command = `powershell -Command "Get-Printer | Select-Object Name,PrinterStatus,PortName,DriverName | ConvertTo-Json"`;
    
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error('Erro ao listar impressoras (stderr):', stderr);
    }

    let printers = [];
    try {
      printers = JSON.parse(stdout);
      // Se tiver apenas uma impressora, o PowerShell retorna um objeto, não array. Normalizamos.
      if (!Array.isArray(printers)) {
        printers = [printers];
      }
    } catch (parseError) {
      console.error('Erro ao fazer parse das impressoras:', parseError);
      return NextResponse.json({ error: "Falha ao processar lista de impressoras" }, { status: 500 });
    }

    return NextResponse.json(printers);
  } catch (error: any) {
    console.error('Erro ao executar comando de impressora:', error);
    return NextResponse.json({ 
      error: "Falha ao listar impressoras. Certifique-se de que o servidor está rodando em um ambiente Windows com permissões." 
    }, { status: 500 });
  }
}
