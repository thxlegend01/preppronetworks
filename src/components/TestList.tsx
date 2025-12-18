import TestCard from "@/components/TestCard";

const availableTests = [
  { 
    id: "qft1", 
    title: "QFT 1 - Full Test 1", 
    duration: 180, 
    questions: 90, 
    subject: "JEE Main Full Syllabus", 
    externalUrl: "https://stark-beta-q8u9.onrender.com/mathongo/tests/qft1/qft1.html?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0MmNjMjc2NGZkZjQ0YWRkYWU0Yzc5IiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE3NjYwNDI4NzYsImV4cCI6MTc2NjQwMjg3Nn0.ilkxqTxdXtwYZ-K7aksriShMASURMKurHGfdAFGFwvA"
  },
  { 
    id: "qft2", 
    title: "QFT 2 - Full Test 2", 
    duration: 180, 
    questions: 90, 
    subject: "JEE Main Full Syllabus", 
    externalUrl: "https://stark-beta-q8u9.onrender.com/mathongo/tests/qft2/qft2.html?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0MmNjMjc2NGZkZjQ0YWRkYWU0Yzc5IiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE3NjYwNDI4NzYsImV4cCI6MTc2NjQwMjg3Nn0.ilkxqTxdXtwYZ-K7aksriShMASURMKurHGfdAFGFwvA"
  },
  { 
    id: "qft3", 
    title: "QFT 3 - Full Test 3", 
    duration: 180, 
    questions: 90, 
    subject: "JEE Main Full Syllabus", 
    externalUrl: "https://stark-beta-q8u9.onrender.com/mathongo/tests/qft3/qft3.html?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0MmNjMjc2NGZkZjQ0YWRkYWU0Yzc5IiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE3NjYwNDI4NzYsImV4cCI6MTc2NjQwMjg3Nn0.ilkxqTxdXtwYZ-K7aksriShMASURMKurHGfdAFGFwvA"
  },
];

const TestList = () => {
  return (
    <section id="tests" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Available <span className="text-gradient">Test Series</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose from our collection of Mathango 2026 tests. Practice in real CBT environment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.map((test, index) => (
            <div 
              key={test.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TestCard {...test} />
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <div className="glass-card inline-block rounded-xl px-6 py-4">
            <p className="text-muted-foreground">
              <span className="text-primary font-semibold">More tests coming soon!</span> Check the schedule below for upcoming releases.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestList;
