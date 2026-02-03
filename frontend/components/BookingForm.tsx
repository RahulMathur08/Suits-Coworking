"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { bookingsAPI } from "@/lib/api";

interface BookingFormProps {
  onSuccess: () => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    member_name: "",
    membership_type: "daily",
    desk_type: "hot_desk",
    booking_date: "",
    time_slot: "morning",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await bookingsAPI.create(formData);
      toast.success("Booking created successfully!");
      onSuccess();
      // Reset form
      setFormData({
        member_name: "",
        membership_type: "daily",
        desk_type: "hot_desk",
        booking_date: "",
        time_slot: "morning",
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to create booking";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate price for display
  const calculatePrice = () => {
    const pricing: any = {
      daily: {
        hot_desk: 500,
        dedicated_desk: 800,
        private_cabin: 1500,
      },
      monthly: {
        hot_desk: 8000,
        dedicated_desk: 12000,
        private_cabin: 25000,
      },
    };
    return pricing[formData.membership_type]?.[formData.desk_type] || 0;
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Book a Desk</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="member_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Member Name *
          </label>
          <input
            type="text"
            id="member_name"
            name="member_name"
            value={formData.member_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            placeholder="Enter member name"
          />
        </div>

        <div>
          <label
            htmlFor="membership_type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Membership Type *
          </label>
          <select
            id="membership_type"
            name="membership_type"
            value={formData.membership_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
          >
            <option value="daily" className="text-black">
              Daily
            </option>
            <option value="monthly" className="text-black">
              Monthly
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="desk_type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Desk Type *
          </label>
          <select
            id="desk_type"
            name="desk_type"
            value={formData.desk_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
          >
            <option value="hot_desk" className="text-black">
              Hot Desk
            </option>
            <option value="dedicated_desk" className="text-black">
              Dedicated Desk
            </option>
            <option value="private_cabin" className="text-black">
              Private Cabin
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="booking_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Booking Date *
          </label>
          <input
            type="date"
            id="booking_date"
            name="booking_date"
            value={formData.booking_date}
            onChange={handleChange}
            min={minDate}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
          />
        </div>

        {formData.membership_type === "daily" && (
          <div>
            <label
              htmlFor="time_slot"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time Slot *
            </label>
            <select
              id="time_slot"
              name="time_slot"
              value={formData.time_slot}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            >
              <option value="morning" className="text-black">
                Morning
              </option>
              <option value="full_day" className="text-black">
                Full Day
              </option>
            </select>
          </div>
        )}

        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Estimated Amount:</span>{" "}
            <span className="text-indigo-600 font-bold text-lg">
              ₹{calculatePrice().toLocaleString("en-IN")}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formData.membership_type === "monthly"
              ? "Monthly bookings ignore time slots"
              : "Daily bookings require a time slot"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
