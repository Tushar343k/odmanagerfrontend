import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/AxiosConfig";
import * as XLSX from "xlsx";

function UserDashboard() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    // ==========================================
    // FILTER STATES
    // ==========================================

    const [course, setCourse] = useState("");
    const [branch, setBranch] = useState("");
    const [year, setYear] = useState("");
    const [sec, setSec] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");


    // ==========================================
    // DROPDOWN DATA
    // ==========================================

    const [courses, setCourses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [years, setYears] = useState([]);
    const [sections, setSections] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventDates, setEventDates] = useState([]);
    const [startTimes, setStartTimes] = useState([]);
    const [endTimes, setEndTimes] = useState([]);


    // ==========================================
    // STUDENT DATA
    // ==========================================

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // ==========================================
    // PAGINATION
    // ==========================================

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [totalRecords, setTotalRecords] = useState(0);

    const pageSize = 5;


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        logout();

        navigate("/");
    };


    // ==========================================
    // GET STUDENTS
    // ==========================================

    const getStudents = async (
        selectedCourse = course,
        selectedBranch = branch,
        selectedYear = year,
        selectedSec = sec,
        selectedEventName = eventName,
        selectedEventDate = eventDate,
        selectedStartTime = startTime,
        selectedEndTime = endTime,
        selectedPage = 0
    ) => {

        try {

            setLoading(true);
            setError("");

            const params = {
                page: selectedPage,
                size: pageSize
            };


            // Add filters only when selected

            if (selectedCourse) {
                params.course = selectedCourse;
            }

            if (selectedBranch) {
                params.branch = selectedBranch;
            }

            if (selectedYear) {
                params.year = selectedYear;
            }

            if (selectedSec) {
                params.sec = selectedSec;
            }

            if (selectedEventName) {
                params.eventName = selectedEventName;
            }

            if (selectedEventDate) {
                params.eventDate = selectedEventDate;
            }

            if (selectedStartTime) {
                params.startTime = selectedStartTime;
            }

            if (selectedEndTime) {
                params.endTime = selectedEndTime;
            }


            const response = await api.get(
                "/students/page",
                {
                    params: params
                }
            );


            console.log(
                "Student Page Response:",
                response.data
            );


            // ==========================================
            // SET STUDENT DATA
            // ==========================================

            setStudents(response.data.content || []);


            // ==========================================
            // SET PAGINATION DATA
            // ==========================================

            setTotalPages(
                response.data.totalPages || 0
            );

            setTotalRecords(
                response.data.totalElements || 0
            );

            setPage(
                response.data.number || 0
            );

        } catch (err) {

            console.error(
                "Error retrieving students:",
                err
            );

            setError(
                "Unable to retrieve student data."
            );

            setStudents([]);

            setTotalPages(0);

            setTotalRecords(0);

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOAD COURSES + FIRST 100 RECORDS
    // WHEN DASHBOARD OPENS
    // ==========================================

    useEffect(() => {

        loadCourses();

        getStudents(
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            0
        );

    }, []);


    // ==========================================
    // LOAD COURSES
    // ==========================================

    const loadCourses = async () => {

        try {

            const response = await api.get(
                "/students/courses"
            );

            setCourses(response.data);

        } catch (err) {

            console.error(
                "Error loading courses:",
                err
            );
        }
    };


    // ==========================================
    // COURSE CHANGE
    // ==========================================

    const handleCourseChange = async (e) => {

        const selectedCourse = e.target.value;


        // Set selected course

        setCourse(selectedCourse);


        // Reset all lower filters

        setBranch("");
        setYear("");
        setSec("");
        setEventName("");
        setEventDate("");
        setStartTime("");
        setEndTime("");


        // Clear lower dropdowns

        setBranches([]);
        setYears([]);
        setSections([]);
        setEvents([]);
        setEventDates([]);
        setStartTimes([]);
        setEndTimes([]);


        if (!selectedCourse) {

            // Load all records

            getStudents(
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                0
            );

            return;
        }


        try {

            // Load branches for selected course

            const response = await api.get(
                "/students/branches",
                {
                    params: {
                        course: selectedCourse
                    }
                }
            );

            setBranches(response.data);


        } catch (err) {

            console.error(
                "Error loading branches:",
                err
            );
        }


        // Load filtered records

        getStudents(
            selectedCourse,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            0
        );
    };


    // ==========================================
    // BRANCH CHANGE
    // ==========================================

    const handleBranchChange = async (e) => {

        const selectedBranch = e.target.value;


        setBranch(selectedBranch);


        // Reset lower filters

        setYear("");
        setSec("");
        setEventName("");
        setEventDate("");
        setStartTime("");
        setEndTime("");


        setYears([]);
        setSections([]);
        setEvents([]);
        setEventDates([]);
        setStartTimes([]);
        setEndTimes([]);


        if (!selectedBranch) {

            getStudents(
                course,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                0
            );

            return;
        }


        try {

            const response = await api.get(
                "/students/years",
                {
                    params: {
                        course: course,
                        branch: selectedBranch
                    }
                }
            );

            setYears(response.data);


        } catch (err) {

            console.error(
                "Error loading years:",
                err
            );
        }


        getStudents(
            course,
            selectedBranch,
            "",
            "",
            "",
            "",
            "",
            "",
            0
        );
    };


    // ==========================================
    // YEAR CHANGE
    // ==========================================

    const handleYearChange = async (e) => {

        const selectedYear = e.target.value;


        setYear(selectedYear);


        // Reset lower filters

        setSec("");
        setEventName("");
        setEventDate("");
        setStartTime("");
        setEndTime("");


        setSections([]);
        setEvents([]);
        setEventDates([]);
        setStartTimes([]);
        setEndTimes([]);


        if (!selectedYear) {

            getStudents(
                course,
                branch,
                "",
                "",
                "",
                "",
                "",
                "",
                0
            );

            return;
        }


        try {

            const response = await api.get(
                "/students/sections",
                {
                    params: {
                        course: course,
                        branch: branch,
                        year: selectedYear
                    }
                }
            );

            setSections(response.data);


        } catch (err) {

            console.error(
                "Error loading sections:",
                err
            );
        }


        getStudents(
            course,
            branch,
            selectedYear,
            "",
            "",
            "",
            "",
            "",
            0
        );
    };


    // ==========================================
    // SECTION CHANGE
    // ==========================================

    const handleSectionChange = async (e) => {

        const selectedSec = e.target.value;


        setSec(selectedSec);


        // Reset lower filters

        setEventName("");
        setEventDate("");
        setStartTime("");
        setEndTime("");


        setEvents([]);
        setEventDates([]);
        setStartTimes([]);
        setEndTimes([]);


        if (!selectedSec) {

            getStudents(
                course,
                branch,
                year,
                "",
                "",
                "",
                "",
                "",
                0
            );

            return;
        }


        try {

            const response = await api.get(
                "/students/events",
                {
                    params: {
                        course: course,
                        branch: branch,
                        year: year,
                        sec: selectedSec
                    }
                }
            );

            setEvents(response.data);


        } catch (err) {

            console.error(
                "Error loading events:",
                err
            );
        }


        getStudents(
            course,
            branch,
            year,
            selectedSec,
            "",
            "",
            "",
            "",
            0
        );
    };


    // ==========================================
    // EVENT CHANGE
    // ==========================================

    const handleEventChange = async (e) => {

        const selectedEvent = e.target.value;


        setEventName(selectedEvent);


        // Reset lower filters

        setEventDate("");
        setStartTime("");
        setEndTime("");


        setEventDates([]);
        setStartTimes([]);
        setEndTimes([]);


        if (!selectedEvent) {

            getStudents(
                course,
                branch,
                year,
                sec,
                "",
                "",
                "",
                "",
                0
            );

            return;
        }


        try {

            const response = await api.get(
                "/students/event-dates",
                {
                    params: {
                        course: course,
                        branch: branch,
                        year: year,
                        sec: sec,
                        eventName: selectedEvent
                    }
                }
            );

            setEventDates(response.data);


        } catch (err) {

            console.error(
                "Error loading event dates:",
                err
            );
        }


        getStudents(
            course,
            branch,
            year,
            sec,
            selectedEvent,
            "",
            "",
            "",
            0
        );
    };


    // ==========================================
    // EVENT DATE CHANGE
    // ==========================================

    const handleEventDateChange = async (e) => {

        const selectedDate = e.target.value;


        setEventDate(selectedDate);


        // Reset lower filters

        setStartTime("");
        setEndTime("");


        setStartTimes([]);
        setEndTimes([]);


        if (!selectedDate) {

            getStudents(
                course,
                branch,
                year,
                sec,
                eventName,
                "",
                "",
                "",
                0
            );

            return;
        }


        try {

            const response = await api.get(
                "/students/start-times",
                {
                    params: {
                        course: course,
                        branch: branch,
                        year: year,
                        sec: sec,
                        eventName: eventName,
                        eventDate: selectedDate
                    }
                }
            );

            setStartTimes(response.data);


        } catch (err) {

            console.error(
                "Error loading start times:",
                err
            );
        }


        getStudents(
            course,
            branch,
            year,
            sec,
            eventName,
            selectedDate,
            "",
            "",
            0
        );
    };


    // ==========================================
    // START TIME CHANGE
    // ==========================================

    const handleStartTimeChange = async (e) => {

        const selectedStartTime = e.target.value;


        setStartTime(selectedStartTime);


        // Reset end time

        setEndTime("");

        setEndTimes([]);


        if (!selectedStartTime) {

            getStudents(
                course,
                branch,
                year,
                sec,
                eventName,
                eventDate,
                "",
                "",
                0
            );

            return;
        }


        try {

            const response = await api.get(
                "/students/end-times",
                {
                    params: {
                        course: course,
                        branch: branch,
                        year: year,
                        sec: sec,
                        eventName: eventName,
                        eventDate: eventDate,
                        startTime: selectedStartTime
                    }
                }
            );

            setEndTimes(response.data);


        } catch (err) {

            console.error(
                "Error loading end times:",
                err
            );
        }


        getStudents(
            course,
            branch,
            year,
            sec,
            eventName,
            eventDate,
            selectedStartTime,
            "",
            0
        );
    };


    // ==========================================
    // END TIME CHANGE
    // ==========================================

    const handleEndTimeChange = (e) => {

        const selectedEndTime = e.target.value;


        setEndTime(selectedEndTime);


        getStudents(
            course,
            branch,
            year,
            sec,
            eventName,
            eventDate,
            startTime,
            selectedEndTime,
            0
        );
    };


    // ==========================================
    // NEXT PAGE
    // ==========================================

    const handleNextPage = () => {

        if (page < totalPages - 1) {

            getStudents(
                course,
                branch,
                year,
                sec,
                eventName,
                eventDate,
                startTime,
                endTime,
                page + 1
            );
        }
    };


    // ==========================================
    // PREVIOUS PAGE
    // ==========================================

    const handlePreviousPage = () => {

        if (page > 0) {

            getStudents(
                course,
                branch,
                year,
                sec,
                eventName,
                eventDate,
                startTime,
                endTime,
                page - 1
            );
        }
    };


    // ==========================================
    // RESET FILTERS
    // ==========================================

    const handleReset = () => {

        setCourse("");
        setBranch("");
        setYear("");
        setSec("");
        setEventName("");
        setEventDate("");
        setStartTime("");
        setEndTime("");


        setBranches([]);
        setYears([]);
        setSections([]);
        setEvents([]);
        setEventDates([]);
        setStartTimes([]);
        setEndTimes([]);


        // Load first 100 records

        getStudents(
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            0
        );
    };
    // ==========================================
    // Download Excel
    // ==========================================

    const downloadExcel = async () => {
        try {
            const params = {};

            if (course) params.course = course;
            if (branch) params.branch = branch;
            if (year) params.year = year;
            if (sec) params.sec = sec;
            if (eventName) params.eventName = eventName;
            if (eventDate) params.eventDate = eventDate;
            if (startTime) params.startTime = startTime;
            if (endTime) params.endTime = endTime;

            const response = await api.get("/students/download", {
                params: params
            });

            if (response.data.length === 0) {
                alert("No records available to download.");
                return;
            }

            const excelData = response.data.map((student, index) => ({
                ID: index + 1,
                Student_Name: student.studentName,
                Reg_No: student.reg_no,
                Course: student.course,
                Branch: student.branch,
                Year: student.year,
                Sem: student.sem,
                Sec: student.sec,
                Event_Name: student.event_name,
                Event_Date: student.event_date,
                Start_Time: student.start_time,
                End_Time: student.end_time
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);

            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "OD Records"
            );

            XLSX.writeFile(
                workbook,
                "OD_Records.xlsx"
            );

        } catch (error) {
            console.error("Download failed:", error);
            alert("Unable to download records.");
        }
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return date;
    };


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (time) => {

        if (!time) {
            return "";
        }

        return time;
    };


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div>

            {/* =====================================
                NAVBAR
            ====================================== */}

            <nav className="navbar">

                <h2>
                    OD Management System
                </h2>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </nav>


            {/* =====================================
                DASHBOARD
            ====================================== */}

            <div className="user-dashboard-container">

                <h1>
                    OD Dashboard
                </h1>

                <p>
                    View and filter On-Duty records
                </p>


                {/* =================================
                    FILTER SECTION
                ================================== */}

                <div className="filter-container">

                    {/* COURSE */}

                    <div className="filter-group">

                        <label>
                            Course
                        </label>

                        <select
                            value={course}
                            onChange={handleCourseChange}
                        >

                            <option value="">
                                All Courses
                            </option>

                            {courses.map(
                                (item, index) => (

                                    <option
                                        key={index}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* BRANCH */}

                    <div className="filter-group">

                        <label>
                            Branch
                        </label>

                        <select
                            value={branch}
                            onChange={handleBranchChange}
                            disabled={!course}
                        >

                            <option value="">
                                All Branches
                            </option>

                            {branches.map(
                                (item, index) => (

                                    <option
                                        key={index}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* YEAR */}

                    <div className="filter-group">

                        <label>
                            Year
                        </label>

                        <select
                            value={year}
                            onChange={handleYearChange}
                            disabled={!branch}
                        >

                            <option value="">
                                All Years
                            </option>

                            {years.map(
                                (item, index) => (

                                    <option
                                        key={index}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* SECTION */}

                    <div className="filter-group">

                        <label>
                            Section
                        </label>

                        <select
                            value={sec}
                            onChange={handleSectionChange}
                            disabled={!year}
                        >

                            <option value="">
                                All Sections
                            </option>

                            {sections.map(
                                (item, index) => (

                                    <option
                                        key={index}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* EVENT */}

                    <div className="filter-group">

                        <label>
                            Event
                        </label>

                        <select
                            value={eventName}
                            onChange={handleEventChange}
                            disabled={!sec}
                        >

                            <option value="">
                                All Events
                            </option>

                            {events.map(
                                (item, index) => (

                                    <option
                                        key={index}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* EVENT DATE */}

                    <div className="filter-group">

                        <label>
                            Event Date
                        </label>

                        <select
                            value={eventDate}
                            onChange={
                                handleEventDateChange
                            }
                            disabled={!eventName}
                        >

                            <option value="">
                                All Dates
                            </option>

                            {eventDates.map(
                                (item, index) => (

                                    <option
                                        key={index}
                                        value={item}
                                    >
                                        {formatDate(item)}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* START TIME */}

                    <div className="filter-group">

                        <label>
                            Start Time
                        </label>

                        <select
                            value={startTime}
                            onChange={
                                handleStartTimeChange
                            }
                            disabled={!eventDate}
                        >

                            <option value="">
                                All Start Times
                            </option>

                            {startTimes.map(
                                (item, index) => (

                                    <option
                                        key={index}
                                        value={item}
                                    >
                                        {formatTime(item)}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* END TIME */}

                    <div className="filter-group">

                        <label>
                            End Time
                        </label>

                        <select
                            value={endTime}
                            onChange={handleEndTimeChange}
                            disabled={!startTime}
                        >

                            <option value="">
                                All End Times
                            </option>

                            {endTimes.map(
                                (item, index) => (

                                    <option
                                        key={index}
                                        value={item}
                                    >
                                        {formatTime(item)}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* RESET */}

                    {/* <div className="filter-button">

                        <button
                            onClick={handleReset}
                        >
                            Reset
                        </button>

                    </div> */}

                    {/* Download Excel */}
                    {/* <div>
                    <button onClick={downloadExcel} className="download-button">
                        Download Excel
                    </button>
                    </div>   */}
                    <div className="filter-group">

                        <button
                            className="filter-button"
                            onClick={handleReset}
                        >
                            Reset Filters
                        </button>

                    </div>
                    <div className="filter-group">
                        <button
                            className="filter-button"
                            onClick={downloadExcel}
                        >
                            Download Excel
                        </button>
                    </div>


                </div>


                {/* =================================
                    RECORD INFORMATION
                ================================== */}

                <div className="record-info">

                    <h2>
                        OD Records
                    </h2>

                    <p>
                        Total Records: {totalRecords}
                    </p>

                </div>


                {/* =================================
                    LOADING
                ================================== */}

                {loading && (

                    <p>
                        Loading records...
                    </p>

                )}


                {/* =================================
                    ERROR
                ================================== */}

                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}


                {/* =================================
                    TABLE
                ================================== */}

                {!loading && students.length > 0 && (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Student Name
                                    </th>

                                    <th>
                                        Registration No.
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

                                {students.map(
                                    (student, index) => (

                                        <tr
                                            key={student.id}
                                        >

                                            <td>
                                                {page * 5 + index + 1}
                                            </td>


                                            <td>
                                                {student.studentName}
                                            </td>

                                            <td>
                                                {student.reg_no}
                                            </td>

                                            <td>
                                                {student.course}
                                            </td>

                                            <td>
                                                {student.branch}
                                            </td>

                                            <td>
                                                {student.year}
                                            </td>

                                            <td>
                                                {student.sem}
                                            </td>

                                            <td>
                                                {student.sec}
                                            </td>

                                            <td>
                                                {student.event_name}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    student.event_date
                                                )}
                                            </td>

                                            <td>
                                                {formatTime(
                                                    student.start_time
                                                )}
                                            </td>

                                            <td>
                                                {formatTime(
                                                    student.end_time
                                                )}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* =================================
                    NO RECORDS
                ================================== */}

                {!loading &&
                    students.length === 0 &&
                    !error && (

                        <p>
                            No OD records found.
                        </p>

                    )}


                {/* =================================
                    PAGINATION
                ================================== */}

                {totalRecords > 0 && (

                    <div className="pagination">

                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 0}
                        >
                            Previous
                        </button>


                        <span>

                            Page {page + 1}
                            {" "}
                            of
                            {" "}
                            {totalPages}

                        </span>


                        <button
                            onClick={handleNextPage}
                            disabled={
                                page >= totalPages - 1
                            }
                        >
                            Next
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default UserDashboard;
