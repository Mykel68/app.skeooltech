import React from "react";

export default function GradingSystem() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-center bg-purple-600 text-white py-2 rounded mb-4">
        GRADING SYSTEM
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-purple-100">
            <tr>
              <th className="border border-gray-300 p-2">Grade</th>
              <th className="border border-gray-300 p-2">A1</th>
              <th className="border border-gray-300 p-2">B2</th>
              <th className="border border-gray-300 p-2">B3</th>
              <th className="border border-gray-300 p-2">C4</th>
              <th className="border border-gray-300 p-2">C5</th>
              <th className="border border-gray-300 p-2">C6</th>
              <th className="border border-gray-300 p-2">D7</th>
              <th className="border border-gray-300 p-2">E8</th>
              <th className="border border-gray-300 p-2">F9</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">
                Score
              </td>
              <td className="border border-gray-300 p-2 text-center">75-100</td>
              <td className="border border-gray-300 p-2 text-center">70-74</td>
              <td className="border border-gray-300 p-2 text-center">65-69</td>
              <td className="border border-gray-300 p-2 text-center">60-64</td>
              <td className="border border-gray-300 p-2 text-center">55-59</td>
              <td className="border border-gray-300 p-2 text-center">50-54</td>
              <td className="border border-gray-300 p-2 text-center">45-49</td>
              <td className="border border-gray-300 p-2 text-center">40-44</td>
              <td className="border border-gray-300 p-2 text-center">0-39</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">
                Remark
              </td>
              <td className="border border-gray-300 p-2 text-center">
                Excellent
              </td>
              <td className="border border-gray-300 p-2 text-center">
                Very Good
              </td>
              <td className="border border-gray-300 p-2 text-center">Good</td>
              <td className="border border-gray-300 p-2 text-center">Credit</td>
              <td className="border border-gray-300 p-2 text-center">Credit</td>
              <td className="border border-gray-300 p-2 text-center">Credit</td>
              <td className="border border-gray-300 p-2 text-center">Pass</td>
              <td className="border border-gray-300 p-2 text-center">Pass</td>
              <td className="border border-gray-300 p-2 text-center">Fail</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
