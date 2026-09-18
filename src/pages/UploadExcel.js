import React, { useState } from "react";
import * as XLSX from "xlsx";
import api from "../api/AxiosConfig";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UploadExcel() {

    const { logout } = useAuth();
        const navigate = useNavigate();
    
        const handleLogout = () => {
            logout();
            navigate("/");
        };

    // =========================================================
    // STATES
    // =========================================================

    const [file, setFile] = useState(null);

    const [data, setData] = useState([]);

    const [errors, setErrors] = useState([]);

    const [approved, setApproved] = useState(false);

    const [uploading, setUploading] = useState(false);


    // =========================================================
    // REQUIRED EXCEL COLUMNS
    // =========================================================

    const requiredColumns = [
        "Student_name",
        "Reg_no",
        "Course",
        "Branch",
        "Year",
        "Sem",
        "Sec",
        "Event_name",
        "Event_date",
        "Start_time",
        "End_time"
    ];


    // =========================================================
    // FORMAT EXCEL DATE
    // OUTPUT: YYYY-MM-DD
    // =========================================================

    const formatExcelDate = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "";
        }


        // -----------------------------------------
        // JavaScript Date
        // -----------------------------------------

        if (value instanceof Date) {

            const year =
                value.getFullYear();

            const month =
                String(
                    value.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    value.getDate()
                ).padStart(2, "0");

            return `${year}-${month}-${day}`;
        }


        // -----------------------------------------
        // Excel serial number
        // -----------------------------------------

        if (typeof value === "number") {

            const date =
                XLSX.SSF.parse_date_code(value);

            if (date) {

                const year = date.y;

                const month =
                    String(date.m)
                        .padStart(2, "0");

                const day =
                    String(date.d)
                        .padStart(2, "0");

                return `${year}-${month}-${day}`;
            }
        }


        // -----------------------------------------
        // String value
        // -----------------------------------------

        const stringValue =
            String(value).trim();


        // YYYY-MM-DD

        if (
            /^\d{4}-\d{2}-\d{2}$/
                .test(stringValue)
        ) {

            return stringValue;
        }


        // DD/MM/YYYY

        if (
            /^\d{2}\/\d{2}\/\d{4}$/
                .test(stringValue)
        ) {

            const [
                day,
                month,
                year
            ] =
                stringValue.split("/");

            return `${year}-${month}-${day}`;
        }


        // DD-MM-YYYY

        if (
            /^\d{2}-\d{2}-\d{4}$/
                .test(stringValue)
        ) {

            const [
                day,
                month,
                year
            ] =
                stringValue.split("-");

            return `${year}-${month}-${day}`;
        }


        return stringValue;
    };


    // =========================================================
    // FORMAT EXCEL TIME
    // OUTPUT: HH:MM:SS
    // =========================================================

    const formatExcelTime = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "";
        }


        // -----------------------------------------
        // Excel decimal time
        // -----------------------------------------

        if (typeof value === "number") {

            const totalSeconds =
                Math.round(
                    value * 24 * 60 * 60
                );


            const hours =
                Math.floor(
                    totalSeconds / 3600
                );


            const minutes =
                Math.floor(
                    (totalSeconds % 3600) / 60
                );


            const seconds =
                totalSeconds % 60;


            return (
                `${String(hours).padStart(2, "0")}:` +
                `${String(minutes).padStart(2, "0")}:` +
                `${String(seconds).padStart(2, "0")}`
            );
        }


        // -----------------------------------------
        // JavaScript Date
        // -----------------------------------------

        if (value instanceof Date) {

            const hours =
                String(
                    value.getHours()
                ).padStart(2, "0");


            const minutes =
                String(
                    value.getMinutes()
                ).padStart(2, "0");


            const seconds =
                String(
                    value.getSeconds()
                ).padStart(2, "0");


            return `${hours}:${minutes}:${seconds}`;
        }


        // -----------------------------------------
        // String value
        // -----------------------------------------

        const stringValue =
            String(value).trim();


        // HH:MM

        if (
            /^\d{1,2}:\d{2}$/
                .test(stringValue)
        ) {

            const [
                hours,
                minutes
            ] =
                stringValue.split(":");


            return (
                `${String(hours).padStart(2, "0")}:` +
                `${minutes}:00`
            );
        }


        // HH:MM:SS

        if (
            /^\d{1,2}:\d{2}:\d{2}$/
                .test(stringValue)
        ) {

            const [
                hours,
                minutes,
                seconds
            ] =
                stringValue.split(":");


            return (
                `${String(hours).padStart(2, "0")}:` +
                `${minutes}:` +
                `${seconds}`
            );
        }


        return stringValue;
    };


    // =========================================================
    // HANDLE EXCEL FILE SELECTION
    // =========================================================

    const handleFileChange = (e) => {

        const selectedFile =
            e.target.files[0];


        // -----------------------------------------
        // RESET PREVIOUS DATA
        // -----------------------------------------

        setFile(null);

        setData([]);

        setErrors([]);

        setApproved(false);


        // -----------------------------------------
        // NO FILE
        // -----------------------------------------

        if (!selectedFile) {
            return;
        }


        // -----------------------------------------
        // CHECK FILE TYPE
        // -----------------------------------------

        const fileName =
            selectedFile.name.toLowerCase();


        if (
            !fileName.endsWith(".xlsx") &&
            !fileName.endsWith(".xls")
        ) {

            toast.error(
                "Please select a valid Excel file (.xlsx or .xls)."
            );

            return;
        }


        // Store file

        setFile(selectedFile);


        // -----------------------------------------
        // READ EXCEL FILE
        // -----------------------------------------

        const reader =
            new FileReader();


        reader.onload = (event) => {

            try {

                const binaryData =
                    event.target.result;


                // -------------------------------------
                // READ WORKBOOK
                // -------------------------------------

                const workbook =
                    XLSX.read(
                        binaryData,
                        {
                            type: "binary",
                            cellDates: true
                        }
                    );


                // -------------------------------------
                // FIRST SHEET
                // -------------------------------------

                const sheetName =
                    workbook.SheetNames[0];


                const worksheet =
                    workbook.Sheets[sheetName];


                // -------------------------------------
                // CONVERT EXCEL TO JSON
                // -------------------------------------

                const jsonData =
                    XLSX.utils.sheet_to_json(
                        worksheet,
                        {
                            defval: "",
                            cellDates: true
                        }
                    );


                // -------------------------------------
                // CHECK EMPTY EXCEL
                // -------------------------------------

                if (jsonData.length === 0) {

                    toast.error(
                        "The Excel file is empty."
                    );

                    return;
                }


                // -------------------------------------
                // CHECK REQUIRED COLUMNS
                // -------------------------------------

                const actualColumns =
                    Object.keys(
                        jsonData[0]
                    );


                const missingColumns =
                    requiredColumns.filter(
                        column =>
                            !actualColumns.includes(
                                column
                            )
                    );


                if (
                    missingColumns.length > 0
                ) {

                    toast.error(
                        `Missing columns: ${missingColumns.join(", ")}`
                    );

                    return;
                }


                // -------------------------------------
                // VALIDATE ROWS
                // -------------------------------------

                const rowErrors = [];


                jsonData.forEach(
                    (row, index) => {

                        const excelRowNumber =
                            index + 2;


                        // Student Name

                        if (
                            String(
                                row.Student_name
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Student name is missing.`
                            );
                        }


                        // Registration Number

                        if (
                            String(
                                row.Reg_no
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Registration number is missing.`
                            );
                        }


                        // Course

                        if (
                            String(
                                row.Course
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Course is missing.`
                            );
                        }


                        // Branch

                        if (
                            String(
                                row.Branch
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Branch is missing.`
                            );
                        }


                        // Year

                        if (
                            String(
                                row.Year
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Year is missing.`
                            );
                        }


                        // Semester

                        if (
                            String(
                                row.Sem
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Semester is missing.`
                            );
                        }


                        // Section

                        if (
                            String(
                                row.Sec
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Section is missing.`
                            );
                        }


                        // Event Name

                        if (
                            String(
                                row.Event_name
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Event name is missing.`
                            );
                        }


                        // Event Date

                        if (
                            String(
                                row.Event_date
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Event date is missing.`
                            );
                        }


                        // Start Time

                        if (
                            String(
                                row.Start_time
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: Start time is missing.`
                            );
                        }


                        // End Time

                        if (
                            String(
                                row.End_time
                            ).trim() === ""
                        ) {

                            rowErrors.push(
                                `Row ${excelRowNumber}: End time is missing.`
                            );
                        }

                    }
                );


                // -------------------------------------
                // STORE DATA AND ERRORS
                // -------------------------------------

                setErrors(rowErrors);

                setData(jsonData);


                // -------------------------------------
                // TOAST MESSAGE
                // -------------------------------------

                if (
                    rowErrors.length === 0
                ) {

                    toast.success(
                        "Excel file is valid. Please review all entries before approval."
                    );

                } else {

                    toast.error(
                        "Please correct the errors before uploading."
                    );
                }


            } catch (error) {

                console.error(
                    "Excel Reading Error:",
                    error
                );


                toast.error(
                    "Unable to read the Excel file."
                );
            }

        };


        reader.readAsBinaryString(
            selectedFile
        );
    };


    // =========================================================
    // HANDLE ADMIN APPROVAL
    // =========================================================

    const handleApprovalChange = (e) => {

        const isChecked =
            e.target.checked;


        setApproved(isChecked);


        if (isChecked) {

            toast.success(
                "Entries approved successfully."
            );

        } else {

            toast.info(
                "Approval has been removed."
            );

        }
    };


    // =========================================================
    // HANDLE UPLOAD
    // =========================================================

    const handleUpload = async (e) => {

        e.preventDefault();


        // -----------------------------------------
        // CHECK FILE
        // -----------------------------------------

        if (!file) {

            toast.error(
                "Please select an Excel file first."
            );

            return;
        }


        // -----------------------------------------
        // CHECK ERRORS
        // -----------------------------------------

        if (
            errors.length > 0
        ) {

            toast.error(
                "Please correct all Excel errors before uploading."
            );

            return;
        }


        // -----------------------------------------
        // CHECK APPROVAL
        // -----------------------------------------

        if (!approved) {

            toast.warning(
                "Please approve the entries before uploading."
            );

            return;
        }


        // =====================================================
        // CONVERT EXCEL DATA TO BACKEND FORMAT
        // =====================================================

        const students =
            data.map((row) => {

                return {

                    studentName:
                        String(
                            row.Student_name
                        ).trim(),


                    reg_no:
                        String(
                            row.Reg_no
                        ).trim(),


                    course:
                        String(
                            row.Course
                        ).trim(),


                    branch:
                        String(
                            row.Branch
                        ).trim(),


                    year:
                        Number(
                            row.Year
                        ),


                    sem:
                        Number(
                            row.Sem
                        ),


                    sec:
                        String(
                            row.Sec
                        ).trim(),


                    event_name:
                        String(
                            row.Event_name
                        ).trim(),


                    event_date:
                        formatExcelDate(
                            row.Event_date
                        ),


                    start_time:
                        formatExcelTime(
                            row.Start_time
                        ),


                    end_time:
                        formatExcelTime(
                            row.End_time
                        )

                };

            });


        // =====================================================
        // CONSOLE DEBUG
        // =====================================================

        console.log(
            "===================================="
        );

        console.log(
            "DATA BEING SENT TO SPRING BOOT"
        );

        console.log(
            "===================================="
        );

        console.log(
            "Total Records:",
            students.length
        );

        console.table(
            students
        );

        console.log(
            "JSON SENT TO BACKEND:"
        );

        console.log(
            JSON.stringify(
                students,
                null,
                2
            )
        );


        // =====================================================
        // SEND DATA TO SPRING BOOT
        // =====================================================

        try {

            setUploading(true);


            // Toast: Upload started

            toast.info(
                "Uploading data to database..."
            );


            const response =
                await api.post(
                    "/students",
                    students
                );


            console.log(
                "Backend Response:",
                response.data
            );


            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            toast.success(
                `${students.length} OD records uploaded successfully to the database.`
            );


            console.log(
                "Excel data successfully stored in database."
            );


        } catch (error) {

            console.error(
                "Upload Error:",
                error
            );


            if (
                error.response
            ) {

                console.error(
                    "Backend Status:",
                    error.response.status
                );


                console.error(
                    "Backend Response:",
                    error.response.data
                );


                console.error(
                    "Backend Headers:",
                    error.response.headers
                );

            }


            toast.error(
                "Failed to upload data to the database."
            );


        } finally {

            setUploading(false);

        }

    };


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setFile(null);

        setData([]);

        setErrors([]);

        setApproved(false);


        toast.info(
            "Upload form has been reset."
        );

    };


    // =========================================================
    // JSX
    // =========================================================

    return (


        <div className="upload-page">
            {/*===============Logout=====================*/}
            <nav className="navbar">

                <h2>OD Management System</h2>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </nav>
            

            {/* ================= MAIN CONTAINER ================= */}

            <div className="upload-container">

                <div className="upload-box">


                    <h1>
                        Upload OD Excel File
                    </h1>


                    <p>
                        Select the Excel file containing
                        student On-Duty details.
                    </p>


                    {/* ================= FILE INPUT ================= */}

                    <label className="file-label">

                        Select Excel File

                    </label>


                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={
                            handleFileChange
                        }
                    />


                    {/* ================= SELECTED FILE ================= */}

                    {file && (

                        <div className="selected-file">

                            <strong>
                                Selected File:
                            </strong>

                            <p>
                                {file.name}
                            </p>

                            <p>
                                Total Records: {data.length}
                            </p>

                        </div>

                    )}


                    {/* ================= ERRORS ================= */}

                    {errors.length > 0 && (

                        <div className="error-container">

                            <h3>
                                Excel Errors
                            </h3>


                            <ul>

                                {errors.map(
                                    (error, index) => (

                                        <li key={index}>
                                            {error}
                                        </li>

                                    )
                                )}

                            </ul>

                        </div>

                    )}


                    {/* ================= PREVIEW ================= */}

                    {data.length > 0 && (

                        <div className="preview-container">

                            <h2>
                                Excel Preview
                            </h2>


                            <div className="table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Student Name
                                            </th>

                                            <th>
                                                Reg No
                                            </th>

                                            <th>
                                                Course
                                            </th>

                                            <th>
                                                Branch
                                            </th>

                                            <th>
                                                Year
                                            </th>

                                            <th>
                                                Sem
                                            </th>

                                            <th>
                                                Sec
                                            </th>

                                            <th>
                                                Event Name
                                            </th>

                                            <th>
                                                Event Date
                                            </th>

                                            <th>
                                                Start Time
                                            </th>

                                            <th>
                                                End Time
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {data.map(
                                            (row, index) => (

                                                <tr key={index}>

                                                    <td>
                                                        {row.Student_name}
                                                    </td>

                                                    <td>
                                                        {row.Reg_no}
                                                    </td>

                                                    <td>
                                                        {row.Course}
                                                    </td>

                                                    <td>
                                                        {row.Branch}
                                                    </td>

                                                    <td>
                                                        {row.Year}
                                                    </td>

                                                    <td>
                                                        {row.Sem}
                                                    </td>

                                                    <td>
                                                        {row.Sec}
                                                    </td>

                                                    <td>
                                                        {row.Event_name}
                                                    </td>

                                                    <td>
                                                        {formatExcelDate(
                                                            row.Event_date
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatExcelTime(
                                                            row.Start_time
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatExcelTime(
                                                            row.End_time
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}


                    {/* ================= APPROVAL ================= */}

                    {data.length > 0 &&
                        errors.length === 0 && (

                            <div className="approval-box">

                                <label>

                                    <input
                                        type="checkbox"
                                        checked={approved}
                                        onChange={
                                            handleApprovalChange
                                        }
                                    />

                                    <span>

                                        I have reviewed all the
                                        entries and confirm that
                                        the information is correct.

                                    </span>

                                </label>

                            </div>

                        )}


                    {/* ================= BUTTONS ================= */}

                    <div className="button-container">


                        <button
                            type="button"
                            className="reset-button"
                            onClick={
                                handleReset
                            }
                            disabled={
                                uploading
                            }
                        >

                            Reset

                        </button>


                        <button
                            type="button"
                            className="upload-button"
                            disabled={
                                !approved ||
                                data.length === 0 ||
                                errors.length > 0 ||
                                uploading
                            }
                            onClick={
                                handleUpload
                            }
                        >

                            {uploading
                                ? "Uploading..."
                                : "Upload to Database"
                            }

                        </button>


                    </div>


                </div>

            </div>

        </div>

    );

}

export default UploadExcel;