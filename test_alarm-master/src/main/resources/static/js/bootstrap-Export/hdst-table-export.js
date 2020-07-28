var TableExport = function() {
    "use strict";
    // function to initiate HTML Table Export
    var runTableExportTools = function(tableName,fileName) {
//		$(".export-excel").on("click", function(e) {
//			e.preventDefault();
        var exportTable = $(this).data("table");
        if(tableName){
            exportTable =$('#'+tableName);
        }
        var ignoreColumn = $(this).data("ignorecolumn");
        exportTable.tableExport({
            type : 'excel',
            escape : 'false',
            fileName: fileName,
            worksheetName: fileName,
            excelstyles: ['background-color', 'color', 'font-size', 'font-weight'],//['background-color', 'color', 'font-size', 'font-weight'],
            ignoreColumn : '[' + ignoreColumn + ']'
        });
//		});
    };
    return {
        // main function to initiate template pages
        init : function(tableName,fileName) {
            runTableExportTools(tableName,fileName);
        }
    };
}(jQuery);