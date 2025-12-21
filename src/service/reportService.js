const ExcelJS = require('exceljs');
const StoreSummary = require('../schemas/storesSummary.model');
const ZoneSummary = require('../schemas/zonesSummary.model');
const StoreModel = require('../schemas/store.model'); 
const { getDateRangeVN } = require('../utils/tranformHoursVN');
const { analyzeZone } = require('../utils/zoneAnalysisEngine'); 

const getValue = (obj, path) => {
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
};

const getPreviousDates = (start, end) => {
    const duration = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);
    return { prevStart, prevEnd };
};

const aggregateData = (storeDocs, zoneDocs) => {
  const totalStore = { visitors: 0, revenue: 0, invoices: 0, dwell_sum: 0, count: 0 };
  const productMap = new Map();
  storeDocs.forEach(doc => {
    if (doc.kpis) {
      totalStore.visitors += (doc.kpis.total_visitors || 0);
      totalStore.revenue += (doc.kpis.total_revenue || 0);
      totalStore.invoices += (doc.kpis.total_invoices || 0);
      totalStore.dwell_sum += (doc.kpis.avg_store_dwell_time || 0);
    }
    totalStore.count++;
    if (doc.top_products) {
      doc.top_products.forEach(p => {
        if (productMap.has(p.product_id)) {
          const existing = productMap.get(p.product_id);
          existing.total_quantity += p.total_quantity;
          existing.total_revenue += p.total_revenue;
        } else {
          productMap.set(p.product_id, { ...p });
        }
      });
    }
  });

  const zoneMap = new Map();
  zoneDocs.forEach(z => {
    const key = z.category_name || z.zone_id;
    const dailyTotalDwellTime = (z.performance.avg_dwell_time || 0) * (z.performance.people_count || 0);
    if (zoneMap.has(key)) {
      const ex = zoneMap.get(key);
      ex.performance.people_count += (z.performance.people_count || 0);
      ex.performance.total_sales_value += (z.performance.total_sales_value || 0);
      ex._temp_total_dwell = (ex._temp_total_dwell || 0) + dailyTotalDwellTime;
    } else {
      const newZone = JSON.parse(JSON.stringify(z));
      newZone._temp_total_dwell = dailyTotalDwellTime;
      zoneMap.set(key, newZone);
    }
  });

  const finalZones = Array.from(zoneMap.values()).map(z => {
      if (z.performance.people_count > 0) {
          z.performance.avg_dwell_time = parseFloat((z._temp_total_dwell / z.performance.people_count).toFixed(1));
      } else {
          z.performance.avg_dwell_time = 0;
      }
      delete z._temp_total_dwell; 
      return z;
  });

  return {
    overview: {
      kpis: {
        total_visitors: totalStore.visitors,
        total_revenue: totalStore.revenue,
        total_invoices: totalStore.invoices,
        avg_store_dwell_time: (totalStore.dwell_sum / (totalStore.count || 1)).toFixed(1),
        conversion_rate: totalStore.visitors ? ((totalStore.invoices / totalStore.visitors) * 100).toFixed(2) : 0,
        avg_basket_value: totalStore.invoices ? Math.round(totalStore.revenue / totalStore.invoices) : 0,
        peak_hour: -1 
      }
    },
    mergedProducts: Array.from(productMap.values()).sort((a, b) => b.total_revenue - a.total_revenue),
    mergedZones: finalZones
  };
};

const aggregatePreviousZones = (zoneDocs) => {
    const tempMap = {}; 
    zoneDocs.forEach(z => {
        const key = z.category_name || z.zone_id;
        const count = z.performance.people_count || 0;
        const avgTime = z.performance.avg_dwell_time || 0;
        if (!tempMap[key]) tempMap[key] = { totalTime: 0, totalPeople: 0 };
        tempMap[key].totalTime += (avgTime * count); 
        tempMap[key].totalPeople += count;
    });
    const prevMap = {};
    Object.keys(tempMap).forEach(key => {
        const item = tempMap[key];
        prevMap[key] = item.totalPeople > 0 ? (item.totalTime / item.totalPeople) : 0;
    });
    return prevMap;
};

const aggregatePreviousProducts = (storeDocs) => {
    const prevMap = {};
    storeDocs.forEach(doc => {
        if(doc.top_products){
            doc.top_products.forEach(p => {
                prevMap[p.product_id] = (prevMap[p.product_id] || 0) + (p.total_revenue || 0);
            });
        }
    });
    return prevMap;
};

