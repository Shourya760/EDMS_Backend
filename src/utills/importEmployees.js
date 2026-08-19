import XLSX from "xlsx";

export const importEmployees = async (file) => {
    const workbook = XLSX.read(file.buffer, {
        type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const employees = XLSX.utils.sheet_to_json(sheet);

    // console.log("Imported Employees", employees);

    return employees;
};