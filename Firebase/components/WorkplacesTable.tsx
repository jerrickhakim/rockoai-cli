"use client";
import { useEffect, useState } from "react";

interface Workplace {
  id: string;
  name: string;
  createdBy: string;
  subscriptionStatus: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

async function getWorkplaces(): Promise<Workplace[]> {
  // This is a placeholder. In a real app, you'd fetch this from your backend.
  return [
    {
      id: "0WT8nlQaSPLTdMZiFuvk",
      name: "May-21",
      createdBy: "fuajG5TWRQVro3T6bEiddKSG80V2",
      subscriptionStatus: "trial",
      createdAt: { _seconds: 1747846627, _nanoseconds: 369000000 },
    },
    {
      id: "0wNGYvG0VL7sR1AB3o1V",
      name: "lkml",
      createdBy: "fuajG5TWRQVro3T6bEiddKSG80V2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1735680842, _nanoseconds: 606000000 },
    },
    {
      id: "8cSPnt4okrUoWjfJNqrt",
      name: "venuerun",
      createdBy: "eTOZuBj0UIVvjRSO2jTAwds3toR2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1729552961, _nanoseconds: 688000000 },
    },
    {
      id: "9HmVRNwCjju0d7xHbnBW",
      name: "kln",
      createdBy: "fuajG5TWRQVro3T6bEiddKSG80V2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1735680858, _nanoseconds: 141000000 },
    },
    {
      id: "BiWrX54NfyuKoMhr3H0O",
      name: "Boat launch example",
      createdBy: "fuajG5TWRQVro3T6bEiddKSG80V2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1738690492, _nanoseconds: 333000000 },
    },
    {
      id: "D3LvJ2d8DkoBuk4v3AlZ",
      name: "Fileie",
      createdBy: "fuajG5TWRQVro3T6bEiddKSG80V2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1744401383, _nanoseconds: 602000000 },
    },
    {
      id: "DHjyuN892AWSYNsg48ho",
      name: "Test",
      createdBy: "hEjyqRpbB5YcRoiWP0NuD4MMcAK2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1729499120, _nanoseconds: 805000000 },
    },
    {
      id: "EpfQ4Svg4d0SRYdH7K5E",
      name: "Booking",
      createdBy: "fuajG5TWRQVro3T6bEiddKSG80V2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1735660507, _nanoseconds: 954000000 },
    },
    {
      id: "JVUzmGC818KuJC2ugTtF",
      name: "Demo",
      createdBy: "hEjyqRpbB5YcRoiWP0NuD4MMcAK2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1729538573, _nanoseconds: 549000000 },
    },
    {
      id: "KdBXd2wg9DjB3JAjjvrv",
      name: "new",
      createdBy: "WnU80N2jq1O0a5jomDaJYXxmBww1",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1737272098, _nanoseconds: 845000000 },
    },
    {
      id: "extqN6zs8jgO3VmcOfBg",
      name: "fadsfaf",
      createdBy: "fuajG5TWRQVro3T6bEiddKSG80V2",
      subscriptionStatus: "trial",
      createdAt: { _seconds: 1747846652, _nanoseconds: 418000000 },
    },
    {
      id: "uddXjulAyIU420Qnliun",
      name: "Test",
      createdBy: "hEjyqRpbB5YcRoiWP0NuD4MMcAK2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1728764565, _nanoseconds: 615000000 },
    },
    {
      id: "v5JKtMOGd8RhasHZvgk0",
      name: "fasdfaf",
      createdBy: "hEjyqRpbB5YcRoiWP0NuD4MMcAK2",
      subscriptionStatus: "active",
      createdAt: { _seconds: 1728402967, _nanoseconds: 55000000 },
    },
  ];
}

export default function WorkplacesTable() {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getWorkplaces();
        setWorkplaces(data);
      } catch (error) {
        console.error("Error fetching workplaces:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDate = (timestamp: { _seconds: number }) => {
    return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Workplaces</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card border border-border">
          <thead>
            <tr className="bg-gray-100 dark:bg-card">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Created By</th>
              <th className="py-2 px-4 border-b text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {workplaces.map((workplace) => (
              <tr
                key={workplace.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-2 px-4 border-b">{workplace.name}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      workplace.subscriptionStatus === "active"
                        ? "bg-success/20 text-success"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {workplace.subscriptionStatus}
                  </span>
                </td>
                <td className="py-2 px-4 border-b truncate max-w-xs">
                  {workplace.createdBy}
                </td>
                <td className="py-2 px-4 border-b">
                  {formatDate(workplace.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
