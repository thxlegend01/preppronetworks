const scheduleData = [
  { sno: 1, qft: "QFT 1", name: "Full Test - 1 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "30 November 2025", available: true },
  { sno: 2, qft: "QFT 2", name: "Full Test - 2 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "7 December 2025", available: true },
  { sno: 3, qft: "QFT 3", name: "Full Test - 3 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "14 December 2025", available: true },
  { sno: 4, qft: "QFT 4", name: "Full Test - 4 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "17 December 2025", available: false },
  { sno: 5, qft: "QFT 5", name: "Full Test - 5 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "20 December 2025", available: false },
  { sno: 6, qft: "QFT 6", name: "Full Test - 6 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "23 December 2025", available: false },
  { sno: 7, qft: "QFT 7", name: "Full Test - 7 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "26 December 2025", available: false },
  { sno: 8, qft: "QFT 8", name: "Full Test - 8 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "29 December 2025", available: false },
  { sno: 9, qft: "QFT 9", name: "Full Test - 9 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "1 January 2026", available: false },
  { sno: 10, qft: "QFT 10", name: "Full Test - 10 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "4 January 2026", available: false },
  { sno: 11, qft: "QFT 11", name: "Full Test - 11 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "7 January 2026", available: false },
  { sno: 12, qft: "QFT 12", name: "Full Test - 12 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "10 January 2026", available: false },
  { sno: 13, qft: "QFT 13", name: "Full Test - 13 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "12 January 2026", available: false },
  { sno: 14, qft: "QFT 14", name: "Full Test - 14 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "14 January 2026", available: false },
  { sno: 15, qft: "QFT 15", name: "Full Test - 15 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "15 January 2026", available: false },
  { sno: 16, qft: "QFT 16", name: "Full Test - 16 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 17, qft: "QFT 17", name: "Full Test - 17 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 18, qft: "QFT 18", name: "Full Test - 18 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 19, qft: "QFT 19", name: "Full Test - 19 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 20, qft: "QFT 20", name: "Full Test - 20 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 21, qft: "QFT 21", name: "Full Test - 21 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 22, qft: "QFT 22", name: "Full Test - 22 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 23, qft: "QFT 23", name: "Full Test - 23 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 24, qft: "QFT 24", name: "Full Test - 24 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 25, qft: "QFT 25", name: "Full Test - 25 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 26, qft: "QFT 26", name: "Full Test - 26 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 27, qft: "QFT 27", name: "Full Test - 27 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 28, qft: "QFT 28", name: "Full Test - 28 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 29, qft: "QFT 29", name: "Full Test - 29 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
  { sno: 30, qft: "QFT 30", name: "Full Test - 30 (with Video Solutions)", syllabus: "JEE Main Full Syllabus", availability: "From 15th Feb 2026 onwards", available: false },
];

const TestSchedule = () => {
  return (
    <section id="schedule" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mathango <span className="text-gradient">2026 Schedule</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            15 Full Tests will be conducted before the Jan attempt and 15 would be conducted after Jan 2026 Attempt
          </p>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/20 border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">SNo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">QFT</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Test Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary hidden md:table-cell">Syllabus</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Availability</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((item, index) => (
                  <tr 
                    key={item.sno} 
                    className={`border-b border-border/50 transition-colors hover:bg-primary/5 ${item.available ? 'bg-success/5' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.sno}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{item.qft}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{item.syllabus}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={item.available ? 'text-success font-medium' : 'text-muted-foreground'}>
                        {item.available ? '✓ ' : ''}{item.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 glass-card rounded-xl p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">Note:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Schedule is subject to change. Any change(s) made will be notified.</li>
            <li>The dates mentioned are the uploading dates. Once a test is uploaded, you can take it any time.</li>
            <li>Tests will be uploaded at 9 AM (IST) on the mentioned uploading dates.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TestSchedule;
