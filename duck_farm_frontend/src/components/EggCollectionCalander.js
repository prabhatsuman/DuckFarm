import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEggForm from "./AddEggForm";
import { FiPlus } from "react-icons/fi";

const localizer = momentLocalizer(moment);

const EggCollectionCalendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddEggForm, setShowAddEggForm] = useState(false);

  const fetchEggCollections = async (year, month) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/egg_stock/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === month && itemDate.getFullYear() === year;
      });
      const formattedEvents = filteredData.map((item) => ({
        title: `Eggs Collected: ${item.quantity}`,
        start: new Date(item.date),
        end: new Date(item.date),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch egg collection data:", error);
    }
  };

  useEffect(() => {
    fetchEggCollections(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const handleNavigate = (date) => {
    if (
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      setCurrentDate(date);
    }
  };

  const handleAddEgg = () => {
    setShowAddEggForm(true);
  };

  const handleEggAdded = () => {
    setShowAddEggForm(false);
    fetchEggCollections(currentDate.getFullYear(), currentDate.getMonth());
  };

  const CustomToolbar = ({ date, onNavigate }) => {
    const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());

    const months = [
      { value: 0, label: "January" },
      { value: 1, label: "February" },
      { value: 2, label: "March" },
      { value: 3, label: "April" },
      { value: 4, label: "May" },
      { value: 5, label: "June" },
      { value: 6, label: "July" },
      { value: 7, label: "August" },
      { value: 8, label: "September" },
      { value: 9, label: "October" },
      { value: 10, label: "November" },
      { value: 11, label: "December" },
    ];

    const years = Array.from(
      new Array(10),
      (val, index) => new Date().getFullYear() - index
    );

    const handleMonthChange = (event) => {
      const newMonth = parseInt(event.target.value, 10);
      setSelectedMonth(newMonth);
      onNavigate(new Date(selectedYear, newMonth, 1));
    };

    const handleYearChange = (event) => {
      const newYear = parseInt(event.target.value, 10);
      setSelectedYear(newYear);
      onNavigate(new Date(newYear, selectedMonth, 1));
    };

    return (
      <div className="flex justify-between items-center px-6 py-4 ">
        <div className="flex items-center justify-end">
          <select
            className="mr-2 px-4 py-2 border rounded"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <div className="text-xl font-bold">
            {months[selectedMonth].label} {selectedYear}
          </div>
        </div>
        <button
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-wrap"
          onClick={handleAddEgg}
        >
          <FiPlus className="mr-2" /> Add Egg
        </button>
        {showAddEggForm && (
          <AddEggForm
            onClose={() => setShowAddEggForm(false)}
            onEggAdded={handleEggAdded}
          />
        )}
      </div>
    );
  };

  return (
    <div className="m-auto w-full max-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Egg Collection Calendar</h1>
      <div className="bg-white shadow-md rounded-md w-full">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          className="p-4"
          views={[Views.MONTH]}
          defaultView={Views.MONTH}
          date={currentDate}
          onNavigate={handleNavigate}
          components={{
            toolbar: (props) => (
              <CustomToolbar {...props} onNavigate={handleNavigate} />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default EggCollectionCalendar;