const generateAIInsights = (overview, products, zones) => {
    const insights = [];
    if (products.length > 0) insights.push(`🏆 Sản phẩm ngôi sao: "${products[0].product_name}" đang dẫn đầu doanh thu.`);
    const cvRate = parseFloat(overview.kpis.conversion_rate);
    if (cvRate > 20) insights.push(`✅ Hiệu suất chốt đơn: Rất tốt (${cvRate}%).`);
    else if (cvRate < 5 && cvRate > 0) insights.push(`⚠️ Cảnh báo: Tỷ lệ mua hàng thấp (${cvRate}%).`);

    if (zones.length > 0) {
         insights.push('\n🌡️ BẢN ĐỒ NHIỆT ĐỘ KHU VỰC (Từ Nóng -> Lạnh):');
         const sortedZones = zones.sort((a, b) => (b.performance.people_count || 0) - (a.performance.people_count || 0));
         sortedZones.forEach((z, index) => {
             const count = z.performance.people_count || 0;
             const name = z.category_name || z.zone_id;
             if (index < 5) insights.push(`   • ${name}: ${count} khách`);
         });
    }
    return insights.length > 0 ? insights.join('\n') : "Đang thu thập dữ liệu...";
};

//  PHẦN 2: DRAWING HELPER FUNCTIONS

const drawSimpleCard = (sheet, r, c, title, val, color) => {
    sheet.mergeCells(r, c, r + 1, c);
    const cell = sheet.getCell(r, c);
    cell.value = {
        'richText': [
            { 'font': { 'size': 10, 'color': { 'argb': 'FF777777' }, 'name': 'Calibri', 'bold': true }, 'text': title.toUpperCase() + '\n' },
            { 'font': { 'size': 18, 'color': { 'argb': color }, 'name': 'Calibri', 'bold': true }, 'text': val }
        ]
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, shrinkToFit: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; 
    cell.border = {
        top: { style: 'thick', color: { argb: color } }, 
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
    };
};

const addSectionHeader = (sheet, startRow, title, lastCol, color) => {
    sheet.mergeCells(startRow, 1, startRow, lastCol);
    const cell = sheet.getCell(startRow, 1);
    cell.value = title.toUpperCase();
    cell.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } }; 
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } }; 
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getRow(startRow).height = 25;
};

const addTotalRow = (sheet, rowIdx, labelColIndex, labelText, valuesMap) => {
    const row = sheet.getRow(rowIdx);
    row.getCell(labelColIndex).value = labelText;
    Object.keys(valuesMap).forEach(colIdx => {
        const cell = row.getCell(parseInt(colIdx));
        cell.value = valuesMap[colIdx];
        cell.numFmt = '#,##0';
        cell.alignment = { horizontal: 'right' };
    });
    row.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF203764' } }; 
    row.height = 25;
    for(let i=1; i<=sheet.columnCount; i++){
        const cell = row.getCell(i);
        cell.border = { top: { style: 'double', color: { argb: 'FFFFFFFF' } }, bottom: { style: 'medium', color: { argb: 'FF000000' } } };
         if(i===labelColIndex) cell.alignment = { horizontal: 'center', vertical: 'middle' };
         else if(!valuesMap[i]) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF203764' } }; 
    }
};

const applyTableStyleInRange = (sheet, startRow, endRow, headerColor) => {
    const headerRow = sheet.getRow(startRow);
    headerRow.height = 25;
    headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColor } }; 
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    for(let r = startRow + 1; r <= endRow; r++){
        const row = sheet.getRow(r);
        row.eachCell(cell => {
            cell.border = { bottom: { style: 'dotted', color: { argb: 'FFCCCCCC' } } };
            if (typeof cell.value === 'number' && !cell.numFmt) {
                 cell.numFmt = '#,##0';
                 cell.alignment = { horizontal: 'right' };
            }
            if (r % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } }; 
        });
    }
};

// =============================================================================
// PHẦN 3: MAIN FUNCTION
// =============================================================================

