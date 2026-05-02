import { X } from "lucide-react";

export default function SizeChartModal({ open, onClose }) {
  if (!open) return null;

  const sizes = [
    ["L", '36"', '42"'],
    ["XL", '38"', '44"'],
    ["2XL", '40"', '46"'],
    ["3XL", '42"', '48"'],
    ["4XL", '44"', '50"'],
    ["5XL", '46"', '52"'],
    ["6XL", '48"', '54"'],
    ["7XL", '50"', '56"'],
    ["8XL", '52"', '58"'],
    ["9XL", '54"', '60"'],
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-[95%] max-w-2xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#111]">
            Size Chart
          </h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[#E5E5E5]">
            <thead>
              <tr className="bg-[#F5F5F5] text-[#111]">
                <th className="p-3 border">GENERIC SIZE</th>
                <th className="p-3 border">TO FIT WAIST</th>
                <th className="p-3 border">TO FIT HIP</th>
              </tr>
            </thead>

            <tbody>
              {sizes.map((row) => (
                <tr key={row[0]} className="text-center">
                  <td className="p-3 border">{row[0]}</td>
                  <td className="p-3 border">{row[1]}</td>
                  <td className="p-3 border">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}