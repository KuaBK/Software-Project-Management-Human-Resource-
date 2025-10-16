import React, { useState, useEffect, useContext } from "react";
import EmployeeCard from "./EmployeeCard";
import { AddPersonel } from "./AddPersonel";
import { IoMdPersonAdd } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { ThemeContext } from "../../ThemeContext";
import Loading from "../Loading/Loading";
import "../../index.css";
import { API_ROUTES } from "../../api/apiRoutes";
import axiosInstance from "../../api/axiosInstance";

function AllEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.PERSONNELS.GET_ALL);
        const data = response.data.result || [];
        setEmployees(data);
      } catch (err) {
        setError("Failed to fetch employees. Please try again later.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const departmentOptions = [
    "All",
    ...new Set(employees.map((e) => e.departmentName || "Not Assigned")),
  ];
  const genderOptions = ["All", "MALE", "FEMALE"];
  const roleOptions = ["All", "MANAGER", "EMPLOYEE"];

  const filteredEmployees = employees.filter((emp) => {
    const matchDepartment =
      selectedDepartment === "All" || emp.departmentName === selectedDepartment;
    const matchGender =
      selectedGender === "All" || emp.gender === selectedGender;
    const matchRole = selectedRole === "All" || emp.role === selectedRole;
    const matchSearch = `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchDepartment && matchGender && matchRole && matchSearch;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-500 text-lg py-10">{error}</div>
    );

  return (
    <div
      className={`min-h-screen py-8 px-6 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      {/* Header: Title + Add Button */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Employees</h2>

        <AddPersonel>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            <IoMdPersonAdd className="w-5 h-5" />
            <span className="font-medium">Add New Personel</span>
          </button>
        </AddPersonel>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-[400px]">
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-gray-400 text-gray-700"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
            />
          </svg>
        </div>

        {/* Filter Button */}
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200"
          >
            <FiFilter className="text-lg text-gray-500" />
            <span className="font-medium">Filter</span>
          </button>
        </div>
      </div>

      {/* Filter Panel (Dropdown style) */}
      {showFilter && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                {departmentOptions.map((dept, idx) => (
                  <option key={idx} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Gender
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                {genderOptions.map((g, idx) => (
                  <option key={idx} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                {roleOptions.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center text-lg">No employees found.</div>
      ) : (
        <>
          <EmployeeCard employees={currentEmployees} />

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <ul className="flex space-x-2">
              <li>
                <button
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i}>
                  <button
                    className={`px-4 py-2 rounded ${
                      currentPage === i + 1
                        ? "bg-purple-700 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-purple-100"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default AllEmployee;