const generateReportWorkbook = async (store_id, dateParams, reportConfig, extraData) => {
    const { range, startDate, endDate } = dateParams;
    const { managerName, storeAddress } = extraData;

    // 1. Lấy thông tin Store
    const storeInfo = await StoreModel.findOne({ store_id: store_id }).lean();
    
    // Ưu tiên dùng dữ liệu từ DB, nếu không có thì dùng cái FE gửi lên
    const finalStoreName = storeInfo ? storeInfo.store_name : `Cửa hàng ${store_id}`;
    const finalAddress = storeInfo ? storeInfo.address : (storeAddress || "Đang cập nhật");
    const finalReporter = managerName || "Hệ thống";
    const exportTime = new Date().toLocaleString('vi-VN', { hour12: false });

    // 2. Xử lý ngày tháng
    let start, end, label;
    if (startDate && endDate) {
        start = new Date(startDate); start.setHours(0, 0, 0, 0);
        end = new Date(endDate); end.setHours(23, 59, 59, 999);
        label = 'TÙY CHỌN';
    } else {
        const rangeKey = range || 'today';
        const dates = getDateRangeVN(rangeKey);
        start = dates.start;
        end = dates.end;
        const map = { 'today': 'HÔM NAY', 'yesterday': 'HÔM QUA', '7days': '7 NGÀY QUA', '30days': '30 NGÀY QUA', 'quarter': 'QUÝ NÀY', 'year': 'NĂM NAY' };
        label = map[rangeKey] || rangeKey.toUpperCase();
    }

    // 3. Query Data HIỆN TẠI
    const query = { store_id: store_id, date: { $gte: start, $lte: end } };
    const storeDocs = await StoreSummary.find(query).sort({ date: 1 }).lean();
    const zoneDocs = await ZoneSummary.find(query).lean();

    if (!storeDocs || storeDocs.length === 0) {
    // Vẫn cho chạy tiếp nhưng cảnh báo hoặc xử lý mảng rỗng
    console.log("⚠️ Cảnh báo: Không có dữ liệu StoreSummary cho store:", store_id);
    // return null; // <--- Tạm thời comment dòng này lại nếu muốn ép xuất file rỗng
}

    // -------------------------------------------------------------
    // 👉 4. (MỚI THÊM) QUERY DỮ LIỆU QUÁ KHỨ ĐỂ SO SÁNH (GROWTH)
    // -------------------------------------------------------------
    const { prevStart, prevEnd } = getPreviousDates(start, end);
    const prevQuery = { store_id: store_id, date: { $gte: prevStart, $lte: prevEnd } };
    
    // Lấy dữ liệu cũ song song
    const [prevStoreDocs, prevZoneDocs] = await Promise.all([
        StoreSummary.find(prevQuery).lean(),
        ZoneSummary.find(prevQuery).lean()
    ]);

    // Tạo Map dữ liệu cũ để tra cứu
    const prevZoneMap = aggregatePreviousZones(prevZoneDocs);
    const prevProductMap = aggregatePreviousProducts(prevStoreDocs);
    // -------------------------------------------------------------


    // 5. Tổng hợp dữ liệu HIỆN TẠI
    const isSingleDay = storeDocs.length === 1;
    const aggregated = isSingleDay 
        ? { overview: { ...storeDocs[0], kpis: { ...storeDocs[0].kpis, peak_hour: -1 } }, mergedProducts: storeDocs[0].top_products || [], mergedZones: zoneDocs } 
        : aggregateData(storeDocs, zoneDocs);
    
    const { overview, mergedProducts, mergedZones } = aggregated;
    const dateStr = `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;

    // 6. VẼ EXCEL
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Báo Cáo', { views: [{ showGridLines: false }] });
    
    // Setup Columns
    sheet.getColumn(1).width = 5; 
    sheet.getColumn(2).width = 25; 
    sheet.getColumn(3).width = 25; 
    sheet.getColumn(4).width = 25; 
    sheet.getColumn(5).width = 25; 

    // --- HEADER BÁO CÁO ---
    sheet.mergeCells('B2:E2');
    const dTitle = sheet.getCell('B2');
    dTitle.value = `BÁO CÁO HIỆU SUẤT - ${label}`;
    dTitle.font = { size: 20, bold: true, color: { argb: 'FF203764' } }; 
    dTitle.alignment = { horizontal: 'center' };
    
    sheet.mergeCells('B3:E3');
    sheet.getCell('B3').value = `Giai đoạn: ${dateStr}`;
    sheet.getCell('B3').alignment = { horizontal: 'center', vertical: 'top' };
    sheet.getCell('B3').font = { italic: true, color: { argb: 'FF555555' } };

    // Dòng 5: Cửa hàng
    sheet.mergeCells('B5:E5');
    sheet.getCell('B5').value = { 'richText': [
        {'font': {'bold': true, 'size': 11}, 'text': '🏢 Cửa hàng: '},
        {'font': {'size': 11}, 'text': finalStoreName}
    ]};

    // Dòng 6: Địa chỉ
    sheet.mergeCells('B6:E6');
    sheet.getCell('B6').value = { 'richText': [
        {'font': {'bold': true, 'size': 11}, 'text': '📍 Địa chỉ: '},
        {'font': {'size': 11}, 'text': finalAddress}
    ]};

    // Dòng 7: Người xuất
    sheet.mergeCells('B7:E7');
    const metaCell = sheet.getCell('B7');
    metaCell.value = { 'richText': [
        {'font': {'bold': true, 'size': 11}, 'text': '👤 Người xuất: '},
        {'font': {'size': 11}, 'text': `${finalReporter}      `},
        {'font': {'bold': true, 'size': 11}, 'text': '🕒 Thời gian: '},
        {'font': {'size': 11}, 'text': exportTime}
    ]};
    metaCell.alignment = { horizontal: 'left' };
    metaCell.border = { bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } } };

    // =========================================================
    // 2. KPIS
    // =========================================================
    const kpiRow = 9;
    const kpi = overview.kpis || {};

    sheet.getRow(kpiRow).height = 30; 
    sheet.getRow(kpiRow + 1).height = 30;

    drawSimpleCard(sheet, kpiRow, 2, 'Doanh thu', (kpi.total_revenue || 0).toLocaleString() + '₫', 'FF1F4E78'); 
    drawSimpleCard(sheet, kpiRow, 3, 'Khách hàng', (kpi.total_visitors || 0).toLocaleString(), 'FFC00000');     
    drawSimpleCard(sheet, kpiRow, 4, 'Đơn hàng', (kpi.total_invoices || 0).toLocaleString(), 'FF70AD47');       
    
    const avgOrder = kpi.total_invoices ? Math.round(kpi.total_revenue / kpi.total_invoices) : 0;
    drawSimpleCard(sheet, kpiRow, 5, 'TB Đơn', avgOrder.toLocaleString() + '₫', 'FFED7D31');

    // =========================================================
    // 3. AI INSIGHTS
    // =========================================================
    const aiStartRow = kpiRow + 3; // Dòng 12
    sheet.mergeCells(`B${aiStartRow}:E${aiStartRow + 10}`); 
    const aiCell = sheet.getCell(`B${aiStartRow}`);
    const aiText = generateAIInsights(overview, mergedProducts, mergedZones);
    aiCell.value = {
        'richText': [
            { 'font': { 'size': 12, 'bold': true, 'color': { 'argb': 'FF9C5700' } }, 'text': '💡 GÓC NHÌN AI & ĐỀ XUẤT:\n\n' },
            { 'font': { 'size': 11, 'color': { 'argb': 'FF333333' } }, 'text': aiText }
        ]
    };
    aiCell.alignment = { vertical: 'top', wrapText: true };
    aiCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } }; 
    aiCell.border = { top: { style: 'medium', color: { argb: 'FF9C5700' } }, bottom: { style: 'medium', color: { argb: 'FF9C5700' } }, left: { style: 'medium', color: { argb: 'FF9C5700' } }, right: { style: 'medium', color: { argb: 'FF9C5700' } } };

    let currentRow = aiStartRow + 13; 

    // =========================================================
    // 4. ZONE TRAFFIC (LƯU LƯỢNG)
    // =========================================================
    if (reportConfig.zoneHeaders) {
        const growthColIndex = 5; 
        addSectionHeader(sheet, currentRow, 'PHÂN TÍCH LƯU LƯỢNG KHU VỰC', 5, 'FFC00000'); 
        currentRow++;

        const headerRow = sheet.getRow(currentRow);
        reportConfig.zoneHeaders.forEach((h, i) => headerRow.getCell(i+2).value = h.label.replace('(s)', '').trim());
        headerRow.getCell(growthColIndex).value = "% Thay Đổi";
        
        const startDataRow = currentRow + 1;
        mergedZones.forEach(z => {
            currentRow++;
            const row = sheet.getRow(currentRow);
            reportConfig.zoneHeaders.forEach((h, i) => row.getCell(i + 2).value = getValue(z, h.key));

            const key = z.category_name || z.zone_id;
            const currentTime = z.performance.avg_dwell_time || 0;
            
            // 👉 DÙNG PREV DATA ĐỂ TÍNH TOÁN
            const prevTime = prevZoneMap[key] || 0; 
            let growth = 0;
            if (prevTime > 0) growth = (currentTime - prevTime) / prevTime;
            else if (currentTime > 0) growth = 1;

            row.getCell(growthColIndex).value = growth;
        });

        applyTableStyleInRange(sheet, startDataRow - 1, currentRow, 'FF4472C4');

        // Format Growth
        const gLet = sheet.getColumn(growthColIndex).letter;
        sheet.getColumn(growthColIndex).numFmt = '0.0%';
        sheet.addConditionalFormatting({
            ref: `${gLet}${startDataRow}:${gLet}${currentRow}`,
            rules: [
                { type: 'expression', formulae: [`${gLet}${startDataRow}>0`], style: { font: { color: { argb: 'FF00B050' }, bold: true } } },
                { type: 'expression', formulae: [`${gLet}${startDataRow}<0`], style: { font: { color: { argb: 'FFFF0000' }, bold: true } } }
            ]
        });
    }

    currentRow += 4;

    // =========================================================
    // 5. ZONE EFFICIENCY ANALYSIS
    // =========================================================
    // Tính Benchmark
    let benchmarks = { avgTime: 0, avgSales: 0 };
    if (mergedZones.length > 0) {
        const count = mergedZones.length;
        const totalTime = mergedZones.reduce((sum, z) => sum + (getValue(z, 'performance.avg_dwell_time') || 0), 0);
        const totalSales = mergedZones.reduce((sum, z) => sum + (getValue(z, 'performance.total_sales_value') || 0), 0);
        benchmarks = { avgTime: totalTime / count, avgSales: totalSales / count };
    }

    addSectionHeader(sheet, currentRow, 'PHÂN TÍCH HIỆU QUẢ KINH DOANH (MA TRẬN BCG)', 6, 'FF7030A0'); 
    currentRow++;

    const effHeader = sheet.getRow(currentRow);
    effHeader.getCell(2).value = "KHU VỰC";
    effHeader.getCell(3).value = "TG DỪNG (TB)";
    effHeader.getCell(4).value = "DOANH THU";
    effHeader.getCell(5).value = "ĐÁNH GIÁ"; 
    effHeader.getCell(6).value = "HÀNH ĐỘNG";
    
    effHeader.height = 30;
    effHeader.eachCell((cell, colNumber) => {
        if (colNumber >= 2 && colNumber <= 6) { 
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5B2585' } }; 
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { bottom: { style: 'medium', color: { argb: 'FFFFFFFF' } } };
        }
    });

    const startEffRow = currentRow + 1;
    const sortedBySales = [...mergedZones].sort((a,b) => (getValue(b, 'performance.total_sales_value')||0) - (getValue(a, 'performance.total_sales_value')||0));

    sortedBySales.forEach(z => {
        currentRow++;
        const row = sheet.getRow(currentRow);
        row.height = 35;

        const name = z.category_name || z.zone_id;
        const dwell = getValue(z, 'performance.avg_dwell_time') || 0;
        const sales = getValue(z, 'performance.total_sales_value') || 0;
        const people = getValue(z, 'performance.people_count') || 0;

        const analysisInput = { avgTime: dwell, totalSales: sales, peopleCount: people };
        const analysis = analyzeZone(analysisInput, benchmarks);
        const colorHex = analysis.color || 'FF000000'; 

        row.getCell(2).value = name;
        row.getCell(3).value = dwell;
        row.getCell(4).value = sales;
        
        const ratingCell = row.getCell(5);
        ratingCell.value = `● ${analysis.label}`; 
        ratingCell.font = { bold: true, color: { argb: colorHex }, size: 11 }; 
        ratingCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

        const actionCell = row.getCell(6);
        actionCell.value = analysis.action;
        actionCell.font = { italic: true, color: { argb: 'FF444444' } }; 
        actionCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

        row.eachCell((cell, colNum) => {
            if (colNum === 2) {
                cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                cell.font = { bold: true, color: { argb: 'FF333333' } };
            } else if (colNum === 3 || colNum === 4) {
                cell.alignment = { vertical: 'middle', horizontal: 'right' };
            }
            if(colNum >= 2 && colNum <= 6) cell.border = { bottom: { style: 'dotted', color: { argb: 'FFCCCCCC' } } };
        });
    });

    sheet.getColumn(3).numFmt = '0.0 "giây"';
    sheet.getColumn(4).numFmt = '#,##0';
    for(let r = startEffRow; r <= currentRow; r++){
        if (r % 2 === 0) {
            const row = sheet.getRow(r);
            for(let c = 2; c <= 6; c++) row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAFAFA' } }; 
        }
    }

    currentRow += 4;

    // =========================================================
    // 6. PRODUCT ANALYSIS
    // =========================================================
    if (reportConfig.productHeaders) {
        const growthColIndex = reportConfig.productHeaders.length + 2; 
        const revColIdx = reportConfig.productHeaders.findIndex(h => h.key.includes('revenue')) + 2;
        
        addSectionHeader(sheet, currentRow, 'CHI TIẾT HIỆU QUẢ SẢN PHẨM', growthColIndex, 'FF1F4E78');
        currentRow++;

        const headerRow = sheet.getRow(currentRow);
        reportConfig.productHeaders.forEach((h, i) => headerRow.getCell(i+2).value = h.label);
        headerRow.getCell(growthColIndex).value = "% Thay Đổi";
        
        headerRow.eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } }; 
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        
        let listTotalQty = 0;
        let listTotalRev = 0;
        const startDataRow = currentRow + 1;

        mergedProducts.forEach((p, idx) => {
            currentRow++;
            const row = sheet.getRow(currentRow);

            listTotalQty += (p.total_quantity || 0);
            listTotalRev += (p.total_revenue || 0);

            reportConfig.productHeaders.forEach((h, colIdx) => {
                const currentCellCol = colIdx + 2;
                const val = h.key === 'rank' ? idx + 1 : getValue(p, h.key);
                const cell = row.getCell(currentCellCol);
                cell.value = val;
                if (h.key.includes('revenue') || h.key.includes('price')) {
                     cell.numFmt = '#,##0'; 
                     cell.alignment = { horizontal: 'right' };
                } else if (typeof val === 'number') {
                     cell.numFmt = '#,##0'; 
                     cell.alignment = { horizontal: 'right' };
                }
            });

            const currentRev = p.total_revenue || 0;
            // 👉 DÙNG PREV DATA ĐỂ TÍNH TOÁN
            const prevRev = prevProductMap[p.product_id] || 0;
            let growth = 0;
            if (prevRev > 0) growth = (currentRev - prevRev) / prevRev;
            else if (currentRev > 0) growth = 1;
            
            const growthCell = row.getCell(growthColIndex);
            growthCell.value = growth;
            growthCell.numFmt = '0.0%'; 
            growthCell.alignment = { horizontal: 'right' };
            
            row.eachCell(cell => {
                cell.border = { bottom: { style: 'dotted', color: { argb: 'FFCCCCCC' } } };
            });
        });

        const kpiTotalRevenue = overview.kpis.total_revenue || 0;
        const remainingRevenue = kpiTotalRevenue - listTotalRev;

        if (remainingRevenue > 0) {
            currentRow++;
            const row = sheet.getRow(currentRow);
            row.getCell(2).value = "..."; 
            const nameCell = row.getCell(3);
            nameCell.value = "Các sản phẩm khác (Ngoài Top List)";
            nameCell.font = { italic: true, color: { argb: 'FF666666' } };

            if(revColIdx > 1) {
                const revCell = row.getCell(revColIdx);
                revCell.value = remainingRevenue;
                revCell.numFmt = '#,##0';
                revCell.alignment = { horizontal: 'right' };
                revCell.font = { italic: true };
            }
            row.eachCell(cell => { cell.border = { bottom: { style: 'dotted', color: { argb: 'FFCCCCCC' } } }; });
        }

        currentRow++;
        const qtyColIdx = reportConfig.productHeaders.findIndex(h => h.key.includes('quantity')) + 2;
        const dynamicValuesMap = {};
        if(revColIdx > 1) dynamicValuesMap[revColIdx] = kpiTotalRevenue; 
        if(qtyColIdx > 1) dynamicValuesMap[qtyColIdx] = listTotalQty; 

        addTotalRow(sheet, currentRow, 3, 'TỔNG CỘNG', dynamicValuesMap);

        const lastDataRow = currentRow - 1;
        if (lastDataRow >= startDataRow) {
             const gLet = sheet.getColumn(growthColIndex).letter;
             sheet.addConditionalFormatting({
                ref: `${gLet}${startDataRow}:${gLet}${lastDataRow}`,
                rules: [
                    { type: 'expression', formulae: [`AND(ISNUMBER(${gLet}${startDataRow}), ${gLet}${startDataRow}>0)`], style: { font: { color: { argb: 'FF00B050' }, bold: true } } },
                    { type: 'expression', formulae: [`AND(ISNUMBER(${gLet}${startDataRow}), ${gLet}${startDataRow}<0)`], style: { font: { color: { argb: 'FFFF0000' }, bold: true } } }
                ]
            });
        }
    }

    return workbook;
};

module.exports = { generateReportWorkbook };