import { GoogleSheetsService } from './googleSheetsService.js'
export class SyncService { constructor(sheetService = new GoogleSheetsService()) { this.sheetService = sheetService } async previewSheet() { return this.sheetService.readRows() } }
